<template>
  <div class="data-board">
    <div class="resource">
      <div class="item-resource" :style="{background:getColor(item.title)}" v-for="item in resourceData" :key="item.title">
        <span class="resource-title">{{item.title}}</span>
        <span class="resource-number">{{item.num | diment(item.num)}}</span>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-header">
        <p class="chart-title">月度资源使用情况</p>
        <div class="block">
          <span class="picker_title">
            <el-tooltip class="item" effect="dark" :content="tips.date" placement="top-start">
              <i class="el-icon-question tip-bubble"></i>
            </el-tooltip>
            分析周期：
          </span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="timeInterval"
            type="monthrange"
            range-separator="-"
            @change="changeDate"
          />
        </div>
      </div>
      <chart ref="chart" v-if="MonthlyInfo && MonthlyInfo.length" height="340px" :options="MonthlyOption" />
      <placeholder v-else height="340px" />
    </div>
    <div class="chart-card">
      <div class="chart-header">
        <span class="title-tip">
          <p class="chart-title">部门资源使用情况</p>
          <el-tooltip class="item" effect="dark" :content="tips.pie" placement="top-start">
            <i  class="el-icon-question tip-bubble"></i>
          </el-tooltip>
        </span>
        <div class="ranking-block">
          <span class="ranking-title">消耗小时TOP10排行榜</span>
          <span class="header-btn">
            <el-tooltip content="刷新总排名" placement="top">
              <i class="el-icon-refresh" style="margin-right:10px;cursor:pointer;" @click="refreshRankingList"></i>
            </el-tooltip>
            <el-tooltip content="查看更多总排名" placement="top">
              <i class="el-icon-tickets" style="cursor: pointer" @click="showAllRankingList"></i>
            </el-tooltip>
          </span>
        </div>
      </div>
      <div class="flex-card">
        <div class="department">
          <chart @handleClick="clickPieChart" ref="chart" v-if="departmentInfo && departmentInfo.length" height="420px" :options="departmentOption"/>
          <placeholder v-else height="400px" />
        </div>
        <div class="hours">
          <el-table height="440" v-loading="loading" :cell-style="{padding: '6px'}" :data='consumeHours'>
            <el-table-column label="排名">
              <template slot-scope="scope">
                <span v-if="scope.$index+1 == 1"><img :src="gainIcon('no_1')"/></span>
                <span v-else-if="scope.$index+1 == 2"><img :src="gainIcon('no_2')"/></span>
                <span v-else-if="scope.$index+1 == 3"><img :src="gainIcon('no_3')"/></span>
                <span v-else class="no">{{scope.$index+1}} </span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="demander" show-overflow-tooltip></el-table-column>
            <el-table-column label="消耗小时数" show-overflow-tooltip prop="personalTotalCostHours">
              <template slot-scope="{row}">
                {{ row.personalTotalCostHours | diment(row.personalTotalCostHours) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="chart-footer">
      <div class="chart-card supplier">
        <div class="chart-header">
          <p class="chart-title">供应商资源使用情况</p>
        </div>
        <chart ref="chart" v-if="supplierInfo && supplierInfo.length" height="320px" :options="supplierOption" />
        <placeholder v-else height="320px" />
      </div>
      <div class="chart-card demandType">
        <div class="chart-header">
          <p class="chart-title">需求类型分布情况</p>
        </div>
        <chart ref="chart" v-if="demandTypeInfo && demandTypeInfo.length" height="320px" :options="demandTypeOption" />
        <placeholder v-else height="320px" />
      </div>
    </div>
    <!-- 总排行榜 -->
    <all-ranking-list :dialog-visible.sync="dialogVisible" :data="rankingList"/>
  </div>
</template>
<script>
import Chart from '@/components/ChartBase';
import Placeholder from '@/components/Placeholder';
import { pie, bar, line } from '@/utils/assembler';
import AllRankingList from './components/AllRankingList';
import {
  queryResourceYear,
  queryResourceMonthly,
  queryDepartmentCostHours,
  queryTopCostHours,
  querySupplierCostHours,
  queryDemandType
} from '@/api/databoard.js';
export default {
  components: {
    Chart,
    Placeholder,
    AllRankingList
  },
  data() {
    return {
      timeInterval: [],
      resourceData: [
        { title: '年度总资源', num: 0 },
        { title: '年度已用资源', num: 0 },
        { title: '年度剩余资源', num: 0 }
      ],
      // 月度资源使用情况
      MonthlyInfo: [],
      MonthlyOption: null,
      // 需求类型分布信息
      demandTypeInfo: [], 
      demandTypeOption: null,
      // 部门资源使用情况
      departmentInfo: [],
      departmentOption: null,
      // 消耗小时数
      consumeHours: [],
      loading: false,
      // 供应商资源使用情况
      supplierInfo: [],
      supplierOption: null,
      
      departmentName: '',
      dialogVisible: false,
      rankingList: [],

      tips: {
        date: '选择时间范围将联动筛选【月度资源分析周期、部门资源、供应商资源、需求类型】4个图表',
        pie: '单击圆环中其中一个部门，将会实时刷新部门排行榜'
      }
    };
  },
  computed: {
    dateParams() {
      let monthLastDay = this.moment(this.timeInterval[1]).endOf('month').format('YYYY-MM-DD');
      const params = {
        startDateStr: `${this.timeInterval[0]} 00:00:00`,
        endDateStr: `${monthLastDay} 23:59:59`
      };
      return params;
    }
  },
  methods: {
    getColor(title) {
      let colors = {
        年度总资源: 'linear-gradient(270deg, #4fbafd 0%, #2784fb 100%)',
        年度已用资源: 'linear-gradient(90deg, #fe9b44 0%, #fdce70 100%)',
        年度剩余资源: 'linear-gradient(90deg, #e44d4a 0%, #f7918f 100%)'
      };
      return colors[title];
    },

    // 月份跨度限制
    changeDate(val) {
      let result = [];
      let startTime = new Date(val[0]);
      let endTime = new Date(val[1]);
      while (startTime.getTime() < endTime.getTime()) {
        result.push(startTime.getTime());
        startTime.setMonth(startTime.getMonth() + 1);
      }
      if (result.length > 23) {
        this.$message.error('周期选择范围不得超过24个月,请重新选择');
        this.initMonthRange();
      } else {
        this.setMonthlyOption();
        this.setConsumeHours();
        this.setDemandTypeOption();
        this.setSupplierOption();
        this.setdDepartmentOption();
      }
    },

    // drawChart() {
    //   let myChart = echarts.init(this.$refs.chartContainer);
    //   this.option && myChart.setOption(this.option);
    // },

    // 获取年度资源概览 
    setResourceYear() {
      queryResourceYear().then(res => {
        this.resourceData[0].num = (res.data || {}).totalPreparationHours || 0;
        this.resourceData[1].num = (res.data || {}).totalUsedResourceHours || 0;
        this.resourceData[2].num = (res.data || {}).totalRemainResourceHours || 0;
      }).catch(_ => {});
    },

    // 月度资源使用情况
    setMonthlyOption() {
      queryResourceMonthly(this.dateParams).then(res => {
        // this.MonthlyInfo = [{ date: '2021-10-22', data: '3' }]
        let data = res.data || [];
        this.MonthlyInfo = data.map(item => ({date: this.moment(item.startDateStr).format('yyyy-MM'), data: this.filterNum(item.sumCostHours)}));
        if (!this.MonthlyInfo.length) return;
        const opts = line.assembleLineOptions(this.MonthlyInfo, 'date', 'data');
        this.MonthlyOption = opts;
      }).catch(_ => {});
    },

    // 部门资源使用情况
    async setdDepartmentOption() {
      try {
        await queryDepartmentCostHours(this.dateParams).then(res => {
          // this.departmentInfo = [{ name: '战略发展部', value: '3' }]
          this.departmentInfo = res.data.map(item => ({name: item.departmentName, value: item.departmentCostHours}));
          if (!this.departmentInfo.length) return;
          let totalNum = this.departmentInfo.reduce((total, item) => { return total + item.value; }, 0);
          const opts = pie.pie(this.departmentInfo);
          opts.series[0].radius = ['45%', '60%'];
          opts.legend.bottom = '16%';
          opts.legend.top = '26%';
          opts.legend.left = '60%';
          opts.title = {
            text: ['{name|总计}', '{value|' + this.filterNum(totalNum) + '}'].join('\n'),
            top: 'center',
            left: '30%',
            textAlign: 'center',
            textStyle: {
              rich: {
                name: {
                  color: '#C0C4CC',
                  fontSize: 14,
                  lineHeight: 20
                },
                value: {
                  color: '#000',
                  fontSize: 30,
                  fontWeight: 'bold',
                  lineHeight: 40,
                }
              }
            }
          },
          opts.legend.formatter = name => {
            let _obj = (this.departmentInfo || []).find(item => item.name === name) || '';
            return `{name|${name}}|{value|${this.filterNum(_obj.value)}}`;
          };
          opts.tooltip.formatter = (params, ticket, callback) => {
            return `<div style="background-color:#fff;box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);position:relative;text-align:center;padding:20px;border-radius:4px">
              <span style="font-size:12px;color:#000">${params.name}: </span>
              <span style="font-size:12px;color:#000">${this.filterNum(params.value)}</span>
            </div>`;
          };
          opts.tooltip.confine = true;
          opts.series[0].itemStyle = {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          opts.series[0].label = {
            formatter: '{d}%',
          },
          opts.series[0].avoidLabelOverlap = true; // 防止标签过多重叠
          opts.series[0].minAngle = 5;
          opts.series[0].labelLine = {
            normal: {
              show: true,
              length: 5,
              lineStyle: {
                color: '#808080'
              },
            }
          },
          this.departmentOption = opts;
        });
      } catch (err) {}
    },

    // 消耗小时排行榜
    async setConsumeHours() {
      this.loading = true;
      const params = {
        pageSize: 10,
        ...this.dateParams,
        departmentName: this.departmentName
      };
      // this.consumeHours = [{ name: '张三', time: 10 }]
      await queryTopCostHours(params).then(res => {
        this.consumeHours = res.data || [];
      }).catch(_ => {})
        .finally(_ => { this.loading = false; });
    },

    async showAllRankingList() {
      const params = {
        ...this.dateParams,
        departmentName: this.departmentName
      };
      await queryTopCostHours(params).then(res => {
        this.rankingList = res.data || [];
      }).catch(_ => {});
      this.dialogVisible = true;
    },

    refreshRankingList() {
      this.departmentName = '';
      this.setConsumeHours();
    },

    // 供应商资源使用情况
    setSupplierOption() {
      // this.supplierInfo = [{ total: 17, used: 8, name: '供应商1' }]
      querySupplierCostHours(this.dateParams).then(res => {
        let data = res.data || [];
        this.supplierInfo = data.map(item => ({
          name: item.supplierName,
          unused: this.filterNum(item.supplierTotalCostHours),
          used: this.filterNum(item.supplierTotalUsableHours)
        }));
        if (!this.supplierInfo.length) return;
        const opts = bar.assembleBarXOptions(this.supplierInfo, 'name', 'unused', 'used');
        let unuseds = this.supplierInfo.map(item => item.unused);
        let useds = this.supplierInfo.map(item => item.used);
        opts.series = [
          {
            name: '已用',
            type: 'bar',
            stack: '使用情况',
            data: useds,
            itemStyle: {
              normal: {color: '#016FFA'},
            }
          }, {
            name: '未用',
            type: 'bar',
            stack: '使用情况',
            data: unuseds,
            barWidth: 20,
            itemStyle: {
              normal: {color: '#C0C4CC'},
            }
          }
        ];
        this.supplierOption = opts;
      });
    },

    // 需求类型分布情况
    setDemandTypeOption() {
      // this.demandTypeInfo = [{ name: '数据', value: '3' }]
      queryDemandType(this.dateParams).then(res => {
        let data = res.data || [];
        this.demandTypeInfo = data.map(item => ({name: item.demandType, value: item.count}));
        if (!this.demandTypeInfo.length) return;
        const opts = pie.pie(this.demandTypeInfo);
        opts.series[0].label = {
          position: 'inner',
          // formatter: '{d}%',
          formatter(params) {
            return `${params.percent}%`;
          }
        };
        opts.legend.right = 50;
        this.demandTypeOption = opts;
      });
    },

    // 点击部门资源显示对应部门消耗时间排行榜
    clickPieChart(params) {
      this.departmentName = params.name;
      this.setConsumeHours();
    },

    // 初始化时间选择
    initMonthRange() {
      const year = new Date().getFullYear();
      this.timeInterval = [`${year}-01-01`, `${year}-12-31`];
    },

    // 时间分钟转化为小时/60后，保留三位小数
    filterNum(num) {
      let remain = (num / 60).toFixed(4);
      return remain.substring(0, remain.lastIndexOf('.') + 4);
    },

    gainIcon(btn) {
      return require(`@/assets/btn_icons/${btn}.png`);
    }
  },
  mounted() {
    this.initMonthRange();
    this.setResourceYear();
    this.setMonthlyOption();
    this.setConsumeHours();
    this.setDemandTypeOption();
    this.setSupplierOption();
    this.setdDepartmentOption();
  }
};
</script>
<style  lang="scss">
.data-board {
  margin-top: 10px;
  .resource {
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .item-resource {
      width: 30%;
      height: 108px;
    }
    .resource-title {
      display: block;
      font-size: 14px;
      line-height: 22px;
      padding-top: 22px;
      color: #fff;
      margin-left: 32px;
    }
    .resource-number {
      display: block;
      font-size: 30px;
      line-height: 38px;
      margin-top: 4px;
      color: #fff;
      margin-left: 32px;
    }
  }
  .picker_title {
    position: relative;
    .tip-bubble {
      font-size: 16px;
      top: -2px;
      left: -18px;
      position: absolute;
      color: #FF0000;
    }
  }
  .title-tip {
    position: relative;
    padding-left: 10px;
    .tip-bubble {
      font-size: 16px;
      top: 4px;
      left: -10px;
      position: absolute;
      color: #FF0000;
    }
  }
  .chart-card {
    position: relative;
    min-height: 388px;
    margin-top: 24px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .chart-header {
      height: 56px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: #E8E8E8 1px solid;
      .chart-title, .ranking-title {
        color: #303133;
        font-size: 16px;
        font-weight: 600;
      }
      .ranking-block {
        width: calc(100% - 700px);
        .header-btn {
          float: right;
          font-size: 14px;
          color: #016FFA;
        }
      }
    }
  }
  .flex-card {
    display: flex;
    .department {
      width: 720px;
    }
    .hours {
      width: calc(100% - 720px);
      margin-left: 10px;
    }
  }
  .chart-footer {
    background: #f0f3f4;
    display: flex;
    .supplier {
      width: 650px;
      margin-right: 24px;
    }
    .demandType {
      width: calc(100% - 674px);
      min-width: 250px;
    }
  }
}
</style>
