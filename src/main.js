import Vue from 'vue';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-default/index.css';
import 'normalize.css/normalize.css';
import '@/assets/iconfont/iconfont';

import App from './App';
import router from './router';
import store from './store';
import IconSvg from '@/components/Icon-svg/index.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('icon-svg', IconSvg);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})