import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element-up.js'
import Element from 'element-ui'
import Components from './components/index'
import axios from 'axios'
import VueAxios from 'vue-axios'

import lodash from 'lodash'
Vue.prototype.$lodash = lodash

Vue.config.productionTip = false
Vue.use(Components)
Vue.use(VueAxios, axios)

Vue.use(Element, {
  size: 'medium'
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')