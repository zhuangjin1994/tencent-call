<template>
  <div class="page-container">
    <el-card class="header-filter">
      <div>
        部门查询：<el-input v-model="filter.departmentName" type="text" placeholder="请输入部门名称"/>
        额度状态：
        <el-select v-model="filter.quotaStatus" clearable placeholder="请选择额度状态">
          <el-option
            v-for="(item, key) in QuotaStatus"
            :key="item.key"
            :label="item"
            :value="key"
          />
        </el-select>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <div class="table-header">
        <div class="operate-btn">
          <el-button @click="showCheckDialog('add')" type="primary" icon="el-icon-plus">添加</el-button>
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table v-loading="loading"  :data="tableData" height="500px" >
        <el-table-column label="编号">
          <template slot-scope="scope">
            {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
          </template>
        </el-table-column>
        <el-table-column label="所属部门" prop="departmentName"></el-table-column>
        <el-table-column label="编制时长" prop="departmentName">
          <template slot-scope="{row}">
            {{ row.sumPreparationHours | hours(row.sumPreparationHours) }}
          </template>
        </el-table-column>
        <el-table-column label="已用时长">
          <template slot-scope="{row}">
            {{ row.sumCostHours | hours(row.sumCostHours) }}
          </template>
        </el-table-column>
        <el-table-column label="可用时长">
          <template slot-scope="{row}">
            {{ row.sumRemainHours | hours(row.sumRemainHours) }}
          </template>
        </el-table-column>
        <el-table-column label="额度状态">
          <template slot-scope="{row}">
            <span v-if="row.quotaStatus" class="normal-status" :class="{'warning-status': row.quotaStatus !== 'normal'}"></span>
            {{QuotaStatus[row.quotaStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="审批状态">
          <template slot-scope="{row}">
            {{ResourceStatus[row.auditStatus]}}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="left">
          <template slot-scope="{row}">
            <el-button type="text" class="img-btn" v-if="['coAdministrator', 'suAdministrator'].includes(roles[0])"  @click="showDetail(row)">详情</el-button>
            <el-button 
              type="text"
              class="img-btn"
              v-if="['suAdministrator'].includes(roles[0]) && row.auditStatus==='0'"
              @click="showCheckDialog('check', row)"
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
    <!-- 审批/添加弹框 -->
    <check-dialog @refresh="fetchData" :dialog-visible.sync="visible.check" :detail="checkDetail" :type="dialogType" :row-id="rowId"/>
    <!-- 详情弹框 -->
    <detail-dialog :dialog-visible.sync="visible.detail" :rowId="rowId"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import common from '@/mixins/common.js';
import checkDialog from './components/checkDialog';
import detailDialog from './components/detailDialog';
import { QuotaStatus, ResourceStatus } from '@/enums/index.js';
import { queryResourceList, getPreparationHours, getResourceDetail, exportResource } from '@/api/resource.js';
export default {
  mixins: [common],
  components: {
    checkDialog,
    detailDialog
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    return {
      tableData: [],
      loading: false,
      filter: {
        quotaStatus: [],
        departmentName: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      QuotaStatus,
      ResourceStatus,

      visible: {
        check: false,
        detail: false
      },
      checkDetail: {},
      rowId: '',
      dialogType: 'add'
    };
  },
  methods: {
    fetchData() {
      let params = {
        deleted: '0',
        ...this.page,
        ...this.filter
      };
      this.loading = true;
      queryResourceList(params).then(res => {
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
    
    async showCheckDialog(type, row) {
      if (type === 'check') {
        try {
          const { departmentId } = row;
          let { data } = await getPreparationHours({departmentId});
          this.checkDetail = {
            departmentName: row.departmentName,
            preparationHours: data.data.preparationHours
          };
          this.rowId = departmentId;
        } catch (err) {
          console.log(err);
        }
      }
      this.dialogType = type;
      this.visible.check = true;
    },

    handleExport() {
      let params = {
        deleted: '0',
        ...this.filter
      };
      this.downloadExcel('/excel/resourceManagementExport', params, '资源管理');
    },

    showDetail(row) {
      this.rowId = row.departmentName;
      this.visible.detail = true;
    },
    onReset() {
      this.filter = {
        quotaStatus: [],
        departmentName: ''
      };
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
  @include circle(10px, #016FFA);
}
.warning-status {
  background: #FF0000;
}
</style>
