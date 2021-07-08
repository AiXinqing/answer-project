  import {
    GetAnswerStaticAnalysis
  } from '@/config/complexReport/getExam'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { answerAnalysis, options } = res.ResponseContent
      state.headerTable = options
      state.TableList =  answerAnalysis
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
        const { tid,tsid,cids,type, url } = padata
        GetAnswerStaticAnalysis({ tid,tsid,cids,type,url}).then(res => {
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
