  import {
    getProfileInfo
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ASAnalyseSettingInfo, ClassScoreInfo } = res.ResponseContent
      state.headerTable = ASAnalyseSettingInfo
      state.TableList = ClassScoreInfo
      state.tableLoading = false
    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.headerTable = []
      state.TableList = []
    },

  }

  const actions = {

    getProfileInfo({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, url } = padata
        commit('EMPTY_TABLE')

        getProfileInfo({ tid,tsid,cid, url }).then(res => {
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
