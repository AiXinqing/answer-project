import {
  GetStuResults,
  getUpperGearLine
} from '@/config/schoolAnalysis/binningAnalysis'

const state = {
  headerTable: [],
  TableList: [],
  binningData: [],
  parameterInfo: {},
  tableLoading: false,
}

const mutations = {

  SET_TABLE: (state, res) => {
    const { ClassScoreLineInfo, ScoreLineInfo, fullScore, lineScale, maxScore } = res.ResponseContent
    state.TableList = ClassScoreLineInfo
    state.headerTable = ScoreLineInfo
    state.parameterInfo = {
      fullScore: fullScore,
      lineScale: lineScale,
      maxScore: maxScore
    }
    state.tableLoading = false
  },

  SET_BINNING: (state, res) => {
    state.binningData = res.ResponseContent
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
      const { tid, url } = padata
      GetStuResults({ tid, url }).then(res => {
        commit('SET_TABLE', res)
        resolve(res)
        return res
      }).catch(error => {
        commit('SET_LOADING_FALSE')
        reject(error)
      })
    })
  },

  getUpperGearLine ({ commit }, padata) {
    commit('SET_LOADING')
    return new Promise((resolve, reject) => {
      const { tid, url } = padata
      getUpperGearLine({ tid, url }).then(res => {
        commit('SET_BINNING', res)
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
