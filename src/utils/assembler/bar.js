import arith from '@/utils/floatnum.js';
const defaultColor = [
  '#B386F2',
  '#1C4EDD',
  '#2DAAFF',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];

export default {
  // 保留三位小数
  filterNum(num) {
    const remain = num.toFixed(4);
    return remain.substring(0, remain.lastIndexOf('.') + 4);
  },
  /**
   * 组装柱状图Options,常规以x为横轴，y展示数据
   * @param sourceData 源数据，数组
   * @param x 横坐标要展示的值在sourceData数组中的字段
   * @param y 纵坐标要展示的值在sourceData数组中的字段
   * @param z 展示的值的标签
   * @returns {{
   *  yAxis: {type: string}[],
   *  xAxis: {data: Array, type: string}[],
   *  color: string[],
   *  legend: {data: Array},
   *  grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean},
   *  series: Array,
   *  tooltip: {axisPointer: {type: string},
   *  trigger: string}
   * }}
   */
  assembleBarXOptions(sourceData, x, y, z) {
    if (!sourceData || !sourceData.length) {
      return null;
    }
    const xAxisData = sourceData.map(item => item.name);
    return {
      color: defaultColor,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: null,
        formatter: (params, ticket, callback) => {
          const total = arith.add(params[0].value, params[1].value);
          return `<div style="background-color:#fff;box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);position:relative;text-align:left;padding:20px;border-radius:4px">
            <p style="font-size:12px;color:#000">${params[0].name}</p>
            <p style="font-size:12px;color:#000">
              <span style="display:inline-block;margin-right:6px;border-radius:50%;width:6px;height: 6px;background: #C0C4CC;"></span>
              总资源： ${this.filterNum(total)}
            </p>
            <p style="font-size:12px;color:#000">
              <span style="display:inline-block;margin-right:6px;border-radius:50%;width:6px;height: 6px;background: #016FFA;"></span>
              已用资源：${params[0].value}
            </p>
          </div>`;
        },
      },
      legend: {
        show: false,
      },
      grid: {
        left: '45',
        right: '47',
        bottom: '24',
        top: '42',
        containLabel: true,
        borderColor: 'white' /* 白色隐藏border*/,
        show: true, /* 是否展示网格线*/
      },
      xAxis: [{
        type: 'category',
        data: xAxisData,
        nameTextStyle: {
          color: '#999999',
          fontSize: '14px',
          fontWeight: 400,
          fontFamily: 'PingFangSC-Regular',
        },
        axisTick: {
          show: false, /* 是否展示x轴刻度*/
        },
        axisLine: {
          show: true /* 是否展示x轴线*/,
          lineStyle: {
            color: '#D9D9D9',
          },
        },
        axisLabel: {
          // interval: 1, // 解决x轴展示过多，间隔一行展示
          // rotate: 40, // x轴倾斜展示
          show: true /* 是否展示x轴label*/,
          textStyle: {
            color: '#606266',
          },
        },
      }],
      yAxis: [{
        type: 'value',
        nameTextStyle: {
          color: '#606266',
          fontSize: '14px',
          fontWeight: 400,
          fontFamily: 'PingFangSC-Regular',
        },
        axisTick: 'none',
        axisLabel: {
          show: true,
          textStyle: { color: '#606266' },
        },
        splitLine: {
          show: true,
          lineStyle: { color: '#E8E8E8' },
        },
        axisLine: {
          show: false,
          lineStyle: { color: '#E6E6E6' },
        },
      }],
      series: [],
    };
  },
};
