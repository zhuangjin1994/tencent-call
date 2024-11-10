<template>
  <!-- <div> -->
  <el-container class="check-detail">
    <el-header height="">
      <div class="btn-header">
        <div>
          <span class="demand-num">{{demandInfo.demandNum}}</span>
          <span class="demand-status">
            <span class="dot" :style="{background:getColor(demandInfo.demandStatus)}"></span> 
            <span>{{DemandTabStatusEnum[demandInfo.demandStatus]}}</span>
          </span>
        </div>
        <div>
          <span class="btns">
            <el-button
              size="mini"
              class="btn"
              v-for="item in btns"
              :key="item.name"
              :icon="item.icon"
              @click="handleClick(item.type)"
              type="primary" >{{item.name}}
            </el-button>
          </span>
        </div>
      </div>
      <span class="main-title">
        <tool-tips :contentText="demandInfo.title"></tool-tips>
      </span>
    </el-header>
    <el-main>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1" title="基本信息">
          <demand-content :data='demandInfo' />
        </el-collapse-item>
        <el-collapse-item name="2" title="需求附件">
          <template slot="title">
            需求附件
            <el-button v-if="fileLists && fileLists.length" class="collapse-btn" type="text" @click.stop="handleBatchDownload">
              <i class="el-icon-download" style="margin-right:2px"></i>
              一键下载
            </el-button>
          </template>
          <file-list :data="fileLists"/>
        </el-collapse-item>
        <el-collapse-item name="3" title="审批记录">
          <audit-steps :data="auditHistory"/>
        </el-collapse-item>
        <el-collapse-item name="4" title="需求动态">
          <demand-activity :data="activities"/>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
  <!-- </div> -->
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import ToolTips from '@/components/ToolTips';
import uploadCos from '@/mixins/uploadCos.js';
import { DemandTabStatusEnum } from '@/enums/index.js';
import DemandActivity from '@/components/DemandDetail/demandActivity.vue';
import { 
  auditDemand,
  getDemandInfo,
  getAttatchmentList,
  getAuditHistory,
  getActivities,
  recallDemand,
  copyDemand,
  deleteDemand,
  getDataPermission
} from '@/api/demand.js';
import DemandContent from '@/components/DemandDetail/demandContent';
import FileList from '@/components/DemandDetail/fileList.vue';
import AuditSteps from '@/components/DemandDetail/auditSteps.vue';
export default {
  mixins: [common, uploadCos],
  components: {
    FileList,
    ToolTips,
    AuditSteps,
    DemandContent,
    DemandActivity
  },
  computed: {
    btns() {
      let data = [
        { name: '复制', type: 'copy', icon: 'el-icon-document-copy' }
      ];
      const { demandStatus, demander } = this.demandInfo;
      // 待审批状态的需求不会出现编辑按钮
      if (demandStatus && demandStatus !== 'approving') {
        data.unshift({ name: '编辑', type: 'edit', icon: 'el-icon-edit' });   
      }
      // 需在[需求为自己创建]并且[审批中]时可撤回
      if (this.isSelf && ['approving'].includes(demandStatus)) {
        data.push({ name: '撤回', type: 'recall', icon: 'el-icon-refresh-left' });
      }
      if (this.$route.query.type == 'draftsEdit') {
        data.push({ name: '删除', type: 'delete', icon: 'el-icon-delete' });
      }
      return data;
    },
    id() {
      return this.$route.query.id;
    },
    ...mapGetters(['departmentName', 'userId', 'roles']),
    // 当前角色是管理员和超管
    isAdministrator() {
      return ['coAdministrator', 'suAdministrator'].includes(this.roles[0]);
    },
    // 当前需求是否自己创建
    isSelf() {
      return this.userId === this.demandInfo.demander;
    },
    // 待审批状态的需求不会出现编辑按钮
    noEditBtn() {
      const { demandStatus, demander } = this.demandInfo;
      return demandStatus === 'approving';
    },
    // 需在[需求为自己创建]并且[审批中或未响应]时可撤回
    showReallBtn() {
      const { demandStatus } = this.demandInfo;
      return this.isSelf && ['approving', 'to_be_responsed'].includes(demandStatus);
    }
  },
  data() {
    return {
      demandInfo: {},
      DemandTabStatusEnum,
      activeNames: ['1', '2', '3', '4'],
      fileLists: [],
      auditHistory: [],
      activities: [],
      auditOpinion: '',
      loading: {
        agree: false,
        reject: false
      },
      rules: {
        auditOpinion: [{ max: 999, message: '备注最多填写999字符', trigger: 'change' }]
      }
    };
  },
  methods: {
    fetchData() {
      getDemandInfo({demandId: this.id}).then(res => {
        this.demandInfo = res.data || {};
        // 通过需求详情的链接进来，如果有审批权限再重定向前往审批页面
        const { approver, actionName, demandStatus } = this.demandInfo;
        if (demandStatus === 'approving' && (['业务审批人', '统管审批人'].includes(actionName) && approver.includes(this.userId))) {
          this.$router.push({ path: '/demand/check-detail', query: { id: this.id }});
        }
      }).catch(_ => {});
    },

    getFileLists() {
      const params = {
        businessId: this.id,
        attachmentType: 'description'
      };
      getAttatchmentList(params).then(res => {
        this.fileLists = res.data || [];
      }).catch(_ => {});
    },

    getAuditHistory() {
      getAuditHistory({demandId: this.id}).then(res => {
        this.auditHistory = res.data || [];
      }).catch(_ => {});
    },

    async handleClick(operation) {
      const { type, id } = this.$route.query;
      switch (operation) {
        case 'edit':
          this.$router.push({ path: '/demand/edit', query: { id, type } });
          break;
        case 'copy':
          this.confirmOperate('将该需求复制到草稿箱', copyDemand, { demandId: id }, 'refresh');
          break;
        case 'recall':
          this.confirmOperate('撤回当前需求', recallDemand, { demandId: id }, 'refresh_recall');
          break;
        case 'delete':
          this.confirmOperate('删除当前需求', deleteDemand, { demandId: id }, 'refresh_delete');
      }
    },

    // 获取需求动态
    refreshData(type) {
      this.$router.push('/demand/drafts');
      // if (type === 'refresh_delete') {
      //   this.$router.push('/demand/drafts')
      // } else (type === 'refresh_recall') {
      //   this.$router.push('/demand/drafts')
      // }
    },

    getActivities() {
      getActivities({demandId: this.id}).then(res => {
        this.activities = res.data || [];
      }).catch(_ => {});
    },

    handleBatchDownload() {
      if (!this.fileLists.length) {
        this.$message.error('暂无文件可下载');
        return;
      }
      let files = this.fileLists.map(item => ({key: item.attachmentKey, name: item.attachmentName}));
      this.batchDownloadFile(files);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'DemandEdit') {
      const breadList = [
        { title: '需求跟踪', path: {path: '/demand/base-detail', query: this.$route.query} },
        { title: '需求编辑', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else {
      window.localStorage.setItem('customBread', '');
    }
    next();
  },
  mounted() {
    let params = {
      type: this.$route.query.type === 'edit' ? 'demandDetail' : 'draftsEdit',
      id: this.$route.query.id
    };
    getDataPermission(params).then(res => {
      if (res.data == 'true') {
        this.fetchData();
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
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.el-container {
  height: 100%;
  margin: 0 10px;
  overflow: hidden;
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
    .demand-status {
      color: #191b27;
      font-weight: 600;
      font-size: 12px;
      margin-left: 40px;
    }
    .btns {
      margin-right: 10px;
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
  }
}

.el-main {
  padding: 0;
  overflow-x: hidden;
  background-color: #fff;
  color: #333;
  height: 100%;
}

.el-footer {
  padding: 20px;
  text-align: center;
}
</style>
<style lang="scss">
.check-detail {
  // margin: 20px;
  .el-form-item, .el-form-item__content {
    width: 100%;
  }
  .el-collapse-item__content {
    padding: 10px 0 25px 40px;
  }
}
</style>
