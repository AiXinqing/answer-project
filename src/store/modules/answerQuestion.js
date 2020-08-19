const state = {
  answerQuestionArr: []
}

const mutations = {
  set_answerQuestionArr: (state, obj) => {
    state.answerQuestionArr.push(obj)
  }
}

const actions = {

}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}