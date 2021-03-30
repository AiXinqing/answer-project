import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element-up.js'
import { Element,Message }from 'element-ui'
import Components from './components/index'
import httpRequest from './utils/request'
import {post, fetch, patch, put, postForm} from './utils/http'
import lodash from 'lodash'

Vue.prototype.$http = httpRequest
Vue.prototype.$lodash = lodash
Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.prototype.$postForm = postForm
Vue.prototype.$message = Message


Vue.use(Components)
Vue.use(httpRequest)
Vue.use(Element, {
  size: 'medium'
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')