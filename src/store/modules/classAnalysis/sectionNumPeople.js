  import {
    GetStuResults
  } from '@/config/classAnalysis/sectionNumPeople'

  const state = {
    headerTable: [],
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      const { ClassScoreSegment, segments } = res.ResponseContent
      state.headerTable = segments
      state.TableList = ClassScoreSegment
      state.tableLoading =  false
    },

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, step, showGrade, url } = padata
        GetStuResults({ tid, tsid, step, showGrade, url}).then(res => {
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
