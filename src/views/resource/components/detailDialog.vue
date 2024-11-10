<template>
  <el-dialog title="使用详情" :visible.sync="visible" @open="initData" width="744px" class="dialog-container">
    <el-table height="460" :data="tableData" :loading="loading">
      <el-table-column
        v-for="(key, val) of TABLE_COLS_ENUM"
        show-overflow-tooltip
        :key="key"
        :prop="val"
        :label="key"
        align="center"
      />
      <el-table-column label="使用时长">
        <template slot-scope="{row}">
          {{ row.incomeHours | hours(row.incomeHours) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="page.total"
      :page-size="page.pageSize"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      class="dialog-pagination"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />
  </el-dialog>
</template>
<script>
import { getResourceDetail } from '@/api/resource';
const TABLE_COLS_ENUM = {
  demandNum: '需求编号',
  title: '需求名称',
  accountName: '供应商'
};
export default {
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
      TABLE_COLS_ENUM,
      tableData: [],
      loading: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    initData() {
      const params = {
        ...this.page,
        departmentName: this.rowId
      };
      getResourceDetail(params).then(res => {
        const { content, pageSize, recordTotal } = res.data;
        this.tableData = content || [];
        this.page.pageSize = pageSize;
        this.page.total = recordTotal;
      }).catch(err => {});
    },
    onPageChange(pageNum) {
      this.page.pageNum = pageNum;
      this.initData();
    },
    onSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.initData();
    }
  }
};
</script>
<style lang='scss' scoped>
.dialog-pagination {
  text-align: right;
  margin-top: 18px;
}
</style>
