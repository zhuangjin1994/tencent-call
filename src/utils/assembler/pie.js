import dataParser from './dataParser.js';
const defaultColor = ['#E8684A', '#016FFA', '#F6BD16', '#8543E0', '#13C2C2', '#2FC25B'];

export default {
  /**
   * 饼图
   * @param sourceData :  数据[{name: 'x, value: '1'}]
   */
  pie(sourceData) {
    // 数据格式, 获取 data 中的 key
    const keys = [];
    Object.keys(sourceData[0]).forEach((item) => {
      keys.push(item);
    });
    const seriesData = dataParser.parseWithoutGroup(sourceData, keys[0], keys[1]);
    return {
      color: defaultColor,
      // 标题
      title: {
        text: '', // 标题
        subtext: '', // 副标题
        x: 'left', // 位置默认居中
      },
      // 提示
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: null,
        formatter: (params, ticket, callback) => `<div style="background-color:#fff;box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);position:relative;text-align:center;padding:20px;border-radius:4px">
            <span style="font-size:12px;color:#000">${params.name}: </span>
            <span style="font-size:12px;color:#000">${params.value}</span>
          </div>`,
      },
      // 图例文字
      legend: {
        show: true,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        orient: 'vertical', // 垂直：vertical； 水平 horizontal
        right: 12,
        bottom: 5,
        type: 'scroll',
        data: seriesData.categories,
        formatter: (name) => {
          const _obj = (sourceData || []).find(item => item.name === name) || '';
          const total = sourceData.reduce((total, cur) => total + Number(cur.value), 0);
          // return `{name|${name}}|{value|${((_obj.value / total) * 100).toFixed(2)}%}`
          return `{name|${name}}|{value|${_obj.value}}`;
        },
        textStyle: {
          rich: {
            name: {
              color: '#606266',
              fontSize: 14,
              align: 'center',
              padding: [0, 10, 0, 5],
            },
            value: {
              fontSize: 14,
              align: 'center',
              color: '#606266',
              padding: [0, 0, 0, 10],
            },
          },
        },
      },
      series: [
        {
          name: 'title' || '',
          type: 'pie', // 类型
          radius: '60%', // 圆的大小
          center: ['30%', '50%'], // 位置居中
          data: seriesData.data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          // 引导线
          label: {
            normal: {
              show: false,
            },
          },
          // label: {//饼图中间文字设置
          //   normal: {
          //     show: true,
          //     position: 'center',
          //     color:'#9A9EBA',
          //     formatter: '配⽐详情',
          //     },
          //     emphasis: {//中间文字显示
          //         show: true,
          //     }
          // },
          labelLine: {
            normal: {
              show: false,
            },
          },
        },
      ],
    };
  },
};
