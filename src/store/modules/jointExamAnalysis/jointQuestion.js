  import {
    GetStuResults
  } from '@/config/jointExamAnalysis/jointQuestion'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { QuestionAnalyseList,classInfos } = res.ResponseContent
      state.TableList = QuestionAnalyseList
      state.headerTable = classInfos
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
        const { tid, tsid, scids, url } = padata

        GetStuResults({ tid, tsid, scids, url }).then(res => {

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
