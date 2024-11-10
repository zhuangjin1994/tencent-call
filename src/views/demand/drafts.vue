<template>
  <div class="page-container">
    <el-card class="header-filter">
      <span>关键字：<el-input v-model="filter.keyword" type="text" placeholder="请输入关键字"/></span>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
      </div>
    </el-card>
    <el-card>
      <!-- <div class="table-header">
        <div class="title">数据列表</div>
      </div> -->
      <el-table :cell-style="getCellStyle" height="490px" v-loading="loading" :data="tableData" >
        <el-table-column label="需求编号" >
          <template slot-scope="{row}">
            <a style="cursor: pointer" @click="$router.push({ path: '/demand/base-detail', query: { id: row.demandId, type: 'draftsEdit' }})">{{row.demandNum}}</a>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(key, val) of TABLE_COLS_ENUM"
          show-overflow-tooltip
          :key="key"
          :prop="val"
          :label="key"
          align="left"
        >
        <template slot-scope="{row}">
          <span v-if="val==='demandStatus'">{{DraftsStatusEnum[row.demandStatus]}}</span>
          <span v-else>{{row[val]}}</span>
        </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" >
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({ path: '/demand/base-detail', query: { id: row.demandId, type: 'draftsEdit' }})">跟踪</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        class="call-pagination"
        layout="prev, pager, next, jumper, sizes, total"
        :page-sizes="[10, 20, 30, 50]"
        :total="page.total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
      />
    </el-card>
  </div>
</template>
<script>
import common from '@/mixins/common.js';
import { DraftsStatusEnum } from '@/enums/index.js';
import {
  copyDemand,
  queryDrafts,
  deleteDemand,
  getDeptByName,
  querySuppliers
} from '@/api/demand.js';
const TABLE_COLS_ENUM = {
  title: '需求名称',
  demander: '需求人',
  departmentName: '所属部门',
  demandStatus: '需求状态',
  demandType: '需求类型',
  auditOpinion: '备注'
};
export default {
  mixins: [common],
  data() {
    return {
      tableData: [],
      loading: false,
      TABLE_COLS_ENUM,
      DraftsStatusEnum,
      filter: {
        keyword: '',
        status: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // btn 
      btns: [
        { name: '编辑', type: 'edit' },
        { name: '复制', type: 'copy' },
        { name: '删除', type: 'delete' }
      ],
      // dialog
      suppliers: [],
      dialogVisible: false,
      departments: [],
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      const params = {
        ...this.page,
        ...this.filter
      };
      queryDrafts(params).then(res => {
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

    handleClick(type, row) {
      const { demandId } = row;
      switch (type) {
        case 'edit':
          this.$router.push({ path: '/demand/edit', query: { id: demandId, type: 'edit' } });
          break;
        case 'copy':
          this.confirmOperate(`将该需求复制到草稿箱`, copyDemand, { demandId });
          break;
        case 'delete':
          this.confirmOperate('删除当前需求', deleteDemand, { demandId });
      }
    },

    getSuppliers() {
      querySuppliers().then(res => {
        this.suppliers = res.data || [];
      }).catch(_ => {});
    },

    // 获取所属部门
    getDepartments() {
      getDeptByName().then(res => {
        this.departments = res.data || [];
      }).catch(err => {});
    },

    gainIcon(btn) {
      return require(`@/assets/btn_icons/${btn}.png`);
    },

    onReset() {
      this.filter.keyword = '';
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'DemandBaseDetail') {
      const breadList = [
        { title: '草稿箱', path: '/demand/drafts' },
        { title: '需求跟踪', path: '' },
      ];
      window.localStorage.setItem('customBread', JSON.stringify(breadList));
    }
    next();
  },
  mounted() {
    this.fetchData();
    this.getSuppliers();
    this.getDepartments();
  }
};
</script>
