  import {
    GetStuResults
  } from '@/config/complexReport/ranking'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ClassScoreSegment, segments } = res.ResponseContent
      state.headerTable = segments
      state.TableList =  ClassScoreSegment
      state.tableLoading =  false
    },

    SET_LOADING: (state) => {
      state.tableLoading = true
    }
  }

  const actions = {

    GetStuResults ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, cids,step,type,placing, url } = padata
        GetStuResults({ tid, tsid, cids,step,type,placing,url}).then(res => {
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
