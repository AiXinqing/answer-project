import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element-up.js'
import Element from 'element-ui'
import Components from './components/index'
import httpRequest from './utils/request'
import { post, fetch, patch, put, postForm } from './utils/http'
import { URL} from './config/api'
import { convertArray, convertArray_p } from './config/convertArray'
import lodash from 'lodash'

Vue.prototype.$http = httpRequest
Vue.prototype.$lodash = lodash
Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.prototype.$postForm = postForm
Vue.prototype.URL = URL
Vue.prototype.convertArray = convertArray
Vue.prototype.convertArray_p = convertArray_p

Vue.use(Components)
Vue.use(httpRequest)
Vue.use(Element, {
  size: 'medium'
})

// //路由守卫
// router.beforeEach((to, from, next) => {
//   if(from.name == "Login"){ // 如果不需要权限校验，直接进入路由界面
//     next();
//   }else if(to.meta.requireAuth){
//     // 判断该路由是否需要登录权限
//     if (store.state.Authorization) {  // 获取当前的token是否存在
//       console.log("token存在");
//       next();
//     } else {
//       console.log("token不存在");
//       next({
//         path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         query: {redirect: to.fullPath}
//       })
//     }
//   }else { // 如果不需要权限校验，直接进入路由界面
//     next();
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
