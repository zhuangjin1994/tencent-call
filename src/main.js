import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from './store';
import '@/style/index.scss'; // glob scss
import './plugins/element.js';
import './style/element-variables.scss';
import Echarts from 'echarts';
import animated from 'animate.css';
import '@/assets/iconfont/iconfont.css';
import auth from '@/directive/btn-permission.js';
import { Loading } from 'element-ui';
import moment from 'moment';
import filters from '@/utils/filters.js'; // 全局过滤器
import './icons'; // icon

import tinymce from 'tinymce'; // tinymce
import VueTinymce from '@packy-tang/vue-tinymce';

Vue.prototype.$tinymce = tinymce;
Vue.use(VueTinymce);

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
// dialog弹出框点击外部不关闭
Vue.prototype.$dialog.props.closeOnClickModal.default = false;

Vue.use(animated);
Vue.use(auth);
Vue.use(Loading.directive);

// Vue.use(SlideVerify)
Vue.config.productionTip = false;
Vue.prototype.$echarts = Echarts;

// 注册全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.prototype.moment = moment;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
