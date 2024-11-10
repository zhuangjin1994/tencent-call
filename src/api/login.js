import service from '@/utils/services';

export function login(params) {
  // return service.post(`/login/login`, params, {
  return service.post('/loginForDemand/login', params, {
    action: '登陆',
    hidden: true,
  });
}

export function getInfo(params) {
  // return service.post('/login/getUserInfo', params, {
  return service.post('/loginForDemand/getUserInfo', params, {
    action: '获取用户信息',
    hidden: true,
  });
}

export function getMsgData(params) {
  return service.post('/messageCenter/getPersonalCenterMessage', params, {
    action: '获取消息中心',
  });
}
