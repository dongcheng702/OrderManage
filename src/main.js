import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import request from './utils/request';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.request = request;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
