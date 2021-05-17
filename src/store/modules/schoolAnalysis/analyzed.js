  import {
    GetStuResults,
    getTotalScoreResults
  } from '@/config/schoolAnalysis/analyzed'

  const state = {
    headerTable: [],
    TableList: [],
    totalTable:[]
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { QuestionAnalyseList, classInfos } = res.ResponseContent
      state.headerTable = classInfos
      state.TableList =  QuestionAnalyseList
    },

    SET_TOTAL: (state, res) => {
      const { QuestionAnalyseList } = res.ResponseContent
      state.totalTable = QuestionAnalyseList
    }
  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, url } = padata
        GetStuResults({ tid, tsid, url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    getTotalScoreResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, url } = padata
        getTotalScoreResults({ tid, tsid, url}).then(res => {
          commit('SET_TOTAL', res)
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
