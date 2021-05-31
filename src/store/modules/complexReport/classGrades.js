  import {
    GetStuResults
  } from '@/config/complexReport/classGrades'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ASAnalyseSettingInfo,ClassScoreInfo } = res.ResponseContent
      state.headerTable = ASAnalyseSettingInfo
      state.TableList = ClassScoreInfo
      state.tableLoading = false
    },

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, cids, url } = padata
        GetStuResults({ tid, tsid, cids,url}).then(res => {
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
