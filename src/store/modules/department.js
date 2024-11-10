const state = {
  list: [
    {
      departmentId: '',
      departmentName: '',
      value: '',
      preparationHours: '',
    },
  ],
};

const mutations = {
  // 删除全部
  DEL_DEPARTMENT(state) {
    state.list = [
      {
        departmentId: '',
        departmentName: '',
        value: '',
        preparationHours: '',
      },
    ];
    const cacheData = localStorage.getItem('cacheData');
    if (cacheData && cacheData.length > 0) {
      localStorage.removeItem('cacheData');
    }
  },
  // 删除单个
  DEL_ONE(state, currentIndex) {
    const copyData = state.list.slice();
    copyData.splice(currentIndex, 1);
    // state.list = state.list.filter(item=>item.id==id)
  },
  // 添加
  SET_DEPARTMENT(state, payload) {
    state.list = [...payload];
    const cacheData = JSON.stringify(state.list);
    localStorage.setItem('cacheData', cacheData);
  },
};

const actions = {
  // 添加整个数据
  addData({ commit }, payload) {
    commit('SET_DEPARTMENT', payload);
  },
  // 确认删除全部
  removeAllData({ commit }) {
    commit('DEL_DEPARTMENT');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
