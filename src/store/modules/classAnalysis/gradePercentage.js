  import {
    GetStuResults
  } from '@/config/classAnalysis/gradePercentage'

  const state = {
    headerTable: [],
    TableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ASAnalyseSettingInfo, ClassScoreInfo } = res.ResponseContent
      state.headerTable = ASAnalyseSettingInfo
      state.TableList =  ClassScoreInfo
    },

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, url } = padata
        GetStuResults({ tid, tsid, url}).then(res => {
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
