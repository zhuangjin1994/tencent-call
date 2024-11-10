<template>
  <div class="page-container demand-table">
    <el-card class="header-card">
      <el-form inline>
        <el-form-item label="需求编号/名称:">
          <el-input v-model.trim="filter.keyword" type="text" placeholder="请输入需求编号/名称"/>
        </el-form-item>
        <el-form-item label="需求人:">
           <el-input v-model="filter.demanderForSelect" placeholder="请输入需求人 " type="text" />
        </el-form-item>
         <el-form-item label="需求日期:">
          <el-date-picker
            v-model="filter.demandTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始日期 "
            end-placeholder="结束日期 "
            range-separator="至 ">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-select v-model="filter.departmentIdList" placeholder="请选择所属部门" collapse-tags multiple clearable >
            <el-option v-for="item of departments" :label="item.departmentName" :key="item.departmentId"  :value="item.departmentId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属小组:">
          <el-select
            v-model="filter.demandGroupList" 
            :disabled="!filter.departmentIdList.includes('30')"
            placeholder="请选择所属小组"
            multiple
            clearable
            collapse-tags>
            <el-option v-for="(item,index) of strategyGroup" :value="item" :label="item" :key="index" />
          </el-select>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="table">
      <div class="table-header">
        <!-- <div class="title">数据列表</div> -->
        <el-radio-group v-model="demandStatus" @change="handleStatusChange" text-color="#fff">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="approving">审批中</el-radio-button>
          <el-radio-button label="going">进行中</el-radio-button>
          <el-radio-button label="end">已完成</el-radio-button>
        </el-radio-group>
        <div class="operate-btn">
          <el-button @click="showTipDialog" type="primary" icon="el-icon-plus">创建需求</el-button>
          <el-button class="export-btn"  icon="el-icon-download" @click="handleExport">导出</el-button>
           <!-- <el-popover placement="bottom" width="50" trigger="click">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedFields" @change="handleCheckedChange">
              <el-checkbox v-for="field in fields" :label="field" :key="field">{{field}}</el-checkbox>
            </el-checkbox-group>
            <el-button style="margin-left:10px" slot="reference">设置导出字段</el-button>
          </el-popover> -->
        </div>
      </div>
      <!-- <div class="header-nav">
        <el-tabs v-model="demandStatus" @tab-click="handleStatusChange">
          <el-tab-pane v-for="item in DemandTabsEnum" :key="item.key" :label="item.label" :name="item.key">
            <span slot="label">
              {{item.label}}
              <el-badge :value="toBeConfirmedCount" v-if="item.label==='待确认'&&toBeConfirmedCount>0" size="mini" class="item"></el-badge>
              <el-badge :value="checkedDemandCount" v-if="item.label==='待验收'&&checkedDemandCount>0" size="mini" class="item"></el-badge>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div> -->
      <el-table :cell-style="getCellStyle" v-loading="loading" height="490" :data="tableData" ref="table"> 
        <el-table-column show-overflow-tooltip prop="demandNum" label="需求编号">
          <template slot-scope="{row}">
            <a style="cursor: pointer" @click="toDetail(row)">
              {{row.demandNum}}
            </a>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="title" label="需求名称" show-overflow-tooltip/>
        <el-table-column prop="demander" label="需求人" show-overflow-tooltip/>
        <el-table-column prop="departmentName" label="所属部门" show-overflow-tooltip/>
        <el-table-column prop="demandGroup" label="所属小组" show-overflow-tooltip/>
        <el-table-column prop="demandGroup" label="需求状态" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- {{row.demandStatus}} -->
            <i class="status-dot" :style="{background:getColor(row.demandStatus)}"></i>
            <span :style="{color:getColor(row.demandStatus)}">{{DemandTabStatusEnum[row.demandStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="demandType" label="需求类型"/>
        <el-table-column prop="demandType" label="已选择/已响应">
          <template slot-scope="{row}">
            {{row.confirmCount}} / {{row.responseCount}}
          </template>
        </el-table-column>
        <el-table-column prop="demandType" label="已完成/待验收">
          <template slot-scope="{row}">
            {{row.finishedCount}} / {{row.acceptanceCount}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="{row}">
            <el-button type="text" @click="toDetail(row)">跟踪</el-button>
          </template> 
        </el-table-column>
      </el-table>
      <el-pagination
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
    <!-- 需求验收弹框 -->
    <demand-accept-dialog @refresh="fetchData" :params="acceptParams" :dialog-visible.sync="dialog.accept"/>
  </div>
</template>
<script>
import common from '@/mixins/common.js';
import DemandAcceptDialog from './components/DemandAcceptDialog';
import { DemandStatusEnum, DemandTabStatusEnum, strategyGroup, AcceptStatus, DemandTabsEnum } from '@/enums/index.js';
import {
  getSuperior,
  getCostHours,
  getDeptByName,
  querySuppliers,
  queryDemandList,
} from '@/api/demand.js';
export default {
  mixins: [common],
  components: {
    DemandAcceptDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      filter: {
        keyword: '',
        demanderForSelect: '',
        demandTime: [],
        demandGroupList: [],
        departmentIdList: []
      },
      costHours: 0,
      demandStatus: 'all',
      toBeConfirmedCount: 0, // 待确认
      checkedDemandCount: 0, // 待验收

      // enums
      strategyGroup,
      DemandStatusEnum,
      DemandTabsEnum,
      DemandTabStatusEnum,
      AcceptStatus,
      departments: [],

      // dialog
      suppliers: [],
      acceptParams: {},
      dialog: {
        confirm: false,
        detail: false,
        accept: false
      },
      approver: '',
      // 选择导出字段
      checkAll: false,
      checkedFields: [],
      fields: [
        '需求编号',
        '需求名称',
        '需求人',
        '所属部门',
        '需求类型',
        '需求状态',
        '序号',
        '专家ID',
        '专家名称'
      ],
      isIndeterminate: false
    };
  },

  watch: {
    'filter.departmentIdList'(nVal, oVal) {
      // 战略发展部可以选所属小组
      if (!nVal.includes('30')) {
        this.filter.demandGroupList = [];
      }
    },
    '$route.query': {
      deep: true,
      immediate: true,
      handler(nVal, oVal) {
        if (nVal.status === 'to_be_accepted'){
          this.demandStatus = 'to_be_accepted';
          this.handleStatusChange({name: 'to_be_accepted'});
        }
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
      let params = {
        ...this.page,
        ...this.filter,
        demandStatus: this.demandStatus === 'all' ? '' : this.demandStatus
      };
      params.startDateStr = params.demandTime.length ? `${params.demandTime[0]} 00:00:00` : '';
      params.endDateStr = params.demandTime.length ? `${params.demandTime[1]} 23:59:59` : '';
      queryDemandList(params).then(res => {
        const { data, pageSize, total, toBeConfirmedCount, checkedDemandCount } = res.data;
        this.tableData = data || [];
        this.toBeConfirmedCount = toBeConfirmedCount;
        this.checkedDemandCount = checkedDemandCount;
        this.page = Object.assign(this.page, {
          pageSize,
          total
        });
      })
        .catch(_ => {
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 验收需求-获取需求/交付信息
    async showAcceptDialog(row, scope) {
      this.acceptParams = {
        demandId: row.demandId,
        confirmId: scope.row.confirmId
      };
      this.dialog.accept = true;
    },

    showTipDialog() {
      this.$router.push({ path: '/demand/edit', query: { type: 'add' } });
    },
    
    handleExport() {
      let params = {
        ...this.filter,
        demandStatus: this.demandStatus === 'all' ? '' : this.demandStatus
      };
      this.downloadExcel('/excel/demandListExport', params, '需求列表');
    },

    toDetail(row) {
      // if(row.demandStatus === 'approving') {
      //   this.$router.push({ path: '/demand/base-detail', query: { id: row.demandId, type: 'edit' }})
      // } else {
      //   this.$router.push({ path: '/demand/detail', query: { id: row.demandId, type: 'edit' }})
      // }
      let routeUrl;
      if (row.demandStatus === 'approving') {
        routeUrl = this.$router.resolve({
          path: '/demand/base-detail',
          query: { id: row.demandId, type: 'edit' }
        });
      } else {
        routeUrl = this.$router.resolve({
          path: '/demand/detail',
          query: { id: row.demandId, type: 'edit' }
        });
      }
      window.open(routeUrl.href, '_blank');
    },

    // 选择导出字段
    handleCheckAllChange(val) {
      this.checkedFields = val ? this.fields : [];
      this.isIndeterminate = false;
    },

    handleCheckedChange(val) {
      let count = val.length;
      this.checkAll = count === this.fields.length;
      this.isIndeterminate = count > 0 && count < this.fields.length;
    },

    // 获取供应商
    getSuppliers() {
      querySuppliers().then(res => {
        this.suppliers = res.data || [];
      }).catch(err => {});
    },

    // 获取所属部门
    getDepartments() {
      getDeptByName().then(res => {
        this.departments = res.data || [];
      }).catch(err => {});
    },

    // 获取消耗时长
    getCostHours() {
      getCostHours().then(res => {
        this.costHours = res.data.totalHours || 0;
      }).catch(err => {});
    },

    // 获取默认上级审批人
    getDefaultSuperior() {
      getSuperior().then(res => {
        this.approver = res.data.superiorTotalInfo;
      }).catch(err => {});
    },

    gainIcon(btn) {
      return require(`@/assets/btn_icons/${btn}.png`);
    },
    
    handleStatusChange(val) {
      if (val.name !== 'to_be_accepted') {
        this.$router.push({query: {}});
      }
      this.page.pageNum = 1;
      this.fetchData();
    },
   
    onReset() {
      this.filter = {
        keyword: '',
        demanderForSelect: '',
        demandTime: [],
        demandGroupList: [],
        departmentIdList: []
      }; 
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'CheckDetail') {
      const breadList = [
        { title: '需求列表', path: { path: '/demand/list' } },
        { title: '审批详情', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    } else {
      window.localStorage.setItem('customBread', '');
    }
    next();
  },
  mounted() {
    this.fetchData();
    this.getSuppliers();
    this.getDepartments();
    this.getCostHours();
    this.getDefaultSuperior();
    // 弹出新增需求提示框
    const showTips = window.localStorage.getItem('Demand-Add-Confirm');
    if (!showTips) {
      this.dialog.confirm = true;
    }
  }
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.demand-table {
  .header-card {
    margin-bottom: 6px;
    .el-form-item {
      width: 30%;
      margin-top: 0;
      margin-bottom: 10px;
    }
    .el-form-item__label {
      width: 100px;
      font-size: 12px;
      color: #303133;
    }
    .el-form-item__content {
      width: calc(100% - 100px);
    }
    .el-input,.el-select,.el-checkbox,.el-textarea,.el-cascader{
      width: 205px;
    }
    .el-date-editor {
      width: 220px;
    }
    .btn {
      float: right;
      display: inline;
    }
  }
  .el-checkbox {
    line-height: 24px;
  }
  .header-filter .el-input {
    margin-bottom: 6px;
  }
  .table-header { 
    .time {
      font-size: 14px;
      color: #909399;
    }
  }
  .el-tabs {
    .el-tabs__header {
      margin: 0;
    }
  }
  .check-btn {
    height: 18px;
    width: 36px;
    border: 1px solid #016FFA;
    background: rgba(1, 111, 250, 0.1);
    color: #016FFA;
    border-radius: 2px;
    text-align: center;
    line-height: 16px;
    font-size: 10px;
    display: inline-block;
    margin-left: 8px;
    cursor: pointer;
  }
  .demand-status {
    content: '';
    display: inline-block;
    margin-right: 6px;
    vertical-align: middle;
    @include circle(10px, #016FFA);
  }
  .status-dot {
    content: '';
    display: inline-block;
    margin-right: 6px;
    vertical-align: middle;
    @include circle(4px, #016FFA);
  }
}
</style>
