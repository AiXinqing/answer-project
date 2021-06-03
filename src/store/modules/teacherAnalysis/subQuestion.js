import {
    GetStuResultsHeade,
    getTranscript
} from '@/config/teacherAnalysis/teacherHome'

import {
  getExamList,
  getClassList
} from '@/config/teacherAnalysis/teacherHome'

  const state = {
    headerTable: [],
    TableList: [],
    examList: [],
    classList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
      state.tableLoading = false
    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.TableList = []
    },

    GET_PAGE: (state,page) => {
      state.pagination = page
    },

    SET_HEADERTABLE: (state, res) => {
      state.headerTable = res.ResponseContent
    },

    EMPTY_HEADERTABLE: (state) => { // 清空数据
      state.headerTable = []
    },

    SET_SUBJECT: (state, res) => {
      state.examList = res.ResponseContent
      state.tableLoading = false
    },

    EMPTY_SUBJECT: (state) => {
      // 清空
      state.examList = []
    },

    SET_CLASSLIST: (state, res) => {
      state.classList = res.ResponseContent
      state.tableLoading = false
    },

    EMPTY_CLASSLIST: (state) => {
      // 清空
      state.classList = []
    },

    SET_LOADING: (state) => {
      state.tableLoading = true
    },

    SET_LOADING_FALSE: (state) => {
      state.tableLoading = false
    }
  }

  const actions = {

    getTranscript ({ commit }, padata) { // 全科
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, keyWords, url } = padata
        commit('EMPTY_TABLE')

        getTranscript({ tid, tsid,cid,keyWords, url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          commit('SET_LOADING_FALSE')
          reject(error)
        })
      })
    },


    // 获取动态表头
    GetStuResultsHeade ({ commit }, padata) {
      commit('EMPTY_HEADERTABLE')

      return GetStuResultsHeade(padata).then((res) => {
        commit('SET_HEADERTABLE', res)
        return res
      })
    },

    getExamList ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { url } = padata
        commit('EMPTY_SUBJECT')

        getExamList({ url }).then(res => {
          commit('SET_SUBJECT', res)
          resolve(res)
          return res
        }).catch(error => {
          commit('SET_LOADING_FALSE')
          reject(error)
        })
      })
    },

    getClassList({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, url } = padata
        commit('EMPTY_CLASSLIST')

        getClassList({ tid, url}).then(res => {
          commit('SET_CLASSLIST', res)
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
  }

  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
