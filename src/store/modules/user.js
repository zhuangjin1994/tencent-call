import { login, getInfo } from '@/api/login';
import router, { resetRouter } from '@/router';
import { removeToken } from '@/utils/auth';

const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : '', // 认证凭证
  userName: '',
  roles: [],
  userId: '',
  departmentName: '',
  departmentId: '',
  readTag: false,
  loginTime: '',
};
const mutations = {
  DEL_TOKEN(state) {
    state.token = '';
    state.userName = '';
    state.roles = [];
    state.userId = '';
    state.departmentName = '';
    removeToken();
  },
  SET_ROLES(state, payload) {
    state.roles = payload;
  },
  SET_NAME(state, name) {
    state.userName = name;
  },
  SET_USERID(state, userId) {
    state.userId = userId;
  },
  SET_DEPARTMENT(state, payload) {
    state.departmentName = payload;
  },
  SET_DEPARTMENTID(state, payload) {
    state.departmentId = payload;
  },
  SET_READTAG(state, payload) {
    state.readTag = payload;
  },
  SET_LOGINTIME(state, time) {
    state.loginTime = time;
  },
};
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas).then(({ data }) => {
        resolve(data);
      })
        .catch((error) => {
          reject(error);
        });
    });
  },

  loginOut({ commit }) {
    const { domain } = document;
    commit('DEL_TOKEN');
    removeToken();
    resetRouter();
    window.open(`http://${domain}/_logout/?url=${domain}`, '_self');
  },

  _getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      // let mockData = {
      //   introduce: '区员情有头深技些府理米达水事道革听接眼口同会资打改法学南越与老被就门清变文红取办许。',
      //   name: 'admin',
      //   roles: ['suAdministrator']
      // }
      // const { name, roles, introduce } = mockData
      // commit('SET_NAME', name)
      // commit('SET_ROLES', roles) // 角色权限
      // // commit('SET_INTRODUCE', introduce)
      // resolve(mockData)
      // return
      getInfo().then((res) => {
        const { userEnName, roleId, departmentName, userId, departmentId } = res.data;
        const roles = roleId.split(',');
        res.data.roles = roles;
        commit('SET_NAME', userEnName);
        commit('SET_USERID', userId);
        commit('SET_ROLES', roles); // 角色权限
        commit('SET_DEPARTMENT', departmentName); // 默认部门
        commit('SET_DEPARTMENTID', departmentId); // 默认部门id
        const readTag = window.localStorage.getItem('readTag');
        if (readTag) {
          commit('SET_READTAG', false);
        } else {
          commit('SET_READTAG', true);
        }
        commit('SET_LOGINTIME', _getNowDate());
        resolve(res.data);
      })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};


const _getNowDate = () => {
  const date = new Date(new Date() - 1000000);
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  if (date.getHours() > 0 && date.getHours() < 10) {
    const hours = '';
  }
  const currentdate = `${date.getFullYear()}-${month}-${strDate} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`;
  // localStorage.setItem('loginDate', currentdate)
  return currentdate;
};
