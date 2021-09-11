import {
    GetASAnalyseLvlList
  } from '@/config/complexReport/getExam'
  
  const state = {
    LvlList: [],
    tsid: 'totalScore',
    tableLoading: false,
  }
  
  const mutations = {
   
    SET_LIST: (state, res) => {
      state.LvlList = res.ResponseContent
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

    GetASAnalyseLvlList ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, type, url } = padata
        GetASAnalyseLvlList({ tid, tsid, type, url }).then(res => {
          commit('SET_LIST', res)
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

  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
  