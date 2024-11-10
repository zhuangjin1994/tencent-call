<template>
  <div class="page-container">
    <el-card class="header-filter">
      <div>
        供应商名称：<el-input v-model="filter.accountName" type="text" placeholder="请输入供应商名称"/>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <div class="table-header">
        <!-- <div class="title">数据列表</div> -->
        <div class="operate-btn">
          <el-button @click="showDialog('add')" type="primary" icon="el-icon-plus">添加</el-button>
          <el-button class="export-btn"  icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table :cell-style="getCellStyle" v-loading="loading" :data="tableData" height="500px">
        <el-table-column label="编号">
          <template slot-scope="scope">
            {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" prop="accountName" show-overflow-tooltip />
        <el-table-column label="总编制时长">
          <template slot-scope="{row}">
            {{ row.sumPreparationHours | hours(row.sumPreparationHours) }}
          </template>
        </el-table-column>
        <el-table-column label="消耗小时数">
          <template slot-scope="{row}">
            {{ row.sumCostHours | hours(row.sumCostHours) }}
          </template>
        </el-table-column>
        <el-table-column label="剩余小时数" prop="sumRemainHours">
           <template slot-scope="{row}">
            {{ row.sumRemainHours | hours(row.sumRemainHours) }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-switch
              :value="row.accountStatus"
              active-color="#027AFF"
              inactive-color="#E5E5E5"
              active-value="usable"
              :disabled="row.auditStatus==='0' || (row.auditStatus == '2' && !row.sumCostHours) || row.supplierParentAccountId ? true : false"
              @change="handleChangeStatus(row)"
              inactive-value="unusable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" prop="auditStatus">
          <template slot-scope="{row}">
            {{supplierStatus[row.auditStatus]}}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button 
              type="text"
              v-if="(row.auditStatus === '1' || (row.auditStatus == '2' && row.sumCostHours))"
              @click="showDialog('edit', row)"
            >编辑</el-button>
            <el-button
              type="text"
              v-if="['suAdministrator'].includes(roles[0]) && row.auditStatus==='0'"
              @click="showDialog('audit', row)"
            >审批</el-button>
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
    <supplier-editor-dialog @refresh="fetchData" :dialog-visible.sync="dialogVisible" :type="dialogType" :data="auditData"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import { querySupplier, changeSupplierStatus } from '@/api/supplier';
import { supplierStatus } from '@/enums/index.js';
import SupplierEditorDialog from './components/SupplierEditorDialog';
export default {
  mixins: [common],
  components: {
    SupplierEditorDialog
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    return {
      loading: false,
      tableData: [],
      filter: {
        accountName: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      supplierStatus,
      suppliers: [],
      dialogVisible: false,
      active: 0,
      rowId: '',
      auditData: {},
      dialogType: 'add'
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      const params = {
        deleted: '0',
        ...this.page,
        ...this.filter,
      };
      querySupplier(params).then(res => {
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

    handleChangeStatus(row) {
      // accountStatus： usable--可用  unusable--不可用
      let msg = row.accountStatus === 'usable' ? '关闭后，该供应商将无法响应需求' : '开启后，该供应商将可以响应需求';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        const params = {
          supplierAccountId: row.supplierAccountId,
          accountStatus: row.accountStatus === 'usable' ? 'unusable' : 'usable'
        };
        changeSupplierStatus(params).then(res => {
          this.$message.success('切换状态成功');
          this.fetchData();
        });
      }).catch(() => {
        console.log('已取消操作');
      });
    },

    showDialog(type, row) {
      if (type !== 'add') {
        const { accountName, auditStatus, supplierAccountId, supplierBelong } = row;
        this.auditData = {
          supplierAccountId,
          supplierBelong,
          auditStatus,
          accountName
        };
      }
      this.dialogType = type;
      this.dialogVisible = true;
    },

    handleExport() {
      let params = {
        deleted: '0',
        ...this.filter
      };
      this.downloadExcel('/excel/supplierManagementExport', params, '供应商管理');
    },

    onReset() {
      this.filter.accountName = '';
    }
  },

  mounted() {
    this.fetchData();
  }
};
</script>
