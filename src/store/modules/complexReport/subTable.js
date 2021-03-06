  import {
    GetStuResults,
    dynamicHeader
  } from '@/config/complexReport/getExam'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: false,
    pagination: {
      pageSize: 15,
      pageNum: 1,
      total: 0
    }
  }

  const mutations = {

    SET_HEADERTABLE: (state, res) => {
      const data = res.ResponseContent
      state.headerTable = data
    },

    SET_TABLE: (state, res) => {
      const { data } = res.ResponseContent
      state.TableList = data
      state.tableLoading = false

    },

    GET_PAGE: (state,page) => {
      state.pagination = page
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
        const { tid, tsid, cids, keyWords, pageIndex, pageSize, url } = padata
        GetStuResults({ tid, tsid, cids, keyWords, pageIndex, pageSize,url}).then(res => {
          commit('SET_TABLE', res)
          commit('GET_PAGE', {
            pageSize: res.ResponseContent.pageSize,
            pageNum: res.ResponseContent.pageIndex,
            total: res.ResponseContent.count
          })
          resolve(res)
          return res
        }).catch(error => {
          commit('SET_LOADING_FALSE')
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
