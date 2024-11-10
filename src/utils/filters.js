/**
 * 这里是常用的一些过滤器
 */
const filters = {
  // 保留3位 后面舍弃
  diment(num) {
    const len = 3;
    // .123转为0.123
    const number = Number(num) / 60;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
    }
    let result = number.toString();
    const numberArr = result.split('.');
    if (numberArr.length < 2) {
      // 整数的情况
      return padNum(result);
    }
    const intNum = numberArr[0]; // 整数部分
    const deciNum = numberArr[1]; // 小数部分
    const lastNum = deciNum.substr(len, 1);// 最后一个数字

    if (deciNum.length == len) {
      // 需要截取的长度等于当前长度
      return result;
    }
    if (deciNum.length < len) {
      // 需要截取的长度大于当前长度 1.3.toFixed(2)
      return padNum(result);
    }
    // 需要截取的长度小于当前长度，需要判断最后一位数字
    result = `${intNum}.${deciNum.substr(0, len)}`;
    return result;
    // 对数字末尾加0
    function padNum(num) {
      const dotPos = num.indexOf('.');
      if (dotPos === -1) {
        // 整数的情况
        num += '.';
        for (let i = 0; i < len; i++) {
          num += '0';
        }
        return num;
      }
      // 小数的情况
      const need = len - (num.length - dotPos - 1);
      for (let j = 0; j < need; j++) {
        num += '0';
      }
      return num;
    }
  },
  formatIndex(index) {
    const num = index + 1;
    return parseInt(num) < 10 ? `0${num}` : num;
  },
  hour(minute) {
    if (!minute && minute != 0) return null;
    return (Number(minute / 60).toFixed(3));
  },
  hours(minute) {
    if (!minute && minute != 0) return null;
    return (Number(minute / 60).toFixed(2));
  },
  percent(value, max = 100, decimal = 2) {
    return max ? `${((value / max) * 100).toFixed(decimal)}%` : '0.00%';
  },
  rate(value) {
    return `${(value * 100).toFixed(2)}%`;
  },
  Percentage(value) {
    let sign = '';
    if (value > 0) {
      sign = '+';
    }
    return `${sign + (value * 100).toFixed(2)}%`;
  },
  thousands(num) {
    num = num || 0;
    if (num.toString().indexOf('.') > 0) {
      const list = num.toString().split('.');
      return `${list[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}.${list[1]}`;
    }
    return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },
};

export default filters;

