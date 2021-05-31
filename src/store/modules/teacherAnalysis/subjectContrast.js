  import {
    subjectContrast,
    singleSubjectContrast
  } from '@/config/teacherAnalysis/teacherHome'

  const state = {
    headerTable: [],
    TableList: [],
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { SubjectScoreContrastInfo, ASAnalyseSettingInfo , ClassScoreInfo} = res.ResponseContent

      state.headerTable = ASAnalyseSettingInfo
      if (ClassScoreInfo != undefined) {
        state.TableList = ClassScoreInfo
      } else {
        state.TableList = SubjectScoreContrastInfo
      }

    },

    EMPTY_TABLE: (state) => { // 清空数据
      state.headerTable = []
      state.TableList = []
    },

  }

  const actions = {

    subjectContrast({ commit }, padata) { // 全科
      return new Promise((resolve, reject) => {
        const { tid, cid, url } = padata
        commit('EMPTY_TABLE')

        subjectContrast({ tid,cid, url }).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          return res
        }).catch(error => {
          reject(error)
        })
      })
    },

    singleSubjectContrast({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, topNum, url } = padata
        commit('EMPTY_TABLE')

        singleSubjectContrast({ tid, tsid, topNum, url }).then(res => {
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
