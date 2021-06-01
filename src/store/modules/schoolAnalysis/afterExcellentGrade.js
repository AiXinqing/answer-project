  import {
    GetStuResults
  } from '@/config/schoolAnalysis/excellentGrade'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const {subjectInfos,ClassScoreSurveyList} =  res.ResponseContent
      state.TableList =  ClassScoreSurveyList
      state.headerTable =  subjectInfos
      state.tableLoading =  false
    },

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid,type,rank, url } = padata
        GetStuResults({ tid,type,rank, url}).then(res => {
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
