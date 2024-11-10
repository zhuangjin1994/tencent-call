<template>
  <el-dialog title="使用详情" :visible.sync="visible" @open="fetchData" @close='onReset' width="1200px"
    class="dialog-container">
    <div class="headerBar">
      <div class="headerTime">
        <span style="width:100px;display:inline-block;text-align:right">时间：</span>
        <el-date-picker value-format="yyyy-MM-dd" v-model="filter.demandTime" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="btn">
        <el-button type="primary" icon="el-icon-search" @click="onSearchs">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </div>
    <el-table height="460" :data="tableData" :loading="loading">
      <el-table-column label="编号" width='80'>
        <template slot-scope="scope">
           {{ scope.$index |formatIndex(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="需求编号">
        <template slot-scope="{row}">
          {{ row.demandNum }}
        </template>
      </el-table-column>
      <el-table-column label="需求名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.demandTitle }}
        </template>
      </el-table-column>
      <el-table-column label="使用时长">
        <template slot-scope="{row}">
          {{ row.incomeHours | diment(row.incomeHours) }}
        </template>
      </el-table-column>
      <el-table-column label="消耗时间">
        <template slot-scope="{row}">
          {{ row.createdDate }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, jumper, sizes, total" :total="page.total" :page-size="page.pageSize"
      :current-page="page.pageNum" :page-sizes="[10, 20, 30, 50]" class="dialog-pagination" @size-change="onSizeChange"
      @current-change="onPageChange" />
  </el-dialog>
</template>
<script>
import { getSuperUseDetail } from '@/api/resource';
import common from '@/mixins/common.js';
export default {
  mixins: [common],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowId: {
      type: String,
      default: ''
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      filter: {
        demandTime: []
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.close();
  },
  methods: {
    close(){
      this.filter.demandTime = [];
      this.page.pageNum = 1;
      this.page.pageSize = 10; 
    },
    onSearchs() {
      let result = this.filter.demandTime;
      this.fetchData(result);
    },
    onReset() {
      this.filter = {
        demandTime: []
      };
      this.fetchData();
    },
    fetchData(time) {
      let beginDate = time && time.length > 0 ? time[0] + ' 00:00:00' : '';
      let endDate = time && time.length > 0 ? time[1] + ' 23:59:59' : '';
      const params = {
        ...this.page,
        beginDate: beginDate,
        endDate: endDate,
        supplierId: this.rowId
      };
      getSuperUseDetail(params).then(res => {
        const { data, total } = res.data;
        this.tableData = data || [];
        this.page.total = total;
      }).catch(err => { });
    },
  }
};
</script>
<style lang='scss' scoped>
.dialog-pagination {
  text-align: right;
  margin-top: 18px;
}

.headerBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .headerTime {
    width: 380px;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
