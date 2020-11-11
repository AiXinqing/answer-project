const state = {
  pageLayout: {
    size: 'A3',
    column:2
  },

  pageData: [],
}

const mutations = {
  //新增
  pageData_add: (state, Arr) => {
    state.pageData.push(Arr)
  },

  // 编辑
  pageData_edit: (state, question) => {
    const index = state.pageData.findIndex((itme) => itme.id === question.id)
    if (index > -1) {
      if (question.changeOrder) { // 非作答题
        state.pageData.splice(index, 1)
        state.pageData.splice(question.changeOrder, 0, question)
      } else {
        state.pageData.splice(index, 1, question)
      }
    }
  },
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