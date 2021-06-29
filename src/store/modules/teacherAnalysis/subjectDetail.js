import {
  getSubjectDetail
} from '@/config/teacherAnalysis/teacherHome'

import {
  dynamicHeader
} from '@/config/complexReport/classDetails'

const state = {
  headerTable: [],
  TableList: [],
  pagination: {
    pageSize: 15,
    pageNum: 1,
    total: 0
  },
  tableLoading: false,
}

const mutations = {

  SET_TABLE: (state, res) => {
    const { data } = res.ResponseContent
    state.TableList = data
    state.tableLoading = false
  },

  EMPTY_TABLE: (state) => { // 清空数据
    state.TableList = []
  },

  GET_PAGE: (state, page) => {
    state.pagination = page
  },

  SET_HEADERTABLE: (state, res) => {
    const data = res.ResponseContent
    state.headerTable = data
  },

  EMPTY_HEADERTABLE: (state) => { // 清空数据
    state.headerTable = []
  },

  SET_LOADING: (state) => {
    state.tableLoading = true
  },

  SET_LOADING_FALSE: (state) => {
    state.tableLoading = false
  }
}

const actions = {

  getSubjectDetail ({ commit }, padata) {
    commit('SET_LOADING')
    return new Promise((resolve, reject) => {
      const { tid, tsid, cid, asid, pageIndex, pageSize, url } = padata
      commit('EMPTY_TABLE')

      getSubjectDetail({ tid, tsid, cid, asid, pageIndex, pageSize, url }).then(res => {
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
    commit('EMPTY_HEADERTABLE')

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
