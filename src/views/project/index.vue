<template>
  <div class="page-container">
    <el-card style="margin-bottom:20px">
      <div class="header-filter">
        项目查询：
        <el-input
          v-model="filter.name"
          class="input-width"
          type="text"
          placeholder="请输入项目名称/编号"
        />
        关键字：
        <el-input
          v-model="filter.keywords"
          class="input-width"
          type="text"
          placeholder="请输入关键字"
        />
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table :data="tableData" :loading="loading" @selection-change="handleSelectionChange" ref="table"> 
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="(key, val) of TABLE_COLS_ENUM"
          :key="key"
          show-overflow-tooltip
          :prop="val"
          :label="key"
          align="center"
        />
        <el-table-column width="180px" label="进度" align="center">
          <template slot-scope="{row}">
          <el-popover placement="top" width="400" trigger="hover">
            <el-table :data="expertsData">
              <el-table-column width="100" property="date" label="日期"></el-table-column>
              <el-table-column width="100" property="name" label="姓名"></el-table-column>
              <el-table-column width="100" property="address" label="地址"></el-table-column>
            </el-table>
          <el-progress slot="reference" :percentage="row.progress" status="success"></el-progress>
          </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!-- <template slot-scope="{row}"> -->
          <el-tooltip content="查看" placement="top" effect="light">
            <i class="el-icon-tickets" style="color:blue" />
          </el-tooltip>
          <!-- </template> -->
        </el-table-column>
      </el-table>
      <el-button @click="allChecked">{{isCheckedAll ? '取消全选' : '全选'}}</el-button>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
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
  id: '项目编号',
  name: '项目名称',
  branch: '所属部门',
  needer: '需求人',
  time: '申请时间',
  status: '项目状态',
  member: '项目成员',
  remark: '描述'
};
import { projectList } from '../mock';
export default {
  data() {
    return {
      TABLE_COLS_ENUM,
      tableData: projectList,
      loading: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 9
      },
      filter: {
        name: '',
        keywords: ''
      },
      expertsData: [{name: '小刚', date: '2021-3-4', address: '广东深圳'}],
      multipleSelection: [],
      isCheckedAll: false
    };
  },
  methods: {
    onSearch() {},
    onReset() {},
    allChecked() {
      this.isCheckedAll = !this.isCheckedAll;
    },
    onPageChange(pageNo) {
      this.page.pageNo = pageNo;
    },
    onSizeChange() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.call-pagination {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.header-filter {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.input-width {
  width: 180px;
  margin-right: 10px;
}
</style>
