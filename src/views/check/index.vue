<template>
  <div class="page-container check-table">
    <el-card class="header-card">
      <el-form inline>
        <el-form-item label="需求编号/名称:">
          <el-input v-model.trim="filter.demandNameOrNum" type="text" placeholder="请输入需求编号/名称"/>
        </el-form-item>
        <el-form-item label="需求人:">
          <el-input v-model="filter.demander" type="text" placeholder="请输入需求人"/>
        </el-form-item>
        <el-form-item label="需求日期:">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filter.demandTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-select v-model="filter.departmentIdList" multiple collapse-tags clearable placeholder="请选择所属部门">
            <el-option v-for="item of departments" :key="item.departmentId" :label="item.departmentName" :value="item.departmentId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属小组:">
          <el-select
            :disabled="!filter.departmentIdList.includes('30')" 
            v-model="filter.demandGroupList" 
            multiple 
            collapse-tags 
            clearable 
            placeholder="请选择所属小组"
          >
            <el-option v-for="(item,index) of strategyGroup" :key="index" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <div class="table-header">
         <el-radio-group v-model="pageType" @change="handleTabChange" text-color="#fff">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="approving">待审批</el-radio-button>
          <el-radio-button label="finished">已审批</el-radio-button>
          <!-- <el-radio-button label="reject">已驳回</el-radio-button> -->
        </el-radio-group>
        <!-- <div class="title">数据列表</div> -->
        <div class="operate-btn">
          <el-button @click="onBatchAudit" type="primary" :loading="auditLoading">一键审批</el-button>
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <!-- <div class="header-nav">
        <el-tabs v-model="pageType" @tab-click="handleTabChange">
          <el-tab-pane v-for="item in tabList" :key="item.key" :label="item.label" :name="item.key"> </el-tab-pane>
        </el-tabs>
      </div> -->
      <el-table :cell-style="getCellStyle" height="490px" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="demandNum" label="需求编号">
          <template slot-scope="{row}">
            <a style="cursor: pointer" @click="toDetail(row)">
              {{row.demandNum}}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(key, val) of TABLE_COLS_ENUM"
          show-overflow-tooltip
          :key="key"
          :prop="val"
          :label="key"
          align="left"
        />
        <el-table-column label="审批状态">
          <template slot-scope="{row}">
            {{CheckStatusEnum[row.demandStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="需求类型" show-overflow-tooltip prop="demandType"></el-table-column>
        <el-table-column label="申请时间" show-overflow-tooltip prop="submitDate"></el-table-column>
        <!-- 操作 -->
        <el-table-column v-if="['all', 'approving'].includes(pageType)" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="['业务审批人', '统管审批人'].includes(row.actionName)" type="text" @click="toDetail(row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:12px"
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.total"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        class="call-pagination"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </el-card>
    <audit-dialog :data="demandInfo" :id="demandId" @refresh="fetchData" @switchPage="switchTab" :dialog-visible.sync="showAuditDialog"/>
  </div>
</template>
<script>
import store from '@/store';
import common from '@/mixins/common.js';
import AuditDialog from './AuditDialog';
import { queryAuditList, getDemandConfirmInfo, getDeptByName, demandAuditBatch } from '@/api/demand.js';
import { strategyGroup, CheckStatusEnum } from '@/enums/index.js';
const TABLE_COLS_ENUM = {
  title: '需求名称',
  demander: '需求人',
  departmentName: '所属部门',
  demandGroup: '所属小组'
};
export default {
  mixins: [common],
  components: {
    AuditDialog
  },
  data() {
    return {
      loading: false,
      auditLoading: false,
      tableData: [],
      departments: [],
      CheckStatusEnum,
      multipleSelection: [],
      TABLE_COLS_ENUM,
      strategyGroup,
      filter: {
        demandNameOrNum: '',
        demander: '',
        demandTime: [],
        demandGroupList: [],
        departmentIdList: []
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      pageType: 'all',
      tabList: [
        { label: '待审批', key: 'approving' },
        { label: '已审批', key: 'to_be_responsed' }
      ],
      showAuditDialog: false,
      demandInfo: {},
      demandId: ''
    };
  },
  watch: {
    'filter.departmentIdList'(nVal, oVal) {
      if (!nVal.includes('30')) {
        this.filter.demandGroupList = [];
      }
    },
    'filter.demandTime'(nVal) {
      if (nVal == null) {
        this.filter.demandTime = [];
      }
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      const params = {
        ...this.page,
        ...this.filter,
        demandStatus: this.pageType === 'all' ? '' : this.pageType
      };
      params.startDateStr = params.demandTime.length ? `${params.demandTime[0]} 00:00:00` : '';
      params.endDateStr = params.demandTime.length ? `${params.demandTime[1]} 23:59:59` : '';
      queryAuditList(params).then(res => {
        const { data, pageSize, total } = res.data;
        this.tableData = data || [];
        this.page = Object.assign(this.page, {
          pageSize,
          total
        });
      }).catch(err => {})
        .finally(_ => {
          this.loading = false;
        });
    },

    async handleAudit(row) {
      let res = await getDemandConfirmInfo({demandId: row.demandId});
      this.demandInfo = res.data || {};
      this.demandId = row.demandId;
      this.showAuditDialog = true;
    },

    onBatchAudit() {
      let hasUnqualified = this.multipleSelection.some(item => item.demandStatus !== 'approving');
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择要审批的数据');
        return;
      } else if (hasUnqualified) {
        this.$message.error('只支持待审批需求一键审批');
        return;
      } else {
        let type = '';
        const demandIdList = this.multipleSelection.map(item => item.demandId);
        this.$confirm('您是否确认批量审批？', '审批提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '通过',
          cancelButtonText: '驳回',
          type: 'warning'
        }).then(() => {
          type = 'agree';
        }).catch(action => {
          if (action == 'cancel') {
            type = 'reject';
          } else { 
            return;
          }
        }).finally(() => {
          if (!type) return;
          this.auditLoading = true
          const params = {
            demandIdList,
            demandStatus: type,
          };
          demandAuditBatch(params).then(res => {
            this.$message.success(`${type === 'agree' ? '审批' : '驳回'}成功`);
            this.fetchData();
            store.dispatch('app/getMessages');
          }).catch(_ => {})
          .finally(_ => this.auditLoading = false);
        });
      }
    },

    toDetail(row) {
      // this.$router.push({path: '/demand/check-detail', query: { id: row.demandId }})
      let routeUrl = this.$router.resolve({
        path: '/demand/check-detail',
        query: { id: row.demandId }
      });
      window.open(routeUrl.href, '_blank');
    },

    showDemandDetail(row) {
      this.$router.push({ path: '/demand/detail', query: { id: row.demandId, from: 'check' }});
    },

    handleExport() {
      this.downloadExcel('/excel/auditListExport', { demandStatus: this.pageType, ...this.filter }, '审批列表');
    },

    handleTabChange() {
      this.page.pageNum = 1;
      this.fetchData();
    },

    switchTab() {
      this.pageType = 'to_be_responsed';
      this.page.pageNum = 1;
      this.fetchData();
    },

    getDepartments() {
      getDeptByName().then(res => {
        this.departments = res.data || [];
      }).catch(err => {});
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onReset() {
      this.filter = {
        demandNameOrNum: '',
        demander: '',
        demandTime: [],
        demandGroupList: [],
        departmentIdList: []
      };
    }
  },
  mounted() {
    this.fetchData();
    this.getDepartments();
  }
};
</script>
<style lang='scss'>
.check-table {
   .header-card {
    margin-bottom: 6px;
    .el-form-item {
      margin-bottom: 10px;
      margin-top: 0;
      width: 30%;
    }
    .el-form-item__content {
      width: calc(100% - 100px);
    }
    .el-form-item__label {
      color: #303133;
      font-size: 12px;
      width: 100px;
    }
    .btn {
      float: right;
      display: inline;
    }
    .el-date-editor {
      width: 220px;
    }
    .el-input,.el-select,.el-checkbox,.el-textarea,.el-cascader{
      width: 205px;
    }
  }
}
</style>
