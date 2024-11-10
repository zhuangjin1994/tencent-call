import dataParser from './dataParser.js';
import echarts from 'echarts';

const defaultColor = [
  { color: '#2E8DFF', areaColor: 'rgba(46, 141, 255, 0.13)' },
  { color: '#37BE8F', areaColor: 'rgba(55, 190, 143, 0.13)' },
];

export default {
  /**
   * 组装柱状图Options,常规以x为横轴，y展示数据
   * @param sourceData 源数据，数组
   * @param x 横坐标要展示的值在sourceData数组中的字段
   * @param y 纵坐标要展示的值在sourceData数组中的字段
   * @param z 展示的值的标签
   * 如数据源是[{date: '10/1', salesVolume: 100, level: '高'}]
   * 那么x的值传date,y的值传salesVolume，z的值传level
   * @param fixXAxisData 确定的x轴坐标list，不传则从数据里解析
   * @param sortLegendData 要排序的legend data Array {label: xxx, value: xxx} label是legend要显示的值，value是组装数据时用到的值
   * @param sortXConfig 是否对x轴进行排序，一般x轴为时间或者日期时，如果没有传入固定的fixXAxisData，那么需要对日期进行排序
   * @returns {{
   *  yAxis: {
   *    axisLabel: {fontFamily: string,color: string, fontWeight: number},
   *    axisLine: {lineStyle: {color: string}},
   *    minInterval: number,
   *    splitLine: {color: string, show: boolean},
   *    show: boolean,
   *    type: string
   *  }[],
   *  xAxis: {axisLabel: {fontFamily: string, color: string, fontWeight: number},
   *  data: *,
   *  axisLine: {lineStyle: {color: string}, show: boolean},
   *  axisTick: {lineStyle: {color: string, width: number}, length: number},
   *  type: string,
   *  boundaryGap: boolean}[],
   *  color: *[],
   *  legend: {
   *    itemGap: number,
   *    data: Array,
   *    itemHeight: number,
   *    show: boolean,
   *    icon: string,
   *    itemWidth: number,
   *    right: number,
   *    textStyle: {fontFamily: string, color: string, fontSize: number}
   *  },
   *  grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean},
   *  series: Array,
   *  tooltip: {
   *    show: boolean,
   *    axisPointer: {label: {backgroundColor: string, show: boolean},type: string},
   *    trigger: string
   *  },
   *  title: {
   *    left: number,
   *    text: string,
   *    textStyle: {fontFamily: string, color: string, fontSize: number, fontWeight: string}
   *  }
   * }}
   */
  assembleLineOptions(
    sourceData,
    x,
    y,
    z,
    fixXAxisData,
    sortLegendData,
    sortXConfig = { sortBy: undefined },
    fillEmpty = 0,
  ) {
    if (!sourceData || !sourceData.length) {
      return null;
    }
    const { legendData, xAxisData, seriesData } = dataParser.parseBarOrLineData(
      sourceData,
      x,
      y,
      z,
      fixXAxisData,
      sortLegendData,
      sortXConfig,
      fillEmpty,
    );
    const series = [];
    seriesData.forEach((item, index) => {
      const seriesConfig = {
        name: legendData[index],
        type: 'line',
        showSymbol: true,
        symbolSize: 6,
        symbol: 'circle',
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#027AFF',
            },
            {
              offset: 1,
              color: '#ffffff',
            },
          ]),
        },
        data: item.data,
        smooth: true,
      };
      series.push(seriesConfig);
    });

    return {
      color: defaultColor.map(item => item.color),
      title: {
        text: '',
        left: 20,
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontFamily: 'PingFangSC-Regular',
          fontWeight: 'normal',
        },
      },
      legend: {
        show: legendData.length > 1,
        data: legendData,
        right: 24,
        itemGap: 27,
        itemHeight: 16,
        itemWidth: 16,
        icon: 'rect',
        textStyle: {
          color: '#999999',
          fontSize: 14,
          fontFamily: 'PingFangSC-Regular',
        },
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#999999',
            show: false,
          },
        },
        backgroundColor: null,
        formatter: (params, ticket, callback) => `<div style="background-color:#fff;box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);position:relative;text-align:left;padding:20px;border-radius:4px">
            <p style="font-size:12px;color:#000">${params[0].name}</p>
            <p style="font-size:12px;color:#000">
              <span style="display:inline-block;margin-right:6px;border-radius:50%;width:6px;height:6px;background:#027AFF"></span>
              使用量：${params[0].value}
            </p>
          </div>`,
      },
      grid: {
        top: '42',
        left: '45',
        right: '47',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false, // 两侧留白
          axisLine: { // x轴样式
            show: true,
            lineStyle: {
              color: '#D9D9D9',
            },
          },
          axisLabel: { // 刻度文字
            color: '#606266',
            fontFamily: 'PingFangSC-Regular',
            fontWeight: 400,
            rotate: '30',
          },
          axisTick: { // 刻度线
            length: 8,
            lineStyle: {
              width: 2,
              color: '#D9D9D9',
            },
          },
          data: xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: { // 水平网格线
            show: true,
            lineStyle: {
              color: '#E8E8E8',
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#DCDDE0',
            },
          },
          axisLabel: {
            color: '#606266',
            fontFamily: 'PingFangSC-Regular',
            fontWeight: 400,
          },
          minInterval: 1,
          show: true,
        },
      ],
      series,
    };
  },
};
