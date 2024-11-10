<template>
  <div class="page-container">
    <el-card class="header-filter">
      <div>
        部门查询：
        <!-- <el-input v-model="filter.departmentName" type="text" maxlength="50" placeholder="请输入部门名称" /> -->
        <el-select
        v-model="filter.departmentName" 
        filterable
        remote
        ref="approverList"
        reserve-keyword
        placeholder="请输入部门名称"
        @change="changeMembers"
        :loading="loading.select"
        :remote-method="((val)=>{remoteMembers(val, 'approvers')})"
        @visible-change="((val)=>{showHistoryList(val, 'approvers')})"
      >
        <el-option
          v-for="item of approvers"
          :key="item.departmentId"
          :label="item.departmentName"
          :disabled="item.disabled"
          :value="item.departmentName"
        />
      </el-select>
        额度状态：
        <el-select v-model="filter.quotaStatus" >
          <el-option v-for="(item, key) in QuotaStatus" :key="key" :label="item['name']" :value="item['value']" />
        </el-select>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card class="table-card" body-style="height:100%">
      <div class="table-header">
        <span class="sum-hours">总编制时长：{{sum.listSumPreparationHours}}</span>
        <span class="sum-hours">总已用时长：{{sum.listSumCostHours}}</span>
        <span class="sum-hours">总可用时长：{{sum.listSumRemainHours}}</span>
        <div class="operate-btn">
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table :cell-style="getCellStyle" v-loading="loadings" :data="tableData" stripe :height="'calc(100% - 115px)'">
        <el-table-column label="编号" width='80'>
          <template slot-scope="scope">
            {{ scope.$index |formatIndex(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column label="部门名称" prop="departmentName" show-overflow-tooltip></el-table-column>
        <el-table-column label="总编制时长(时)" prop="departmentName">
          <template slot-scope="{row}">
            <span class='clickStatus' 
              @click="showTimeDetail(row)">{{
                row.sumPreparationHours | diment(row.sumPreparationHours)
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已用时长(时)">
          <template slot-scope="{row}">
            <span class='clickStatus' 
              @click="showDetail(row)">{{
                row.sumCostHours | diment(row.sumCostHours)
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用时长(时)">
          <template slot-scope="{row}">
            {{ row.sumRemainHours | diment(row.sumRemainHours) }}
          </template>
        </el-table-column>
        <el-table-column label="额度状态">
          <template slot-scope="{row}">
            <span :class="{ 'warning-status': row.quotaStatus == '0' }">{{ QuotaStatusMap[row.quotaStatus] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top:12px" layout="prev, pager, next, jumper, sizes, total" :total="page.total"
        :page-size="page.pageSize" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 50]" class="call-pagination"
        @size-change="onSizeChange" @current-change="onPageChange" />
    </el-card>
    <!-- 使用详情弹框 -->
    <detail-dialog :dialog-visible.sync="visible.detail" :rowId="rowId" />
    <!-- 配置详情弹框 -->
    <time-dialog :time-visible.sync="visible.time" :rowId="rowId" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import filters from '@/utils/filters.js'
import detailDialog from './components/index/detailDialog';
import timeDialog from './components/index/timeDialog';
import {dpartmentList} from '@/api/supplier';
import { QuotaStatus, QuotaStatusMap } from '@/enums/index.js';
import { queryResourceList, exportResource } from '@/api/resource.js';
export default {
  mixins: [common],
  components: {
    detailDialog,
    timeDialog
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    return {
      loading: {
        select: false
      },
      tableData: [],
      loadings: false,
      contractors: [],
      approvers: [],
      filter: {
        quotaStatus: [],
        departmentName: []
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      sum: {
        listSumCostHours: 0,
        listSumPreparationHours: 0,
        listSumRemainHours: 0
      },
      QuotaStatus,
      QuotaStatusMap,
      visible: {
        check: false,
        detail: false,
        time: false
      },
      checkDetail: {},
      rowId: ''
    };
  },
  methods: {
    // 部门名称
    remoteMembers(val, key) {
      this.loading.select = true;
      dpartmentList({ departmentName: val }).then(res => {
        this[key] = res.data || [];
      }).catch(err => { })
        .finally(_ => this.loading.select = false);
    },
    // 记录并缓存【最近输入】
    changeMembers(val) {
      this.$refs.approverList.query = '';
      if (!val.length) return;
      let mapMemberList = JSON.parse(localStorage.getItem('mapDepartList'));
      if (!mapMemberList) {
        mapMemberList = typeof (val) === 'string' ? [val] : val;
      } else {
        val = typeof (val) === 'string' ? val.split(',') : val;
        val.forEach(item => {
          if (!mapMemberList.includes(item)) {
            mapMemberList.push(item);
          }
        });
      }
      window.localStorage.setItem('mapDepartList', JSON.stringify(mapMemberList));
    },
    // 回显【最近输入】
    showHistoryList(val, key) {
      if (!val) return;
      let mapMemberList = JSON.parse(localStorage.getItem('mapDepartList')) || [];
      if (!mapMemberList.length) return;
      let data = mapMemberList.map(item => ({ departmentName: item, departmentId: item}));
      this[key] = [
        { departmentName: '最近输入', departmentId: 'recently_input', disabled: true },
        ...data
      ];
    },
    fetchData() {
      let params = {
        ...this.page,
        quotaStatus: this.filter.quotaStatus,
        departmentName: this.filter.departmentName
      };
      this.loadings = true;
      queryResourceList(params).then(res => {
        const { data, total } = res.data;
        this.tableData = data || [];
        let keys = ['listSumCostHours', 'listSumPreparationHours', 'listSumRemainHours']
        for (let key of keys) {
          this.sum[key] = filters.diment(res.data[key])
        }
        this.page = Object.assign(this.page, {
          total
        });
      })
        .catch(err => { })
        .finally(() => {
          this.loadings = false;
        });
    },
    handleExport() {
      let params = {
        quotaStatus: this.filter.quotaStatus,
        departmentName: this.filter.departmentName
      };
      this.downloadExcel('/excel/resourceManagementExport', params, '内部资源');
    },
    showDetail(row) {
      if (row.sumCostHours) {
        this.rowId = row.departmentId;
        this.visible.detail = true;
      }
    },
    // 总配置时长  配置详情
    showTimeDetail(row) {
      this.rowId = row.departmentId;
      this.visible.time = true;
    },
    onReset() {
      this.filter = {
        quotaStatus: [],
        departmentName: ''
      };
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang='scss' scoped>
@import "@/style/mixin.scss";

.normal-status {
  content: '';
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}

.warning-status {
  color: #d9001b;
}

.clickStatus {
  color: #1891ff;
  cursor: pointer;
}

.page-container {
  height: 100%;
}

::v-deep {
  .el-table {
    margin-bottom: 10px;
  }

  .table-card {
    height: calc(100% - 90px) !important;
  }
  .sum-hours {
    margin-right: 20px;
  }
}
</style>
