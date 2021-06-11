  import {
    GetSchoolGradesStatisticsResults
  } from '@/config/jointExamAnalysis/gradesCompared'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { SchoolScoreSegment,segments } = res.ResponseContent
      state.TableList = SchoolScoreSegment
      state.headerTable = segments
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
        const { tid, tsid, step, type, url } = padata

        GetSchoolGradesStatisticsResults({ tid, tsid, step, type, url }).then(res => {

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
