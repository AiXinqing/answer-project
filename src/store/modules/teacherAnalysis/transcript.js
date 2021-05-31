import {
    GetStuResultsHeade,
    getTranscript,
    getSingleTranscript
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    headerTable: [],
    TableList: [],
    singleTableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
    },

    EMPTY_TABLE: (state) => {
      state.TableList = []
    },

    SET_SINGLETABLE: (state, res) => {
      // 单科
      state.singleTableList = res.ResponseContent
    },

    EMPTY_SINGLETABLE: (state) => {
      state.singleTableList = []
    },

    GET_PAGE: (state,page) => {
      state.pagination = page
    },

    SET_HEADERTABLE: (state, res) => {
      state.headerTable = res.ResponseContent
    },
  }

  const actions = {

    getTranscript({ commit }, padata) { // 全科
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, keyWords, url } = padata
        commit('EMPTY_TABLE')// 清空

        getTranscript({ tid, tsid,cid,keyWords, url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    getSingleTranscript({ commit }, padata) { // 单科
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, keyWords, url } = padata
        commit('EMPTY_SINGLETABLE')// 清空

        getSingleTranscript({ tid, tsid,cid,keyWords, url}).then(res => {
          commit('SET_SINGLETABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取动态表头
    GetStuResultsHeade ({ commit }, padata) {
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
