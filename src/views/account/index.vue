<template>
  <div class="page-container">
    <el-card class="header-filter">
      <div class="filter-card">
        <div class="filter-item">
          <span class="item-name">部门名称：</span>
          <el-select
            v-model="filter.departmentName" 
            filterable
            remote
            clearable
            placeholder="请输入查询部门"
            @change="changeDepartment"
            :loading="loading.select"
            :remote-method="((val)=>{remoteMembers(val, 'contractors')})"
            @visible-change="((val)=>{showHistoryList(val, 'contractors')})"
          >
            <el-option
              v-for="(item, index) of departments"
              :key="index"
              :label="item.departmentName"
              :disabled="item.disabled"
              :value="item.departmentName"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="item-name">员工类型：</span>
          <el-select v-model="filter.userType" clearable placeholder="请选择状态">
            <el-option v-for="item of userTypes" :key="item" :label="item" :value="item"/>
          </el-select>
        </div>
        <div class="filter-item">
          <span class="item-name">用户账号：</span>
          <el-input v-model="filter.userId" type="text" placeholder="请输入账号名称"/>
        </div>
        <div class="filter-item">
          <span class="item-name">状态：</span>
          <el-select v-model="filter.accountStatus" clearable placeholder="请选择状态">
            <el-option v-for="item of statusList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>
        <div class="btn">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="table-header">
        <!-- <div class="operate-btn">
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div> -->
      </div>
      <el-table :cell-style="getCellStyle" v-loading="loading.table" :data="tableData" height="500px">
        <el-table-column label="编号">
          <template slot-scope="scope">
            {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip  label="账号ID" prop="userId"></el-table-column>
        <el-table-column show-overflow-tooltip  label="账号名称" prop="userCnName"></el-table-column>
        <el-table-column label="部门名称" prop="departmentName" show-overflow-tooltip></el-table-column>
        <el-table-column label="员工类型" prop="userType" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色" prop="roleName">
          <template slot-scope="{row}">
            <span>{{roles[row.roleId]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-switch
              :value="row.accountStatus"
              active-color="#027AFF"
              inactive-color="#E5E5E5"
              active-value="usable"
              @change="handleChangeStatus(row)"
              inactive-value="unusable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="邮箱地址" prop="email" show-overflow-tooltip></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="showDialog('default', row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
        style="margin-top:30px"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </el-card>
     <!-- 添加/编辑弹框 -->
    <account-editor-dialog 
      @refresh="fetchData"
      :params="editParams"
      :type="dialogType"
      :dialog-visible.sync="dialogVisible"
    />
  </div>
</template>
<script>
import { userTypes } from '@/enums/index';
import {
  getDepartment,
  queryAccounts,
  querySupplierAccounts,
  changeAccountStatus,
  deleteAccount,
  querySelectSupplierAccount
} from '@/api/account.js';
import getDeptByName from '@/api/demand.js';
import common from '@/mixins/common.js';
import AccountEditorDialog from './components/AccountEditorDialog';
export default {
  mixins: [common],
  components: {
    AccountEditorDialog
  },
  data() {
    return {
      userTypes,
      tableData: [],
      departments: [],
      loading: {
        table: false,
        select: false
      },
      filter: {
        userId: '',
        accountStatus: '',
        userType: '',
        departmentName: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      statusList: [
        { name: '已开启', id: 'usable' },
        { name: '已关闭', id: 'unusable' }
      ],
      tips: {
        on: '开启后，该账号将可以登录系统',
        off: '关闭后，该账号将无法登录系统',
      },
      roles: {
        demander: '需求方',
        auditor: '审批人',
        coAdministrator: '普通管理员',
        suAdministrator: '超级管理员',
      },
      
      // dialog 
      dialogVisible: false,
      dialogType: 'add',
      editParams: {}
    };
  },
  methods: {
    fetchData() {
      this.loading.table = true;
      const { userId, accountStatus, userType, departmentName } = this.filter;
      let params = {
        ...this.page,
        userId,
        accountStatus,
        // display: '1',
        userType,
        departmentName
      };
      queryAccounts(params).then(res => {
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
        .finally(() => {
          this.loading.table = false;
        });
    },

    handleChangeStatus(row) {
      // deleted 0--可用 1--不可用
      let str = row.accountStatus == 'usable' ? 'off' : 'on';
      this.$confirm(this.tips[`${str}`], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          deleted: row.deleted == 0 ? 1 : 0,
          userId: row.userId,
          accountStatus: row.accountStatus == 'unusable' ? 'usable' : 'unusable'
        };
        changeAccountStatus(params).then(res => {
          this.$message.success('更改状态成功');
          this.fetchData();
        }).catch(_ => {});
      }).catch(() => {
        console.log('已取消操作');
      });
    },

    showDialog(type, row) {
      this.dialogType = type;
      this.dialogVisible = true;
      if (type !== 'add') {
        const { roleId, email, contactInformation, departmentName, userId } = row;
        this.editParams = {
          email,
          roleId,
          userId,
          departmentName,
          contactInformation,
          name: row.userCnName
        };
      }
    },

    // 项目成员 / 业务审批人 / 承办人
    remoteMembers(val) {
      this.loading.select = true;
      getDepartment({departmentName: val}).then(res => {
        this.departments = res.data || [];
      }).catch(err => {})
        .finally(_ => this.loading.select = false);
    },
    
    // // 记录并缓存【最近输入】
    changeDepartment(val) {
      if (!val.length) return;
      let department = JSON.parse(localStorage.getItem('department')); 
      if (!department) {
        department = typeof(val) === 'string' ? [val] : val;
      } else {
        val = typeof(val) === 'string' ? val.split(',') : val;
        val.forEach(item => {
          if (!department.includes(item)) {
            department.push(item);
          }
        });
      }
      window.localStorage.setItem('department', JSON.stringify(department));
    },

    // // 回显【最近输入】
    showHistoryList(val, key) {
      if (!val) return;
      let department = JSON.parse(localStorage.getItem('department')) || [];
      if (!department.length) return;
      let data = department.map(item => ({departmentName: item}));
      // let data = department.map(item => ({ departmentName: item, departmentId: item.split('(')[0] }))
      this.departments = [
        {departmentName: '最近输入', departmentId: 'recently_input', disabled: true},
        ...data
      ];
    },

    handleDelete(row) {
      // display: 0--不在前端展示 1--在前端展示 / 固定传入一个accountStatus: 'unusable'
      const params = {
        display: '0',
        userId: row.userId,
        accountStatus: 'unusable'
      };
      this.confirmOperate('删除当前账号', deleteAccount, params);
    },

    onReset() {
      this.filter = {
        userId: '',
        accountStatus: '',
        userType: '',
        departmentName: ''
      };
    }
  },

  filters: {
    formatIndex(index) {
      let num = index + 1;
      return parseInt(num) < 10 ? '0' + num : num;
    }
  },
  
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang='scss' scoped>
.filter-card {
  width: 100%;
  position: relative;
}
.filter-item {
  margin-top: 10px;
  display: inline-block;
  .item-name {
    width: 64px;
    display: inline-block;
    text-align: right
  }
}
.btn {
  float: right;
  margin-top: 10px;
}
</style>
