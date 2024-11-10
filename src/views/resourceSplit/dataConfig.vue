<template>
  <!--资源配置-->
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
          <el-button type="primary" @click="addResourePage">新增</el-button>
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table :key="accountType" v-loading="loading" :data="tableData" height="calc(100% - 115px)" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column label="编号" width='80'>
          <template slot-scope="scope">
            {{ scope.$index | formatIndex(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column label="单号" prop="billNumber">
          <template slot-scope="{row}">
            <span class='clickStatus' @click="showDetail(row)">{{ row.billNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applier" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批人" prop="auditor" show-overflow-tooltip></el-table-column>
        <el-table-column label="审批状态" prop='auditStatus'>
          <template slot-scope="{row}">
            <span>{{ insideStatusEnum[row.auditStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="applyDate" show-overflow-tooltip></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <span>
              <el-button type="text" v-if="(row.auditStatus === 'rejected')" @click="edit(row)">编辑</el-button>
            </span>
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
import { mapGetters } from 'vuex';
import { Roles, insideStatusEnum } from '@/enums/index';
import { queryInside, querySuper, } from '@/api/account.js';
import { statusList } from '@/enums/index.js';
import { CheckStatusEnum } from '@/enums/index.js';
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
        keyword: '', // 单号查询
        deleted: '' // 审批状态
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // 审批状态
      statusList,
      accountType: 'default',
      tabList: [
        { label: '内部', key: 'default' },
        { label: '供应商', key: 'supplier' }
      ],
      lableIndex: 0
    };
  },
  computed: {
    ...mapGetters(['roles']),
    getCount() {
      return this.$store.state.app.menuCount;
    }
  },
  methods: {
    // 新增
    addResourePage() {
      this.accountType === 'default' ? this.$router.push('/resourceSplit/insideAdd/add') : this.$router.push('/resourceSplit/superAdd/add');
    },
    edit(row) {
      this.accountType === 'default' ? this.$router.push({ path: `/resourceSplit/insideAdd/${row.billNumber}` }) : this.$router.push({ path: `/resourceSplit/superAdd/${row.billNumber}` });
    },
    showDetail(row) {
      this.accountType === 'default' ? this.$router.push({ path: `/resourceSplit/insideDetail/${row.billNumber}` }) : this.$router.push({ path: `/resourceSplit/superDetail/${row.billNumber}` });
    },
    fetchData() {
      this.loading = true;
      let key = this.accountType === 'default' ? 'userId' : 'accountName';
      let api = this.accountType === 'default' ? queryInside : querySuper;
      const { keyword, deleted } = this.filter;
      let params = {
        ...this.page,
        billNumber: keyword, // 单号
        auditStatus: deleted, // 审批状态
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
        // display: '11',
        billNumber: keyword,
        auditStatus: deleted
      };
      this.accountType === 'default' ? this.downloadExcel('/resource/configListExport', params, '内部资源')
        : this.downloadExcel('/supplierResource/configListExport', params, '供应商资源');
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
    },
    pageType() {
      const { pages } = this.$route.query;
      this.accountType = pages ? pages : 'default';
    }
  },
  mounted() {
    this.pageType();
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

.red {
  color: red;
}

.text {
  display: inline-block;

  >* {
    display: inline-block;
  }
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

::v-deep {
  .table-card {
    height: calc(100% - 90px) !important;
  }

  .is-active {
    >.el-radio-button__inner {
      >.red {
        color: inherit;
      }
    }
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
