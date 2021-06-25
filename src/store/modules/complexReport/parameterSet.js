import {
  GetStuResults
} from '@/config/complexReport/parameterSet'

const state = {
  TableList: [],
  tableLoading: false,
}

const mutations = {

  SET_TABLE: (state, res) => {
    state.TableList = res.ResponseContent
    state.tableLoading = false
  },

  SET_LOADING: (state) => {
    state.tableLoading = true
  },
  SET_LOADING_FALSE: (state) => {
    state.tableLoading = false
  }

}

const actions = {

  GetStuResults ({ commit }, padata) {
    commit('SET_LOADING')
    return new Promise((resolve, reject) => {
      const { tid, tsid, type, url } = padata
      GetStuResults({ tid, tsid, type, url }).then(res => {
        commit('SET_TABLE', res)

        resolve(res)
        return res
      }).catch(error => {
        commit('SET_LOADING_FALSE')
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
