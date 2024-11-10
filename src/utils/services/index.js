import axios from 'axios';
import Vue from 'vue';
import { Message } from 'element-ui';
import { setToken, getToken, removeToken } from '@/utils/auth';

const service = axios.create({
  timeout: 30000,
  // 基础url，会在请求url中自动添加前置链接
  baseURL: process.env.VUE_APP_BASE_API,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
Vue.prototype.$http = axios; // 并发请求

const showMessage = (message, type = 'error') => {
  Message({
    type,
    duration: 3000,
    message,
  });
};

/**
 * 服务端接口empty字符串，数组跟null返回的结果不同，对此进行过滤
 * @param params
 */
function filterEmptyKey(params) {
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null || (Array.isArray(params[key]) && !params[key].length)) {
      delete params[key];
    }
  });
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`; // 请求头部添加token
    }
    // 模拟网关接入-向后端发送用户名
    config.headers.STAFFNAME = 'v_jojocyuan';
    // carenli  v_jojocyuan v_sunnyqliu
    if (config.method === 'post') {
      const params = {
        ...config.data,
      };
      filterEmptyKey(params);
      config.data = params;
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
      };
    }
    return config;
  },
  error => Promise.reject(error),
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config, headers } = response;
    if (data.code !== '0') {
      const msg = data.msg || '数据库异常，请稍后重试';
      const code = data.code || -1000;
      // 未手动配置隐藏消息提示时，公共提醒错误
      if (!config.hidden) {
        showMessage(`${config.action}失败：${msg}`);
      }
      return Promise.reject({
        code,
        message: msg,
      });
    }
    // headers.authorization && setToken(headers.authorization)
    headers.staffname && setToken(headers.staffname);
    return ({ data: data.body } || {});
  },
  (error) => {
    if (!error.config.hidden) {
      let { message } = error;
      if (error.response && error.response.status === 403) {
        message = '您没有该权限';
      } else if (error.response && error.response.status === 502) {
        message = '系统升级中，请稍后重试';
      } else if (error.response && error.response.status === 504) {
        message = '系统超时，请重试';
      } else if (error.response && error.response.status === 401) {
        message = '授权过期，请重新登录';
        removeToken();
        window.open(`http://${document.domain}/_logout/?url=${document.domain}`, '_self');
        // window.open(`http://${document.domain}/_logout/?url=${document.domain}`, '_self')
        // let hash = window.location.hash
        // if (hash.startsWith('#')) hash = hash.substring(1)
        // hash = encodeURIComponent(hash)
        // window.top.location.href = `#/login?redirect=${hash}`
      }
      showMessage(error.response.data.msg || `${error.config.action}失败：${message}`);
    }
    return Promise.reject(error);
  },
);

/**
 * 以json格式向后端提交数据
 *
 * @param {String} url 请求的url
 * @param {Object} params 参数
 * @param {Object} config 配置
 *
 * @returns promise对象
 */
service.json = (url, params, config) => {
  const type = Object.prototype.toString.call(params);

  const defaultConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest(data) {
      if (type.includes('Array')) {
        return JSON.stringify(params);
      } if (type.includes('FormData')) {
        return params;
      }
      return JSON.stringify(data);
    },
  };
  const newConfig = Object.assign(defaultConfig, config);
  return service.post(url, params, newConfig);
};

export default service;
