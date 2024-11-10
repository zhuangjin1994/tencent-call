<template>
  <!--资源配置超管-->
  <div class="page-container">
    <el-card class="header-filter">
      <div>
        单号查询：
        <el-input v-model="filter.keyword" type="text" maxlength="50" placeholder="请输入单号" />
        审批状态：<el-select v-model="filter.deleted">
          <el-option v-for="item of statusList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card class="table-card" body-style="height:100%">
      <div class="table-header">
        <div class="button-group">
          <el-button class="lable" @click="handleTabChange('default')"
            :type="accountType === 'default' ? 'primary' : ''">
            <span class="text">
              内部
              <span :class="getCount.resourceInnerCount ? 'red' : ''">
                ({{ getCount.resourceInnerCount }})
              </span>
            </span>
          </el-button>
          <el-button class="lable" @click="handleTabChange('supplier')"
            :type="accountType === 'supplier' ? 'primary' : ''">
            <span class="text">
              供应商
              <span :class="getCount.supplierCount ? 'red' : ''">
                ({{ getCount.supplierCount }})
              </span>
            </span>
          </el-button>
        </div>
        <div class="operate-btn">
          <el-button type="primary" @click="onBatchAudit">一键审批</el-button>
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table :key="accountType" v-loading="loading" :data="tableData" height="calc(100% - 115px)" stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="编号" width='80'>
          <template slot-scope="scope">
            {{ scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}` }}
          </template>
        </el-table-column>
        <el-table-column label="单号" prop="billNumber">
          <template slot-scope="{row}">
            <span class='clickStatus' @click="showDetail(row)">{{ row.billNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applier" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批人" prop="auditor" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批状态">
          <template slot-scope="{row}">
            <span>{{ insideStatusEnum[row.auditStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyDate" show-overflow-tooltip></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="text" v-if="(row.auditStatus === 'approving')" @click="showDetail(row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, jumper, sizes, total" :total="page.total" :page-size="page.pageSize"
        :current-page="page.pageNum" :page-sizes="[10, 20, 30, 50]" class="call-pagination" style="margin-top:12px"
        @size-change="onSizeChange" @current-change="onPageChange" v-if="page.total" />
    </el-card>
  </div>
</template>
<script>
import store from '@/store';
import { Roles, insideStatusEnum } from '@/enums/index';
import { statusList } from '@/enums/index.js';
import {
  adminInside,
  adminSuper,
  insideAuditBatch,
  superAuditBatch
} from '@/api/account.js';
import common from '@/mixins/common.js';
export default {
  mixins: [common],
  data() {
    return {
      Roles,
      insideStatusEnum,
      tableData: [],
      multipleSelection: [],
      loading: false,
      filter: {
        keyword: '', // 单号
        deleted: '' // 状态
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      statusList,
      accountType: 'default',
      tabList: [
        { label: '内部', key: 'default' },
        { label: '供应商', key: 'supplier' }
      ],
    };
  },
  computed: {
    getCount() {
      return this.$store.state.app.menuCount;
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showDetail(row) {
      this.accountType === 'default' ? this.$router.push({ path: `/resourceSplit/dataConfigSuperInsideDetail/${row.billNumber}` }) : this.$router.push({ path: `/resourceSplit/dataConfigSuperDetail/${row.billNumber}` });
    },
    onBatchAudit() {
      let hasUnqualified = this.multipleSelection.some(item => item.auditStatus !== 'approving');
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择要审批的数据');
        return;
      } else if (hasUnqualified) {
        this.$message.error('只支持待审批资源一键审批');
        return;
      } else {
        let type = '';
        const demandIdList = this.multipleSelection.map(item => item.billNumber);
        this.$confirm('您是否确认批量审批？', '审批提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '通过',
          cancelButtonText: '驳回',
          type: 'warning'
        }).then(() => {
          type = 'approved';
        }).catch(action => {
          if (action == 'cancel') {
            type = 'rejected';
          } else {
            return;
          }
        }).finally(() => {
          if (!type) return;
          const params = {
            billNumberList: demandIdList,
            auditStatus: type,
          };
          this.accountType === 'default'
            ? insideAuditBatch(params).then(res => {
              this.$message.success(`${type === 'approved' ? '审批' : '驳回'}成功`);
              this.fetchData();
              store.dispatch('app/getMessages');
            }).catch(_ => { }) : superAuditBatch(params).then(res => {
              this.$message.success(`${type === 'approved' ? '审批' : '驳回'}成功`);
              this.fetchData();
              store.dispatch('app/getMessages');
            }).catch(_ => {
              console.log(_);
            });
        });
      }
    },
    fetchData() {
      this.loading = true;
      let api = this.accountType === 'default' ? adminInside : adminSuper;
      const { keyword, deleted } = this.filter;
      let params = {
        ...this.page,
        billNumber: keyword,
        auditStatus: deleted // 审批状态,
      };
      api(params).then(res => {
        const { data, total } = res.data;
        this.tableData = data || [];
        this.page = Object.assign(this.page, {
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
    handleExport() {
      const { keyword, deleted } = this.filter;
      let params = {
        billNumber: keyword,
        auditStatus: deleted
      };
      this.accountType === 'default' ? this.downloadExcel('/resource/configListExport', params, '内部资源')
        : this.downloadExcel('/supplierResource/configListExport', params, '供应商资源');
    },
    pageTypes() {
      const { pages } = this.$route.query;
      this.accountType = pages ? pages : 'default';
    },
    handleTabChange(lable) {
      this.accountType = lable;
      this.page.pageNum = 1;
      this.fetchData();
    },
    onReset() {
      this.filter = {
        keyword: '',
        deleted: ''
      };
      this.fetchData();
    }
  },
  filters: {
    formatIndex(index) {
      let num = index + 1;
      return parseInt(num) < 10 ? '0' + num : num;
    }
  },
  mounted() {
    this.pageTypes();
    this.fetchData();
  }
};
</script>
<style lang='scss' scoped>
.page-container {
  height: 100%;
}

.header-nav {
  position: relative;
}

.clickStatus {
  color: #1891ff;
  cursor: pointer;
}

.button-group {
  position: relative;

  .el-buttom {
    display: inline-block;

    :last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: none;
    }

    :first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }
  }

  .el-button+.el-button {
    margin-left: 0;
  }
}

.red {
  color: red;
}


::v-deep {
  .table-card {
    height: calc(100% - 90px) !important;
  }

  .lable:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }

  .lable:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
