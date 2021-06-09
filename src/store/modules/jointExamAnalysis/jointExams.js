  import {
    getExamInfo,
    GetStuResults,
    dynamicHeader
  } from '@/config/jointExamAnalysis/jointExams'

  const state = {
    headerTable: [],
    schoolArr: [],
    TableList: [],
    tableLoading: false,
    pagination: {
      pageSize: 15,
      pageNum: 1,
      total: 0
    },
    examData:{}
  }

  const mutations = {
    SET_EXAMINFO: (state, res) => {
      const data = res.ResponseContent
      // 学校
      state.schoolArr = data.map(item => ({
        ...item,
        check: true,
        name: item.scname
      }))

    },

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

    // 设置loading
    SET_LOADING: (state) => {
      state.tableLoading = true
    },

    SET_LOADING_FALSE: (state) => {
      state.tableLoading = false
    }
  }

  const actions = {
    getExamInfo ({ commit }, padata) {
      return getExamInfo(padata).then((res) => {
        commit('SET_EXAMINFO', res)
        return res
      })
    },

    GetStuResults ({ commit }, padata) {
      commit('SET_LOADING')
      return new Promise((resolve, reject) => {
        const { tid, tsid, scids, keyWords, pageIndex, pageSize, url } = padata

        GetStuResults({ tid, tsid, scids, keyWords, pageIndex, pageSize, url }).then(res => {

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
    schoolExamInfo:(state) => {
      return [
        {
          subject:'学校',
          type:'multiple',
          stretch:true,
          subjectList:state.schoolArr
        }
      ]
    },
  }

  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
