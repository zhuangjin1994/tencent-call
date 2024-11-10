<template>
  <div class="page-container report-center">
    <el-card class="header-card">
      <el-form class="filter-form" inline>
        <el-form-item class="demander" label="需求人:">
          <el-input v-model.trim="filter.demander" type="text" placeholder="请输入需求人"/>
        </el-form-item>
        <el-form-item label="需求时间:">
          <el-date-picker
            v-model="filter.demandTime"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="访谈时间：">
          <el-date-picker
            v-model="filter.interviewTime"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card style="height:674px">
      <div class="table-header">
        <div class="operate-btn">
          <el-button class="export-btn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table  v-loading="loading" :data="tableData" height="530" :row-style="{height:'53px'}">
        <el-table-column header-align="center" label="需求内容" >
          <el-table-column label="序号" >
            <template slot-scope="scope">
              {{scope.$index + 1 > 9 ? scope.$index + 1 : `0${scope.$index + 1}`}}
            </template>
          </el-table-column>
          <el-table-column label="需求编号" show-overflow-tooltip align="left" prop="demandNum"></el-table-column>
          <el-table-column label="需求名称" show-overflow-tooltip align="left" prop="title"></el-table-column>
          <el-table-column label="需求类型" show-overflow-tooltip align="left" prop="demandType"></el-table-column>
          <el-table-column show-overflow-tooltip label='需求目的' prop="purpose">
            <template slot-scope="{row}">
              <div v-html="row. purpose && row.purpose.replace(/<\/?.+?\/?>/g, '')" class="tinymce"></div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='访谈背景' prop="background">
            <template slot-scope="{row}">
              <div v-html="row. background && row.background.replace(/<\/?.+?\/?>/g, '')" class="tinymce"></div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='专家要求' prop="expertRequirement">
            <template slot-scope="{row}">
              <div v-html="row. expertRequirement && row.expertRequirement.replace(/<\/?.+?\/?>/g, '')" class="tinymce"></div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='访谈问题' prop="interviewQuestion">
            <template slot-scope="{row}">
              <div v-html="row. interviewQuestion && row.interviewQuestion.replace(/<\/?.+?\/?>/g, '')" class="tinymce"></div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(key, val) of DEMAND_COLS_ENUM"
            show-overflow-tooltip
            :key="key"
            :prop="val"
            :label="key" 
            align="left"
          ></el-table-column>
        </el-table-column>
        <el-table-column  header-align="center" label="专家信息" >
          <el-table-column
            v-for="(key, val) of EXPERT_COLS_ENUM"
            show-overflow-tooltip
            :key="key"
            :prop="val"
            :label="key" 
            align="left"
          ></el-table-column>
        </el-table-column>
        <el-table-column  header-align="center" label="结算信息" >
          <el-table-column
            v-for="(key, val) of SETTLE_COLS_ENUM"
            show-overflow-tooltip
            :key="key"
            :prop="val"
            :label="key" 
            align="left"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label='实际时长' prop="actualHours">
             <template slot-scope="{row}">
              {{(row.actualHours / 60).toFixed(3)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='实收时长' prop="incomeHours">
             <template slot-scope="{row}">
              {{(row.incomeHours / 60).toFixed(3)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='调整时长' prop="adjustHours">
            <template slot-scope="{row}">
              {{(row.adjustHours / 60).toFixed(3)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="开始时间" prop="beginDate"></el-table-column>
          <el-table-column show-overflow-tooltip label="结算备注" prop="expertConclusion"></el-table-column>
        </el-table-column>
        <el-table-column  header-align="center" label="验收信息" >
          <el-table-column
            v-for="(key, val) of ACCEPT_COLS_ENUM"
            show-overflow-tooltip
            :key="key"
            :prop="val"
            :label="key" 
            align="left"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
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
  </div>
</template>
<script>
const DEMAND_COLS_ENUM = {
  // demandNum: '需求编号',
  // title: '需求名称',
  // demandType: '需求类型',
  // purpose: '需求目的',
  // background: '需求背景',
  // expertRequirement: '专家要求',
  // interviewQuestion: '访谈问题',
  supplier: '供应商',
  departmentName: '所属部门',
  demandGroup: '所属小组',
  demander: '需求人',
  contractor: '负责人',
  members: '项目成员',
  approver: '业务审批人',
  tag: '需求标签',
  submitDate: '提交时间'
};
const EXPERT_COLS_ENUM = {
  expertId: '专家ID',
  expertName: '专家名称',
  industry: '行业',
  company: '公司',
  position: '职位',
  product: '产品',
  expertBackground: '资历背景',
  magnification: '倍率系数',
  cost: '费用',
  speciality: '特长',
  questionAnswer: '问题回答',
  convenientDate: '方便约谈时间',
  expertEvaluation: '专家评价',
  cooperationDuration: '合作年限',
  other: '其他',
  supplement: '补充信息'
};
const SETTLE_COLS_ENUM = {
  interviewDate: '访谈日期',
  // actualHours: '实际时长',
  // beginDate: '开始时间',
  // demandType: '访谈时长',
  // incomeHours: '计费时长',
  // background: '计费倍率',
  // adjustHours: '调整时长',
  // demandStatus: '调整说明',
  // adjustHours: '调整时间',
  // background: '供应商备注'
};
const ACCEPT_COLS_ENUM = {
  professionalism: '专业度',
  shared: '分享度',
  satisfaction: '服务满意度',
  serviceEvaluation: '服务评价'
};
import common from '@/mixins/common.js';
import { queryReportCenter } from '@/api/databoard.js';
export default {
  mixins: [common],
  data() {
    return {
      loading: false,
      filter: {
        demander: '',
        demandTime: '',
        interviewTime: ''
      },
      DEMAND_COLS_ENUM,
      EXPERT_COLS_ENUM,
      SETTLE_COLS_ENUM,
      ACCEPT_COLS_ENUM,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      queryReportCenter(this.searchParams()).then(res => {
        const { data, pageSize, total } = res.data;
        this.tableData = data || [];
        this.page = Object.assign(this.page, {
          total
        });
      }).catch(err => {})
        .finally(_ => {
          this.loading = false;
        });
    },

    searchParams() {
      const { demandTime, interviewTime, demander } = this.filter;
      const params = {
        demander,
        ...this.page,
        interviewBeginDateFilter: interviewTime.length ? this.moment(interviewTime[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
        interviewEndDateFilter: interviewTime.length ? this.moment(interviewTime[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
        demandBeginDateFilter: demandTime.length ? this.moment(demandTime[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
        demandEndDateFilter: demandTime.length ? this.moment(demandTime[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss') : ''
      };
      return params;
    },

    handleExport() {
      this.downloadExcel('/excel/reportCenterExport', this.searchParams(), '报表中心');
    },

    onReset() {
      this.filter = {
        demander: '',
        demandTime: '',
        interviewTime: ''
      }; 
    }
  },
  watch: {
    'filter.demandTime'(nVal) {
      if (nVal == null) {
        this.filter.demandTime = [];
      }
    },
    'filter.interviewTime'(nVal) {
      if (nVal == null) {
        this.filter.interviewTime = [];
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
.tinymce {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
</style>
<style lang="scss">
.el-tooltip__popper {
  display: inline-block;
  height: auto !important;
  max-height: 38% !important;
  overflow: hidden !important;
}
.report-center {
  .header-card {
    margin-bottom: 6px;
    .el-form-item {
      width: 30%;
      margin-top: 0;
      margin-bottom: 10px;
    }
    .demander {
      width: 28%;
      .el-form-item__label {
        width: 70px;
      }
    }
    .el-form-item__label {
      width: 100px;
      font-size: 12px;
      color: #303133;
    }
    .el-form-item__content {
      width: calc(100% - 100px);
    }
    .el-input,.el-select, .el-date-editor {
      width: 205px;
    }
    .btn {
      float: right;
      display: inline;
      margin-bottom: 10px;
    }
  }
}
</style>
