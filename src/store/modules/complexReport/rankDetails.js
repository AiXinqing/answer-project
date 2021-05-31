  import {
    GetStuResults,
    dynamicHeader
  } from '@/config/complexReport/rankDetails'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: true,
    pagination: {
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { data } = res.ResponseContent
      state.TableList = data
      state.tableLoading = false
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

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const {tid, tsid, cid, rankName, type, pageIndex, pageSize, url } = padata
        GetStuResults({ tid, tsid, cid, rankName, type, pageIndex, pageSize, url}).then(res => {
          commit('SET_TABLE', res)
          commit('GET_PAGE', {
            pageSize: res.ResponseContent.pageSize,
            pageNum: res.ResponseContent.pageIndex,
            total: res.ResponseContent.count
          })
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
