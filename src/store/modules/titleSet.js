const state = {
  textVal: '',
  titleRows: 8
}

const mutations = {
  editTitleInfo: (state, obj) => {
    state.titleInfo = obj
  },
  editTitleRows: (state, val) => {
    state.titleRows = val
  },
  editTextarea: (state, val) => {
    state.textVal = val
  }
}

const actions = {

}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}