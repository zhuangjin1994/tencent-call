 <template>
  <div class="page-container">
    <el-card class="header-filter">
      <div>
        用户账号：<el-input v-model="filter.accountName" type="text" placeholder="请输入账号名称"/>
        状态：<el-select v-model="filter.accountStatus" clearable placeholder="请选择状态">
          <el-option v-for="item of statusList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onFilter">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card class="supplier-card">
      <div class="table-header">
        <div class="operate-btn">
          <el-button @click="showDialog('add')" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button class="export-btn" icon="el-icon-download"  @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-container style="width:100%">
        <el-aside width="180px">
          <el-menu @select="handleCheckSupplier" :default-openeds="['internal', 'foreign']" :default-active="supplierId">
            <el-submenu index="internal">
              <template slot="title" style="display:flex;align-items:center">
                <svg-icon icon-class="supplier_menu" class="menu-svg"/>国内
              </template>
              <el-menu-item v-for="(item, idx) in internals" :key="idx" :index="item.supplierId">
                <div style="width:120px">
                  <text-tooltips :text="item.accountName" width="120px"/>
                </div>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="foreign">
              <template slot="title">
                <svg-icon icon-class="supplier_menu" class="menu-svg"/>国外
              </template>
              <el-menu-item v-for="(item, idx) in foreigns" :key="idx" :index="item.supplierId">
                <div style="width:120px">
                  <text-tooltips :text="item.accountName" width="120px"/>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-table v-loading="loading" :data="tableData" height="500px">
            <el-table-column label="编号">
              <template slot-scope="scope">
                {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="账号名称" prop="accountName"></el-table-column>
            <el-table-column label="角色" prop="roleName">
              <template slot-scope="{row}">
                <span>{{roles[row.roleId]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="{row}">
                <el-switch
                  :value="row.deleted"
                  active-color="#027AFF"
                  inactive-color="#E5E5E5"
                  :active-value="0"
                  @change="handleChangeStatus(row)"
                  :inactive-value="1">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="邮箱地址" prop="email" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click="showDialog('supplier', row)">编辑</el-button>
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
            style="margin-top:20px"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          /> 
        </el-main>
      </el-container>
    </el-card>
     <!-- 添加/编辑弹框 -->
    <account-editor-dialog 
      @refresh="fetchSupplierAccountList"
      :params="editParams"
      :type="dialogType"
      :dialog-visible.sync="dialogVisible"
    />
  </div>
</template>
<script>
import {
  changeSupplierAccountStatus,
  deleteSupplierAccount,
  querySupplierList,
  querySupplierAccountList
} from '@/api/account.js';
import common from '@/mixins/common.js';
import TextTooltips from '@/components/TextTooltips';
import AccountEditorDialog from './components/AccountEditorDialog';
export default {
  mixins: [common],
  components: {
    TextTooltips,
    AccountEditorDialog
  },
  data() {
    return {
      tableData: [],
      loading: false,
      filter: {
        accountName: '',
        accountStatus: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      statusList: [
        { name: '已开启', id: 'usable' },
        { name: '已关闭', id: 'unusable' },
      ],
      tips: {
        on: '开启后，该账号将可以登录系统',
        off: '关闭后，该账号将无法登录系统',
      },
      roles: {
        supplier: '用户',
        coAdministrator: '管理员'
      },
      supplierList: [], // 全部所属供应商
      internals: [],
      foreigns: [],
      supplierId: '', // 所属供应商id
      supplierName: '', // 所属供应商名称
      // dialog 
      dialogVisible: false,
      dialogType: 'add',
      editParams: {}
    };
  },
  methods: {
    fetchData() {
      querySupplierList().then(res => {
        let data = res.data || [];
        this.supplierList = data;
        // supplierBelong区分国内-0 海外-1
        this.internals = data.filter(item => item.supplierBelong == 0);
        this.foreigns = data.filter(item => item.supplierBelong == 1);
        this.supplierId = this.internals.length ? this.internals[0].supplierId : this.foreigns[0].supplierId;
        this.supplierName = this.internals.length ? this.internals[0].accountName : this.foreigns[0].accountName;
        this.fetchSupplierAccountList();
      });
    },
    

    fetchSupplierAccountList() {
      this.loading = true;
      let params = {
        ...this.page,
        ...this.filter,
        supplierId: this.supplierId
      };
      querySupplierAccountList(params).then(res => {
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
          this.loading = false;
        });
    },

    handleCheckSupplier(index) {
      this.page.pageNum = 1;
      this.supplierId = index;
      let supplierItem = this.supplierList.find(item => item.supplierId === index);
      this.supplierName = supplierItem.accountName;
      this.fetchSupplierAccountList();
    },

    handleChangeStatus(row) {
      // deleted 0--可用 1--不可用
      let str = row.deleted == 0 ? 'off' : 'on';
      this.$confirm(this.tips[`${str}`], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let deleted = row.deleted == 0 ? 1 : 0;
        const { supplierAccountId, supplierId } = row;
        const params = {
          deleted,
          supplierId,
          supplierAccountId
        };
        changeSupplierAccountStatus(params).then(res => {
          this.$message.success('更改状态成功');
          this.fetchSupplierAccountList();
        }).catch(_ => {});
      }).catch(() => {
        console.log('已取消操作');
      });
    },

    showDialog(type, row) {
      this.dialogType = type;
      this.dialogVisible = true;
      if (type == 'add') {
        this.editParams = {
          supplierId: this.supplierId,
          supplierName: this.supplierName
        };
      } else {
        const { roleId, email, contactInformation, weChat, other } = row;
        this.editParams = {
          other,
          email,
          roleId,
          weChat,
          supplierAccountId: row.supplierAccountId,
          name: row.accountName,
          supplierId: this.supplierId,
          contactInformation: contactInformation ? contactInformation : '',
          supplierName: this.supplierName
        };
      }
    },

    handleDelete(row) {
      // display: 0--不在前端展示 1--在前端展示
      const params = { display: '0', supplierAccountId: row.supplierAccountId, supplierId: this.supplierId};
      this.confirmOperate('删除当前账号', deleteSupplierAccount, params, 'refresh_delete');
    },

    handleExport() {
      let params = {
        ...this.filter,
        supplierId: this.supplierId
      };
      this.downloadExcel('/excel/supplierManagementExport', params, '账号管理');
    },

    refreshData() {
      this.fetchSupplierAccountList();
    },

    onFilter() {
      this.fetchSupplierAccountList();
    },

    handlePageChange(pageNum) {
      this.page.pageNum = pageNum;
      this.fetchSupplierAccountList();
    },

    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.fetchSupplierAccountList();
    },

    onReset() {
      this.filter = {
        accountName: '',
        accountStatus: ''
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
.header-nav {
  position: relative;
}
.table-header {
  padding: 24px 24px 0
}
.el-container {
  height: 592px;
  border-top: 1px solid #E6EBF5;
}
.el-aside {
  overflow-x: hidden;
  height: calc(100% - 20px);
  border-right: 1px solid #E6EBF5;
}
.el-main {
  overflow: hidden;
}
</style>
<style lang='scss'>
.supplier-card {
  height: 660px !important;
  .el-card__body {
    padding: 0 !important;
  }
}
.menu-svg {
  color: #909399;
  font-size: 24px;
  margin-right: 10px;
}
</style>
