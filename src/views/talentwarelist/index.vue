<template>
  <div class="page-container talent-warpper">
    <el-card class="header-filter">
      <div>
        关键字：<el-input :disabled="pageType!=='default'" v-model="filter.keyword" class="input-width" type="text" placeholder="请输入关键字"/>
        申请状态：
        <el-select v-model="filter.applyStatus" :disabled="pageType==='default'" clearable placeholder="请选择申请状态">
          <el-option v-for="(item, key) in applyStatus" :key="item.key" :label="item" :value="key"/>
        </el-select>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card class="talent-warelist">
      <div class="table-header">
        <el-radio-group v-model="pageType" @change="handleTabChange" text-color="#fff">
          <el-radio-button label="default">智库</el-radio-button>
          <el-radio-button label="myapply">我的申请</el-radio-button>
          <el-radio-button label="examine">我的审批</el-radio-button>
        </el-radio-group>
        <div class="operate-btn">
          <el-button :disabled="pageType!=='examine'" @click="handleBatchAudit" type="primary">一键审批</el-button>
        </div>
      </div>
      <template v-if="pageType=='default'">
        <div v-if="talentData.length" v-loading="loading.talent" class="talent-box">
          <div class="item-box" v-for="(item,index) in talentData" :key="index" @click="$router.push({path: '/demand/detail', query: {id: item.demandId, type: 'talent'}})">
            <div class="card-header">
              <span>{{item.demandNum}}</span>
              <span class="icon">
                <i class="el-icon-view info"> {{item.browseCount || 0}}</i>
                <i class="el-icon-paperclip "> {{item.attachmentCount || 0}}</i>
              </span>
            </div>
            <p class="title">{{item.title}}</p>
            <p class="el-icon-time time" v-if="item.shareTime">{{item.shareTime}}</p>
          </div>
        </div>
        <placeholder v-else height="500px" style="font-weight:400;font-size:12px;color:#909399"/>
      </template>
      <el-table :cell-style="getCellStyle" v-loading="loading.table" :key="pageType" v-if="pageType!=='default'" :data="tableData" height="500px" @selection-change="handleSelectionChange">
        <el-table-column v-if="pageType==='examine'" type="selection" width="55"/>
        <el-table-column show-overflow-tooltip prop="demandNum" label="需求编号"/>
        <el-table-column show-overflow-tooltip prop="title" label="需求名称"/>
        <el-table-column show-overflow-tooltip prop="title" label="申请状态">
          <template slot-scope="{row}">{{TalentApplyState[row.applyState]}}</template>
        </el-table-column>
         <el-table-column show-overflow-tooltip prop="title" label="审批状态">
          <template slot-scope="{row}">{{TalentAuditState[row.auditState]}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="proposer" label="申请人"/>
        <el-table-column v-if="pageType==='examine'" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.applyState==='unapproved'" type="text" @click="handleAudit('pass', row)">通过</el-button>
            <el-button v-if="row.applyState==='unapproved'" type="text" @click="handleAudit('reject', row)">驳回</el-button>
            <!-- <el-tooltip content="通过" placement="top">
              <img v-if="row.applyState==='unapproved'" :src="require('@/assets/btn_icons/pass.png')"  @click="handleAudit('pass', row)" class="img-btn"/>
            </el-tooltip>
             <el-tooltip content="驳回" placement="top">
              <img v-if="row.applyState==='unapproved'" :src="require('@/assets/btn_icons/reject.png')"  @click="handleAudit('reject', row)" class="img-btn"/>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pageType!=='default'"
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.total"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        class="call-pagination"
        style="margin-top:12px"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
      <el-pagination
        v-if="pageType=='default'"
        layout="prev, pager, next, jumper, sizes, total"
        :total="talentPage.total"
        :page-size="talentPage.pageSize"
        :current-page="talentPage.pageNum"
        :page-sizes="[12, 24, 36]"
        class="call-pagination"
        style="margin-top:12px"
        @size-change="onTalentSizeChange"
        @current-change="onTalentPageChange"
      />
    </el-card>
  </div>
</template>
<script>
import store from '@/store';
import common from '@/mixins/common.js';
import Placeholder from '@/components/Placeholder';
import { TalentApplyState, TalentAuditState } from '@/enums/index.js';
import { 
  queryTalentList,
  queryApplicationList,
  queryTalentAuditList,
  auditTalent,
  auditBatchTalent
} from '@/api/talent.js';
export default {
  mixins: [common],
  components: {
    Placeholder
  },
  data() {
    return {
      filter: {
        keyword: '',
        applyStatus: '',
      },
      loading: {
        talent: true,
        table: false
      },
      talentData: [],
      pageType: 'default',
      tabList: [
        { label: '智库列表', key: 'default' },
        { label: '我的审批', key: 'examine' },
        { label: '我的申请', key: 'myapply ' }
      ],
      tableData: [],
      applyStatus: {
        approved: '已审批',
        unapproved: '未审批'
      },
      multipleSelection: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      talentPage: {
        pageNum: 1,
        pageSize: 12,
        total: 0
      },
      TalentApplyState,
      TalentAuditState
    };
  },

  watch: {
    '$route.query': {
      deep: true,
      immediate: true,
      handler(nVal, oVal) {
        if (nVal.status === 'examine'){
          this.pageType = 'examine';
          this.handleTabChange({name: 'examine'});
        }
      }
    }
  },

  methods: {
    // 获取智库列表
    getTalentList() {
      this.loading.talent = true;
      let params = {
        ...this.filter,
        ...this.talentPage
      };
      queryTalentList(params).then(res => {
        const { data, pageSize, total } = res.data;
        this.talentData = data || [];
        this.talentPage = Object.assign(this.talentPage, {
          pageSize,
          total
        });
      }).catch(_ => {})
        .finally(_ => {
          this.loading.talent = false;
        });
    },

    // 获取我的审批/我的申请
    fetchData() {
      this.loading.table = true;
      let api = this.pageType === 'examine' ? queryTalentAuditList : queryApplicationList;
      let params = {
        ...this.page,
        applyState: this.filter.applyStatus
      };
      api(params).then(res => {
        const { data, pageSize, total } = res.data;
        this.tableData = data || [];
        this.page = Object.assign(this.page, {
          pageSize,
          total
        });
      })
        .catch(_ => {
          this.tableData = [];
        })
        .finally(_ => {
          this.loading.table = false;
        });
    },

    // 一键审批
    handleBatchAudit() {
      let hasUnqualified = this.multipleSelection.some(item => item.applyState === 'approved');
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择要审批的数据');
        return;
      } else if (hasUnqualified) {
        this.$message.error('只支持待审批状态一键审批');
        return;
      } else {
        let type = '';
        const talentAuditIdList = this.multipleSelection.map(item => item.talentAuditId);
        this.$confirm('您是否确认批量审批？', '审批提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '通过',
          cancelButtonText: '驳回',
          type: 'warning'
        }).then(() => {
          type = 'pass';
        }).catch(action => {
          if (action == 'cancel') {
            type = 'reject';
          } else { 
            return;
          }
        }).finally(() => {
          if (!type) return; 
          const params = {
            talentAuditIdList,
            auditState: type,
          };
          auditBatchTalent(params).then(res => {
            this.$message.success(`${type === 'pass' ? '审批' : '驳回'}成功`);
            this.fetchData();
            store.dispatch('app/getMessages');
          }).catch(_ => {});
        });
      }
    },

    // 单个审批
    handleAudit(type, row) {
      const params = {
        auditState: type,
        talentAuditId: row.talentAuditId
      };
      let msg = type === 'pass' ? '通过当前审批' : '驳回当前审批';
      this.confirmOperate(msg, auditTalent, params, 'refresh_talent');
    },

    handleTabChange(val) {
      this.page.pageNum = 1;
      if (val !== 'examine') {
        this.$router.push({query: {}});
      }
      this.handleSearch();
    },

    handleSearch() {
      if (this.pageType === 'default') {
        this.filter.applyStatus = '';
        this.talentPage.pageNum = 1;
        this.getTalentList();
      } else {
        this.filter.keyword = '';
        this.fetchData();
      }
    },

    refreshData() {
      this.fetchData();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onTalentSizeChange(page) {
      this.talentPage.pageSize = page;
      this.getTalentList();
    },
    onTalentPageChange(page) {
      this.talentPage.pageNum = page;
      this.getTalentList();
    },

    onReset() {
      this.filter = {
        keyword: '',
        applyStatus: '',
      };
    }
  },

  filters: {
    formatIndex(index) {
      let num = index + 1;
      return parseInt(num) < 10 ? '0' + num : num;
    } 
  },

  beforeRouteLeave(to, from, next) {
    if (to.name === 'DemandDetail') {
      const breadList = [
        { title: '智库', path: '/talentwarelist/index' },
        { title: '智库详情', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    }
    next();
  },
  
  mounted() {
    this.getTalentList();
  }
};
</script>
<style lang="scss">
.talent-warpper {
  .talent-warelist {
    // height: 660px !important;
    .el-card__body {
      overflow: hidden;
      text-align: center;
    }
  }
  .talent-box {
    overflow: auto;
    padding: 16px 4px 0;
    height: 480px;
    width: 100%;
    text-align: center;
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;
  }
  .item-box {
    flex: 0 0 24%;
    color: #999;
    font-size: 12px;
    height: 142px;
    text-align: left;
    margin-bottom: 16px;
    box-sizing: border-box;
    padding:14px 20px;
    box-shadow: 0px 0px 8px 0px rgba(1, 111, 250, 0.12);
    border-radius: 4px;
    margin-right: 1%;
    position: relative;
    cursor: pointer;
    .mark {
      border: 20px solid #016FFA;
      height: 0;
      width: 0;
      border-right-color: transparent;
      border-bottom-color: transparent;
      position: absolute;
      left: 0;
      top: 0;
    }
    .text {
      position: absolute;
      left: 3px;
      color: #fff;
      top: 4px;
    }
    .title {
      overflow: hidden; 
      text-overflow: ellipsis;
      display: -webkit-box;
      /* autoprefixer: off */  // autoprefixer会自动移除老式过时的代码, 添加注释关闭autoprefixer
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      color: #606266;
      font-size: 14px;
      margin: 8px 0;
    }
    .title:hover {
      color: #016FFA;
    }
    .card-header {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        text-align: right;
      }
      .info {
        margin-right: 10px;
      }
    }
    .time {
      position: absolute;
      bottom: 20px;
      margin-right: 6px;
    }
  }
}
</style>
