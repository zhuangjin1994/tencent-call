/*
set sidebar open or close,and some app setting
 */
import { getMsgData } from '@/api/login.js';
const state = {
  opened: sessionStorage.getItem('open')
    ? sessionStorage.getItem('open')
    : 'false',
  msgIsShow: false,
  messages: {},
  menuCount: {
    auditCount: 0,
    draftCount: 0,
    resourceCount: 0,
    resourceInnerCount: 0,
    supplierCount: 0,
  },
};
const mutations = {
  SET_OPENED(state, payload) {
    state.opened = String(payload);
    sessionStorage.setItem('open', payload);
  },
  SET_MSGISOPEN(state) {
    state.msgIsShow = !state.msgIsShow;
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  SET_MENUCOUNT(state, data) {
    state.menuCount = data;
  },

};
const actions = {
  getMessages({ commit }) {
    return new Promise((resolve, reject) => {
      getMsgData().then(({ data }) => {
        commit('SET_MESSAGES', data);
        resolve(data);
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
