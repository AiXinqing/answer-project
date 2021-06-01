  import {
    GetStuResults
  } from '@/config/classAnalysis/getClassAvgScore'

  const state = {
    TableList: [],
    tableLoading: true,
  }

  const mutations = {

    SET_TABLE: (state, res) => {
      state.TableList =  res.ResponseContent
      state.tableLoading =  false
    }

  }

  const actions = {

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, url } = padata
        GetStuResults({ tid, tsid, url}).then(res => {
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
    echartsData:(state) => {
      return  state.TableList.length ? state.TableList.filter(item => item.cid !='all') : []
    },
  }

  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
