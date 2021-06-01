  import {
    getQuestionAnalysis
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
      state.tableLoading = false
    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.TableList = []
    },

  }

  const actions = {

    getQuestionAnalysis({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, url } = padata
        commit('EMPTY_TABLE')

        getQuestionAnalysis({ tid,tsid,cid, url }).then(res => {
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
