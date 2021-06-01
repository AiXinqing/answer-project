  import {
    getExamList,
    getClassList
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    examList: [],
    classList: [],
    tableLoading: false,
  }

  const mutations = {

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
    }
  }

  const actions = {

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
