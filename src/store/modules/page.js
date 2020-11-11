const state = {
  pageLayout: {
    size: 'A3',
    column:2
  },

  pageData: [],
}

const mutations = {
  //编辑页面布局
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
  },

  //新增页面数据
  pageData_add: (state, Arr) => {
    state.pageData.push(Arr)
  },

  // 编辑页面数据
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
  // 页面宽度
  page_width:(state) => {
    return state.pageLayout.column === 3 && state.pageLayout.size == 'A3'
        ? 480
        : 745
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}