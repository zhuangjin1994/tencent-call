export default {
  isNumber(o) {
    return toString.call(o) === '[object Number]';
  },
  isDate(o) {
    return toString.call(o) === '[object Date]';
  },
  GMTToStr(time) {
    const date = new Date(time);
    const str      = `${date.getFullYear()
    }-${
      date.getMonth() + 1
    }-${
      date.getDate()
    } ${
      date.getHours()
    }:${
      date.getMinutes()
    }:${
      date.getSeconds()}`;
    return str;
  },

  // 格式化时间
  timeFormat(time, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!time) {
      return '';
    }
    if (this.isNumber(time) && (`${time}`).length === 10) {
      time *= 1000;
    }

    if (!this.isDate(time)) {
      time = new Date(time);
    }
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const hours24 = time.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    const dd = t => (`0${t}`).slice(-2);
    const map = {
      YYYY: year,
      MM: dd(month + 1),
      M: month + 1,
      DD: dd(day),
      D: day,
      HH: dd(hours24),
      H: hours24,
      hh: dd(hours),
      h: hours,
      mm: dd(minutes),
      m: minutes,
      ss: dd(seconds),
      s: seconds,
      S: milliseconds,
    };
    return (format || this.format).replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, str => map[str]);
  },
};
