  import {
    getSubject,
    getClassList
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    subject: [],
    classList:[]
  }

  const mutations = {

    SET_SUBJECT: (state, res) => {
      state.subject =  res.ResponseContent
    },

    SET_CLASSLIST: (state, res) => {
      state.classList =  res.ResponseContent
    },
  }

  const actions = {

    getSubject({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { url } = padata
        getSubject({ url }).then(res => {
          commit('SET_SUBJECT', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    getClassList({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, url } = padata
        getClassList({ tid, url}).then(res => {
          commit('SET_CLASSLIST', res)
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
