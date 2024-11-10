export default {
  /**
     * 组装柱状图数据
     * @param sourceData 源数据，数组
     * @param x 横坐标要展示的值在sourceData数组中的字段
     * @param y 纵坐标要展示的值在sourceData数组中的字段
     * @param z 展示的值的标签
     * 如数据源是[{time: '10/1', salesVolume: 100, level: '高'}]
     * 那么x的值传time,y的值传salesVolume，z的值传level
     * @param fixXAxisData 确定的x轴坐标list，不传则从数据里解析
     * @param sortLegendData 要排序的legend data Array {label: xxx, value: xxx} label是legend要显示的值，value是组装数据时用到的值
     * @param sortXConfig 是否对x轴进行排序，一般x轴为时间或者日期时，如果没有传入固定的fixXAxisData，那么需要对日期进行排序
     * @returns {{seriesData: Array, legendData: Array, xAxisData: *}}
     */
  parseBarOrLineData(
    sourceData,
    x,
    y,
    z,
    fixXAxisData,
    sortLegendData,
    sortXConfig = { sortBy: undefined },
    fillEmpty = 0,
  ) {
    const dataMap = {};
    sourceData.forEach((item) => {
      const key = z ? item[z] : 'z';
      if (dataMap[key]) {
        dataMap[key].push(item);
      } else {
        dataMap[key] = [];
        dataMap[key].push(item);
      }
    });

    const legendData = [];
    const legendValue = [];
    /* 条形图不用传sortLegendData*/
    if (sortLegendData && sortLegendData.length) {
      sortLegendData.forEach((legend) => {
        legendData.push(legend.label);
        legendValue.push(legend.value);
      });
    }
    // console.log(legendData,legendValue)
    /* 条形图可以不用传固定的x轴*/
    let xAxisData = [];
    /* 条形图可以不用传排序的legend*/
    const seriesData = sortLegendData && sortLegendData.length ? new Array(sortLegendData.length) : [];
    // console.log(dataMap) //根据模块将数据分开
    const categoryKeys = Object.keys(dataMap);
    // console.log(categoryKeys) //模块名称
    /* 如果需要排序的话，则必须重新整理x轴和数据*/
    if ((categoryKeys && categoryKeys.length > 1) || sortXConfig) {
      if (fixXAxisData && fixXAxisData.length) {
        xAxisData = fixXAxisData;
      } else {
        /* 拿到所有有数据的x轴信息，并按日期进行排序*/
        Object.keys(dataMap).forEach((key, index) => {
          dataMap[key].forEach((data) => {
            if (xAxisData.indexOf(data[x]) === -1) {
              xAxisData.push(data[x]);
            }
          });
        });
        xAxisData.sort(sortXConfig.sortBy);
      }
      categoryKeys.forEach((key, index) => {
        /* 如果有legend，并且legend中有相应的key，则将数据放在固定的位置，否则根据顺序放置*/
        const isFixIndex = !!legendValue && legendValue.length && legendValue.indexOf(key) !== -1;
        const keyIndex = isFixIndex ? legendValue.indexOf(key) : index;
        /* 柱状图和线型图在有多个类型比较时，如果其中一个类型没有一条数据的时候，需要补0处理，条形图不需要*/
        seriesData[keyIndex] = {
          data: new Array(xAxisData.length).fill(fillEmpty),
        };
        dataMap[key].forEach((data) => {
          seriesData[keyIndex].data[xAxisData.indexOf(data[x])] = data[y];
        });
      });
    } else {
      seriesData[0] = { data: [] };
      dataMap[categoryKeys[0]].forEach((data) => {
        xAxisData.push(data[x]);
        seriesData[0].data.push(data[y]);
      });
    }
    /* 需要对不存在的一个系列数据进行补0处理*/
    for (let i = 0; i < seriesData.length; i++) {
      if (!seriesData[i]) {
        seriesData[i] = {
          data: new Array(xAxisData.length).fill(fillEmpty),
        };
      }
    }

    return {
      legendData,
      xAxisData,
      seriesData,
    };
  },

  /**
     * parse 没有分组类型的数据，适合饼图
     * @param sourceData 源数据，数组
     * @param name 饼图横线标示值
     * @param value 饼块数据值
     */
  parseWithoutGroup(sourceData, name, value) {
    // category 的数据存储
    const categories = [];
    // data 的数据存储
    const data = [];

    // 遍历
    sourceData.forEach((item) => {
      categories.push(item[name] || '');
      // 定义一个中间变量
      const tempData = {
        value: item[value] || 0,
        name: item[name] || '',
      };
      data.push(tempData);
    });

    return {
      categories,
      data,
    };
  },
};

