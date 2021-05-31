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

// 教师分析
import teacherHome from '@/views/teacherAnalysis/analysisContent/teacherHome'
import testAnalysis from '@/views/teacherAnalysis/analysisContent/testAnalysis'
import subtopicScore from '@/views/teacherAnalysis/analysisContent/subtopicScore'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
        title:'智汇e校园-答题卡制作'
      }
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/answerCard/previewContent.vue'),
    meta: {
        title:'智汇e校园-答题卡预览'
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
          title:'智汇e校园-阅卷分析'
        }
      },
      {
        path: '/classAnalysis',
        name: 'classAnalysis',
        component: classAnalysis,
        meta: {
          title:'智汇e校园-阅卷分析'
        }
      },
      {
        path: '/schoolAnalysis',
        name: 'schoolAnalysis',
        component: schoolAnalysis,
        meta: {
          title:'智汇e校园-阅卷分析'
        }
      },
      {
        path: '/jointExam',
        name: 'jointExam',
        component: jointExam,
        meta: {
          title:'智汇e校园-阅卷分析'
        }
      },
    ]
  },
  {
    // 教师分析
    path: '/teacherHome',
    name: 'teacherHome',
    component: () => import('@/views/teacherAnalysis'),
    children: [
      {
        path: '/',
        name: 'teacherHome',
        component: teacherHome,
        meta: {
          title:'智汇e校园-教师分析'
        }
      },
      {
        path: '/testAnalysis',
        name: 'testAnalysis',
        component: testAnalysis,
        meta: {
          title:'智汇e校园-阅卷分析'
        }
      },
      {
        path: '/subtopicScore',
        name: 'subtopicScore',
        component: subtopicScore,
        meta: {
          title:'智汇e校园-阅卷分析'
        }
      }
    ]
  }
]


const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.tilte) {
//     window.document.title = to.meta.title
//   }
//   //next()
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