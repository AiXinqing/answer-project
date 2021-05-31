  import {
    getSubjectJuxtapose
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    TableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList = res.ResponseContent
    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.TableList = []
    },

  }

  const actions = {

    getSubjectJuxtapose({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, cid, url } = padata
        commit('EMPTY_TABLE')

        getSubjectJuxtapose({ tid,tsid,cid, url }).then(res => {
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
