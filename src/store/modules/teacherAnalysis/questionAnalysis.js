  import {
    getQuestionAnalysis
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    TableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
    },

  }

  const actions = {

    getQuestionAnalysis({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid,tsid,cid, url } = padata
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