  import {
    GetStuResults
  } from '@/config/schoolAnalysis/criticalBirth'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const {subjectInfos,ClassScoreSurveyList} =  res.ResponseContent
      state.TableList =  ClassScoreSurveyList
      state.headerTable = subjectInfos
      state.tableLoading =  false
    },

    SET_LOADING: (state) => {
      state.tableLoading = true
    },

    SET_LOADING_FALSE: (state) => {
      state.tableLoading = false
    }

  }

  const actions = {

    GetStuResults ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid,criticalScale,floatScale, url } = padata
        GetStuResults({ tid,criticalScale,floatScale, url}).then(res => {
          commit('SET_TABLE', res)
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
