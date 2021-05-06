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
    component: Home,
    meta: {
        tilte:'阅卷系统-答题卡制作'
      }
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/answerCard/previewContent.vue'),
    meta: {
        tilte:'阅卷系统-答题卡预览'
      }
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
        meta: {
          tilte:'阅卷系统-分析'
        }
      },
      {
        path: '/classAnalysis',
        name: 'classAnalysis',
        component: classAnalysis,
        meta: {
          tilte:'阅卷系统-分析'
        }
      },
      {
        path: '/schoolAnalysis',
        name: 'schoolAnalysis',
        component: schoolAnalysis,
        meta: {
          tilte:'阅卷系统-分析'
        }
      },
      {
        path: '/jointExam',
        name: 'jointExam',
        component: jointExam,
        meta: {
          tilte:'阅卷系统-分析'
        }
      },
    ]
  }
]


const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.tilte) {
//     document.tilte = to.meta.tilte
//   }
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