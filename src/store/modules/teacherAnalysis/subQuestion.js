import {
    GetStuResultsHeade,
    getTranscript
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
      state.tableLoading = false
    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.TableList = []
    },

    GET_PAGE: (state,page) => {
      state.pagination = page
    },

    SET_HEADERTABLE: (state, res) => {
      state.headerTable = res.ResponseContent
    },

    EMPTY_HEADERTABLE: (state) => { // 清空数据
      state.headerTable = []
    },

    SET_LOADING: (state) => {
      state.tableLoading = true
    }
  }

  const actions = {

    getTranscript ({ commit }, padata) { // 全科
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, keyWords, url } = padata
        commit('EMPTY_TABLE')

        getTranscript({ tid, tsid,cid,keyWords, url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 获取动态表头
    GetStuResultsHeade ({ commit }, padata) {
      commit('EMPTY_HEADERTABLE')

      return GetStuResultsHeade(padata).then((res) => {
        commit('SET_HEADERTABLE', res)
        return res
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
