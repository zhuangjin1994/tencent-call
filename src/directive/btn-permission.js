import Vue from 'vue';
import store from '@/store';

/**
 * auth指令 v-auth="Array"
 * 调用实例： <span v-auth="['admin1', 'admin2']"></span>
 */
export default () => {
  Vue.directive('auth', {
    inserted(el, binding) {
      const { roles } = store.getters;
      const { value } = binding;
      const hasPermission = value.some(item => item.includes(roles));
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    },
  });
};
