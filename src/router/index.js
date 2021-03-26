import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/preview',
    name: 'preview',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '@/views/previewContent.vue')
  },
  {
    // 阅卷
    path: '/exam',
    name: 'preview',
    component:() => import('@/views/exam/')
  }
]


const router = new VueRouter({
  routes
})

// router.beforeEach((to,from,next)=>{
//   let isLogin = window.sessionStorage.getItem('userInfo')
//   if (isLogin) {
//     next()
//   } else {
//     if (to.path === '/login') {
//       next()
//     } else {
//       next('/Home')
//     }
//   }
// })


export default router