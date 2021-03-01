import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element-up.js'
import Element from 'element-ui'
import Components from './components/index'
import htmlToPdf from './utils/htmlToPdf'
// 使用Vue.use()方法就会调用工具方法中的install方法
Vue.use(htmlToPdf)


import lodash from 'lodash'
Vue.prototype.$lodash = lodash

Vue.config.productionTip = false
Vue.use(Components)


Vue.use(Element, {
  size: 'medium'
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')