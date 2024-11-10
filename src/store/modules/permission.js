import { asyncRoutes, currencyRoutes } from '@/router';

const state = {
  routes: [],
  addRoutes: [],
};
const mutations = {
  SET_ROUTES(state, payload) {
    state.routes = [...currencyRoutes, ...payload];
    state.addRoutes = payload;
  },
};

/**
 * 当前角色是否有该路由权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return true;
}

/**
 * 递归获取动态路由表信息
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

const actions = {
  getAsyncRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      const routes = filterAsyncRoutes(asyncRoutes, roles);
      commit('SET_ROUTES', routes);
      resolve(routes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
