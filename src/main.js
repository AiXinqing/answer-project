import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element-up.js'
import Element from 'element-ui'
import Components from './components/index'



// //样式
// import './components/tinymce/skins/ui/oxide/skin.min.css'
// import './components/tinymce/skins/ui/oxide/content.min.css'
// import './components/tinymce/skins/ui/oxide/content.inline.min.css'



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