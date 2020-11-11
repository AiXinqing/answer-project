const state = {
  GroupDataArr: [],
}

const mutations = {
  SET_GROUPDATA: (state, list) => {
    state.GroupDataArr.push(list)
  },
  REMOVERECT: (state, rectId) => {
    const index = state.GroupDataArr.findIndex((rect) => rect.id === rectId)
    if (index > -1) {
      state.GroupDataArr.splice(index, 1)
    }
  },
  SET_LAYOUT: (state, layoutVal) => {
    state.pageLayout = layoutVal
  },
  amendGroupPage: (state, newRect) => {
    const index = state.GroupDataArr.findIndex((itme) => itme.id === newRect.id)
    state.GroupDataArr[index] = newRect
  },
}

const actions = {
  delRectt: (context, rectId) => {
    // 删除
    context.commit('REMOVERECT', rectId)
  },
  editLayout: (context, layoutVal) => {
    context.commit('SET_LAYOUT', layoutVal)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}