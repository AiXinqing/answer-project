import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/answerCard/'

// 阅卷分析
import examHome from '@/views/exam/examContent/'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/answerCard/previewContent.vue')
  },
  {
    // 阅卷
    path: '/exam',
    name: 'exam',
    component: () => import('@/views/exam'),
    children: [
      {
          path: '/',
          name: 'examHome',
          component: examHome,
      },
    ]
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