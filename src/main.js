import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import request from './utils/request'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.request = request

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')