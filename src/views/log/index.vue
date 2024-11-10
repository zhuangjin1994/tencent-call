<template>
  <div class="page-container log-page">
    <el-card class="header-card">
      <div style="display:inline">
        关键字：<el-input v-model="filter.keyword" type="text" placeholder="请输入关键字"/>
        操作时间：
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="filter.startDate"
          type="date"
          placeholder="开始时间"
          style="margin-right:0"
          :picker-options="pickerOptionsStart"
        />
        - <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="filter.endDate"
          type="date"
          placeholder="结束时间"
          :picker-options="pickerOptionsEnd"
        />
      </div>
      <div class="btn-box">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <!-- <div class="table-header">
        <div class="title">数据列表</div>
      </div> -->
      <el-table :cell-style="getCellStyle" v-loading="loading" :data="tableData" height="530px" :row-style="{height:'53px'}">
        <el-table-column label="编号">
          <template slot-scope="scope">
            {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(key, val) of TABLE_COLS_ENUM"
          show-overflow-tooltip
          :key="key"
          :prop="val"
          :label="key"
          align="center"
        />
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
  </div>
</template>
<script>
const TABLE_COLS_ENUM = {
  createdDate: '操作时间',
  ipAddr: 'IP地址',
  createBy: '操作人员',
  operationModule: '所属模块',
  operationType: '操作类型'
};
import common from '@/mixins/common.js';
import { logList } from '../mock';
import { queryLogList } from '@/api/demand.js';
export default {
  mixins: [common],
  data() {
    return {
      loading: false,
      tableData: [],
      TABLE_COLS_ENUM,
      filter: {
        keyword: '',
        startDate: '',
        endDate: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.filter.endDate) {
            return time.getTime() > new Date(this.filter.endDate).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.filter.startDate) {
            return time.getTime() < new Date(this.filter.startDate).getTime() - 86400000;
          }
        }
      }
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      const params = {
        ...this.page,
        ...this.filter
      };
      params.startDate = params.startDate ? `${params.startDate} 00:00:00` : '';
      params.endDate = params.endDate ? `${params.endDate} 23:59:59` : '';
      queryLogList(params).then(res => {
        const { data, pageSize, total } = res.data;
        this.tableData = data || [];
        this.page = Object.assign(this.page, {
          pageSize,
          total
        });
      })
        .catch(err => {})
        .finally(() => {
          this.loading = false;
        });
    },

    onPageChange(pageNum) {
      this.page.pageNum = pageNum;
      this.fetchData();
    },
    onSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.fetchData();
    },
    onSearch() {
      this.page.pageNum = 1;
      this.fetchData();
    },
    onReset() {
      this.filter = {
        keyword: '',
        startDate: '',
        endDate: ''
      };
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
.header-card {
  margin-bottom: 6px;
  .el-input,.el-select,.el-date-editor,.el-checkbox,.el-textarea,.el-cascader{
    margin-bottom: 10px;
    width: 200px;
    margin-right: 50px;
  }
  .btn-box {
    margin-bottom: 10px;
    float: right;
  }
}
</style>
<style lang="scss">
.log-page {
  .el-card__body {
    padding: 16px 32px;
  }
}
 
</style>
