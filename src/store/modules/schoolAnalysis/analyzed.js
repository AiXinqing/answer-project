  import {
    GetStuResults,
    getTotalScoreResults
  } from '@/config/schoolAnalysis/analyzed'

  const state = {
    TableList: [],
    TotalTable:[]
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList =  res.ResponseContent
    },

    SET_TOTAL: (state, res) => {
      console.log(res.ResponseContent)
      state.TotalTable = [{...res.ResponseContent}]
    }
  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, url } = padata
        GetStuResults({ tid, url}).then(res => {
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
        const { tid, url } = padata
        getTotalScoreResults({ tid, url}).then(res => {
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
