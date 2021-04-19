import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/answerCard/'
import axios from 'axios';
import { URL } from '../utils/config'

// 阅卷分析
import examHome from '@/views/exam/examContent/complexReport'
import classAnalysis from '@/views/exam/examContent/classAnalysis'
import schoolAnalysis from '@/views/exam/examContent/schoolAnalysis'
import jointExam from '@/views/exam/examContent/jointExamAnalysis'

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
      {
        path: '/classAnalysis',
        name: 'classAnalysis',
        component: classAnalysis,
      },
      {
        path: '/schoolAnalysis',
        name: 'schoolAnalysis',
        component: schoolAnalysis,
      },
      {
        path: '/jointExam',
        name: 'jointExam',
        component: jointExam,
      },
    ]
  }
]


const router = new VueRouter({
  routes
})

// router.beforeEach((to,from,next)=>{
//   const url = URL.SERVICE_CONTEXT_PATH + 'Api/Common/UsloginBLL/JudgeLogin'
//   axios.get(url).then((res) => {
//     if (res.data.ResponseCode == 'Success') {
//       next()
//     } else {
//       location.href = URL.SERVICE_CONTEXT_PATH + 'Manage/login'
//       next()
//     }
//   }).catch(function () {
//     location.href = URL.SERVICE_CONTEXT_PATH + 'Manage/login'
//     next()
//   })
// })
export default router