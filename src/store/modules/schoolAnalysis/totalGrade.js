  import {
    GetStuResults
  } from '@/config/schoolAnalysis/totalGrade'

  const state = {
    totalScoreheader:[],
    totalScoreTable: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ASAnalyseSettingInfo, ClassScoreInfo } = res.ResponseContent
      state.totalScoreheader = ASAnalyseSettingInfo
      state.totalScoreTable = ClassScoreInfo
      state.tableLoading =  false
    },

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid,showGrade, url } = padata
        GetStuResults({ tid, tsid,showGrade, url}).then(res => {
          commit('SET_TABLE', res)
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
