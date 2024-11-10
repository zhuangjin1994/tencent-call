<template>
  <el-container style="margin: 0 10px;" class="demand-detail">
    <el-header height="">
      <div class="btn-header">
        <div>
          <span class="demand-num">{{ demandInfo.demandNum }}</span>
          <span class="demand-status">
            <span :style="{ background: getColor(demandInfo.demandStatus) }" class="dot"></span>
            <span>{{ DemandTabStatusEnum[demandInfo.demandStatus] }}</span>
          </span>
        </div>
        <div v-if="!isTalentDetail">
          <el-button
            size="mini"
            class="btn"
            v-for="item in btns"
            :key="item.name"
            :icon="item.icon"
            :disabled="item.disabled"
            @click="handleClick(item.type)"
            type="primary" >{{item.name}}
          </el-button>
        </div>
      </div>
      <span class="main-title">
        <tool-tips :contentText="demandInfo.title"></tool-tips>
      </span>
    </el-header>
    <el-container style="width:100%">
      <el-aside width="160px">
        <el-menu @select="handleClickMenu" :default-openeds="['disable', 'enable']" default-active="detail">
          <el-submenu index="enable">
            <template slot="title"><i class="el-icon-s-order" />需求信息</template>
            <el-menu-item index="detail">需求详情</el-menu-item>
          </el-submenu>
          <el-submenu index="disable">
            <template slot="title"><i class="el-icon-s-custom" />需求专家</template>
            <el-menu-item v-for="item in expertCategory" :key="item.key" :index="item.key">
              <span>{{ item.name }} </span><span :class="+item.num > 0 ? 'tip-num' : ''">({{ item.num }})</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-collapse v-if="mainType == 'detail'" v-model="activeNames">
          <el-collapse-item name="1" title="基本信息">
            <demand-content :data='demandInfo' />
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              需求附件
              <el-button v-if="fileLists && fileLists.length" class="collapse-btn" type="text"
                @click.stop="handleBatchDownload">
                <i class="el-icon-download" style="margin-right:2px"></i>
                一键下载
              </el-button>
            </template>
            <file-list :data="fileLists" />
          </el-collapse-item>
          <el-collapse-item v-if="!isTalentDetail" name="3" title="审批记录">
            <audit-steps :data="auditHistory" />
          </el-collapse-item>
          <el-collapse-item v-if="!isTalentDetail" name="4" title="需求动态">
            <demand-activity :data="activities" />
          </el-collapse-item>
        </el-collapse>
        <expert-table ref="expertTable" :type="tableKey" :data="expertData" @refresh="refreshExpertList" v-else />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import uploadCos from '@/mixins/uploadCos.js';
import ToolTips from '@/components/ToolTips';
import {
  copyDemand,
  getDemandInfo,
  getAuditHistory,
  getActivities,
  recallDemand,
  getExpertList,
  getAttatchmentList,
  finishDemand,
  activateDemand,
  deleteDemand,
  demandBatchAccept,
  browseDemand,
  getDataPermission
} from '@/api/demand.js';
import AuditSteps from '@/components/DemandDetail/auditSteps.vue';
import DemandActivity from '@/components/DemandDetail/demandActivity.vue';
import FileList from '@/components/DemandDetail/fileList.vue';
import DemandContent from '@/components/DemandDetail/demandContent';
import ExpertTable from './components/expertTable';
import { DemandTabStatusEnum } from '@/enums/index.js';
export default {
  mixins: [common, uploadCos],
  components: {
    FileList,
    ToolTips,
    AuditSteps,
    ExpertTable,
    DemandContent,
    DemandActivity,
  },
  data() {
    return {
      imgSrc: '',
      mainType: 'detail',
      tableKey: 'detail',
      deliverList: [],
      auditHistory: [],
      allExpertData: [],
      expertData: [],
      activities: [],
      fileLists: [],
      demandInfo: {},
      demandContent: {},
      activeNames: ['1', '2', '3', '4'],
      expertCategory: [
        { name: '待选择', key: 'chooseList', num: '0' },
        { name: '已选择', key: 'confirmList', num: '0' },
        { name: '待验收', key: 'checkList', num: '0' },
        { name: '已完成', key: 'finishList', num: '0' }
      ],
      DemandTabStatusEnum,
      // dialog
      fileParams: {
        businessId: '',
        attachmentType: 'description'
      },
      dialogVisible: false
    };
  },
  computed: {
    btns() {
      let data = [
        { name: '复制', type: 'copy', icon: 'el-icon-document-copy' }
      ];
      const { demandStatus, demander, membersName } = this.demandInfo;
      // 如果角色是[需求方/审批人]并且[该需求不是本人创建的]或者[需求状态已完成]时按钮不会出现；三期新加逻辑：项目成员对需求同样有编辑权限
      if (!(!this.isAdministrator && (demander !== this.userId || demandStatus === 'end')) || (membersName || '').includes(this.userId)) {
        data.unshift({ name: '编辑', type: 'edit', icon: 'el-icon-edit' });
      }
      // 需在[需求为自己创建]并且[审批中]时可撤回
      if (this.isSelf && ['approving'].includes(demandStatus)) {
        data.push({ name: '撤回', type: 'recall', icon: 'el-icon-refresh-left' });
      }
      // 需在[需求为自己创建]并且[待验收状态]时可验收
      if (this.isSelf && demandStatus === 'to_be_accepted') {
        data.push({ name: '验收', type: 'accept', icon: 'el-icon-s-claim', disabled: this.mainType == 'detail' || this.tableKey != 'checkList' });
      }
      // 需在[需求为自己创建]并且[进行中-未响应/已响应/已结束状态]时可结束
      if (this.isSelf && ['to_be_responsed', 'to_be_confirmed', 'finished'].includes(demandStatus)) {
        data.push({ name: '结束', type: 'end', icon: 'el-icon-close' });
      }
      // 需在[需求为自己创建]并且[已结束状态]即可激活
      if (this.isSelf && demandStatus === 'end') {
        data.push({ name: '激活', type: 'activate', icon: 'el-icon-thumb' });
      }
      return data;
    },
    id() {
      return this.$route.query.id;
    },
    openeds: {
      get() {
        return this.deliverList.length ? this.deliverList.map(item => item.supplierName) : [];
      },
      set(nVal) {
        return nVal;
      }
    },
    // 非智库详情页面
    isTalentDetail() {
      return this.$route.query.type === 'talent';
    },
    // 当前需求是否自己创建
    isSelf() {
      return this.userId === this.demandInfo.demander;
    },
    // 当前角色是否是当前需求的项目成员（三期放开项目成员的编辑权限
    isMember() {
      const {membersName = '' } = this.demandInfo;
      return (membersName || '').includes(this.userId);
    },
    // 当前角色是管理员和超管
    isAdministrator() {
      return ['coAdministrator', 'suAdministrator'].includes(this.roles[0]);
    },
    // 如果角色是[需求方/审批人]并且[该需求不是本人创建的]或者[需求状态已完成]时按钮不会出现
    showEditBtn() {
      const { demandStatus, demander } = this.demandInfo;
      return !this.isAdministrator && (demander !== this.userId || demandStatus === 'end'); 
    },
    // 需在[需求为自己创建]并且[审批中或未响应]时可撤回
    showReallBtn() {
      const { demandStatus } = this.demandInfo;
      return this.isSelf && ['approving', 'to_be_responsed'].includes(demandStatus);
    },
    // 需在[需求为自己创建]并且[待验收状态]时可验收
    showAcceptBtn() {
      const { demandStatus } = this.demandInfo;
      return this.isSelf && demandStatus === 'to_be_accepted';
    },
    // 需在[需求为自己创建]并且[进行中-未响应/已响应/已结束状态]时可结束
    showEndBtn() {
      const { demandStatus } = this.demandInfo;
      return this.isSelf && ['to_be_responsed', 'to_be_confirmed', 'finished'].includes(demandStatus);
    },
    // 需在[需求为自己创建]并且[已结束状态]即可激活
    showActivateBtn() {
      return this.isSelf && this.demandInfo.demandStatus === 'end';
    },
    ...mapGetters(['departmentName', 'userId', 'roles'])
  },
  methods: {
    initData() {
      // 智库详情页
      if (this.isTalentDetail) {
        browseDemand({ demandId: this.id }).then(res => {
          // console.log('计数成功');
        }).catch(err => { });
        this.fetchData();
        this.getExpertList();
        this.getFileLists();
      } else {
        let params = {
          type: 'demandDetail',
          id: this.$route.query.id
        };
        getDataPermission(params).then(res => {
          if (res.data == 'true') {
            this.fetchData();
            this.getExpertList();
            this.getFileLists();
            this.getAuditHistory();
            this.getActivities();
          } else {
            this.$router.push('/demand/list');
            this.$message.error('您暂无权限访问该页面，已返回首页');
          }
        }).catch(err => {
          // this.$message.error('权限查询失败，请稍后再试')
          this.$router.push('/demand/list');
        });
      }
      // this.fetchData()
      // this.getExpertList()
      // this.getFileLists()
      // if (!this.isTalentDetail) {
      //   this.getAuditHistory()
      //   this.getActivities()
      // } else {
      //   browseDemand({ demandId: this.id }).then(res => {
      //     // console.log('计数成功');
      //   }).catch(err => { })
      // }
    },
    async handleClick(operation) {
      const { type, id } = this.$route.query;
      switch (operation) {
        case 'edit':
          this.$router.push({ path: '/demand/edit', query: { id, type } });
          break;
        case 'accept': {
          let confirmIdList = this.$refs.expertTable.multipleSelection.map(item => item.confirmId);
          if (!confirmIdList.length) {
            this.$message.error('暂无数据可验收');
            return;
          }
          this.confirmOperate('批量验收选中数据', demandBatchAccept, { confirmIdList }, 'refresh_accept');
          break;
        }
        case 'copy':
          this.confirmOperate('将该需求复制到草稿箱', copyDemand, { demandId: id }, 'refresh');
          break;
        case 'end':
          await this.confirmOperate('结束当前需求', finishDemand, { demandId: id }, 'refresh');
          break;
        case 'recall':
          this.confirmOperate('撤回当前需求', recallDemand, { demandId: id }, 'refresh_recall');
          break;
        case 'delete':
          this.confirmOperate('删除当前需求', deleteDemand, { demandId: id }, 'refresh_delete');

          break;
        case 'activate':
          this.confirmOperate('激活当前需求', activateDemand, { demandId: id }, 'refresh');
      }
    },

    fetchData() {
      getDemandInfo({ demandId: this.id }).then(res => {
        this.demandInfo = res.data || {};
        const { purpose, background, expertRequirement, interviewQuestion } = this.demandInfo;
        this.demandContent = { purpose, background, expertRequirement, interviewQuestion };
      }).catch(_ => { });
    },

    handleClickMenu(index) {
      if (index === 'detail') {
        this.mainType = 'detail';
      } else {
        this.tableKey = index;
        this.mainType = 'table';
        this.expertData = this.allExpertData[index];
      }
    },

    getExpertList() {
      getExpertList({ demandId: this.id }).then(res => {
        this.allExpertData = res.data || {};
        for (let key in this.allExpertData) {
          this.expertCategory.forEach(item => {
            if (item.key === key) {
              item.num = this.allExpertData[key].length;
            }
          });
        }
        this.handleClickMenu(this.tableKey);
      }).catch(_ => { });
    },

    getFileLists() {
      const params = {
        businessId: this.id,
        attachmentType: 'description'
      };
      getAttatchmentList(params).then(res => {
        this.fileLists = res.data || [];
      }).catch(_ => { });
    },

    handleBatchDownload() {
      if (!this.fileLists.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileLists.map(item => ({ key: item.attachmentKey, name: item.attachmentName }));
      this.batchDownloadFile(files);
    },

    getAuditHistory() {
      getAuditHistory({ demandId: this.id }).then(res => {
        this.auditHistory = res.data || [];
      }).catch(_ => { });
    },

    // 获取需求动态
    refreshData(type) {
      if (type === 'refresh_delete') {
        this.$router.push('/demand/drafts');
      } else if (type === 'refresh_accept') {
        this.refreshExpertList();
      } else if (type === 'refresh_recall') {
        this.$router.push('/demand/drafts');
      } else {
        this.fetchData();
        this.getActivities();
      }
    },

    getActivities() {
      getActivities({ demandId: this.id }).then(res => {
        this.activities = res.data || [];
      }).catch(_ => { });
    },

    refreshExpertList() {
      this.fetchData();
      this.getExpertList();
    },

    showDemandFile(type, id) {
      this.fileParams = {
        businessId: id,
        attachmentType: type
      };
      this.dialogVisible = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'DemandEdit') {
      const breadList = [
        { title: '需求跟踪', path: { path: '/demand/detail', query: this.$route.query } },
        { title: '需求编辑', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else {
      window.localStorage.setItem('customBread', '');
    }
    next();
  },
  mounted() {
    this.initData();
  },
  watch: {
    id: function (newId) {
      if (newId) {
        this.initData();
      }
    },
    // 每次切换menu刷新数据，以便第一时间接收到供应商的响应数据更新
    tableKey: function (newId) {
      if (newId) {
        this.getExpertList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.el-container {
  height: 100%;
  overflow: hidden;
  background: #fff;
}

.el-header {
  background-color: #fff;
  color: #191b27;
  padding: 10px 10px 17px 20px;
  font-size: 20px;
  border-bottom: 2px solid #eee;

  .demand-num {
    font-weight: 600;
    font-size: 16px;
  }

  .btn-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .demand-status {
      color: #191b27;
      font-size: 12px;
      font-weight: 600;
      margin-left: 16px;
    }

    .btns {
      margin-right: 10px;
      line-height: 32px;
    }

    .dot {
      content: '';
      display: inline-block;
      margin-right: 6px;
      vertical-align: middle;
      margin-bottom: 2px;
      @include circle(4px, #016FFA);
    }
  }

  .main-title {
    display: block;
    font-size: 14px;
    margin-top: 4px;
  }
}

.el-aside {
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  color: #333;
  text-align: center;
  border-right: 1px solid #E6EBF5;

  .el-submenu__title {
    text-align: left;
  }

  .tip-num {
    color: red;
  }
}

.el-main {
  padding: 0;
  overflow-x: hidden;
  background-color: #fff;
  color: #333;
  height: 100%;
}
</style>
<style lang="scss">
.demand-detail {

  .el-submenu__title,
  .el-menu-item {
    text-align: left;
  }

  .el-menu-item {
    padding-left: 48px !important;
  }

  .el-collapse-item__content {
    padding: 10px 0 25px 40px;
  }
}
</style>
