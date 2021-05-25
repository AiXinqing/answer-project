  import {
    getTranscript,
    getSingleTranscript
  } from '@/config/teacherAnalysis/teacherHome'

  import {
    dynamicHeader
  } from '@/config/complexReport/classDetails'

  const state = {
    headerTable: [],
    TableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      // const { data } = res.ResponseContent
      state.TableList = res.ResponseContent
    },

    GET_PAGE: (state,page) => {
      state.pagination = page
    },

    SET_HEADERTABLE: (state, res) => {
      const data = res.ResponseContent
      state.headerTable = data
    },
  }

  const actions = {

    getTranscript({ commit }, padata) { // 全科
      return new Promise((resolve, reject) => {
        const { tid, tsid,cid,keyWords, url } = padata
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
        const { tid, tsid,cid,keyWords, url } = padata
        getSingleTranscript({ tid, tsid,cid,keyWords, url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取动态表头
    dynamicHeader ({ commit }, padata) {
      return dynamicHeader(padata).then((res) => {
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
