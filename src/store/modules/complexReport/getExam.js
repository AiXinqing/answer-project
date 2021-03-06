import {
  getExamInfo,
  GetStuResults,
  dynamicHeader,
  getIsShowJointExam
} from '@/config/complexReport/getExam'

const state = {
  headerTable: [],
  tsid: 'totalScore',
  subjectsArr: [],
  classesArr: [],
  TableList: [],
  tableLoading: false,
  pagination: {
    pageSize: 15,
    pageNum: 1,
    total: 0
  },
  examData: {}
}

const mutations = {
  SET_EXAMINFO: (state, res) => {
    const data = res.ResponseContent
    // 科目
    state.subjectsArr = data.subjects.map(item => ({
      ...item,
      check: item.sid == 'totalScore' ? true : false,
      name: item.sname
    }))
    // 班级
    state.classesArr = data.classes.map(item => ({
      ...item,
      check: true,
      name: item.cname
    }))
    //考试信息
    state.examData = data
  },

  Reset_classesArr: (state) => {
    // 重置班级数组
    state.classesArr = state.classesArr.map(item => ({
      ...item,
      check: true,
      name: item.cname
    }))
  },

  SET_HEADERTABLE: (state, res) => {
    const data = res.ResponseContent
    state.headerTable = data
  },

  SET_TABLE: (state, res) => {
    const { data } = res.ResponseContent
    state.TableList = data
    state.tableLoading = false
  },

  GET_PAGE: (state, page) => {
    state.pagination = page
  },

  // 设置loading
  SET_LOADING: (state) => {
    state.tableLoading = true
  },

  SET_LOADING_FALSE: (state) => {
    state.tableLoading = false
  }
}

const actions = {
  getExamInfo ({ commit }, padata) {
    return getExamInfo(padata).then((res) => {
      commit('SET_EXAMINFO', res)
      return res
    })
  },

  GetStuResults ({ commit }, padata) {
    commit('SET_LOADING')
    return new Promise((resolve, reject) => {
      const { tid, tsid, cids, keyWords, pageIndex, pageSize, url } = padata

      GetStuResults({ tid, tsid, cids, keyWords, pageIndex, pageSize, url }).then(res => {

        commit('SET_TABLE', res)
        commit('GET_PAGE', {
          pageSize: res.ResponseContent.pageSize,
          pageNum: res.ResponseContent.pageIndex,
          total: res.ResponseContent.count
        })
        resolve(res)
        return res
      }).catch(error => {
        commit('SET_LOADING_FALSE')
        reject(error)
      })
    })
  },

  // 获取动态表头
  dynamicHeader ({ commit }, padata) {
    return dynamicHeader(padata).then((res) => {
      commit('SET_HEADERTABLE', res)
      return res
    })
  },

  getIsShowJointExam ({ commit }, padata) {
    commit('SET_LOADING')
    return new Promise((resolve, reject) => {
      const { tid, url } = padata
      getIsShowJointExam({ tid, url }).then(res => {
        resolve(res)
        return res
      }).catch(error => {
        commit('SET_LOADING_FALSE')
        reject(error)
      })
    })
  },
}

const getters = {
  // 页面宽度
  examInfo: (state) => {
    return [
      {
        subject: '科目',
        type: 'single',
        stretch: true,
        subjectList: state.subjectsArr
      },
      {
        subject: '班级',
        type: 'multiple',
        stretch: true,
        subjectList: state.classesArr
      }
    ]
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
