  import {
    GetSchoolGradesComparedResults
  } from '@/config/jointExamAnalysis/gradesCompared'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { SchoolScoreInfo,ASAnalyseSettingInfo } = res.ResponseContent
      state.TableList = SchoolScoreInfo
      state.headerTable = ASAnalyseSettingInfo
      state.tableLoading = false
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
    GetStuResults ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, url } = padata

        GetSchoolGradesComparedResults({ tid, tsid, url }).then(res => {

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

  const getters = {}

  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
