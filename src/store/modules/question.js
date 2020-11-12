import { QUESTION_NUMBERS } from '@/models/base'

const state = {
  orderSort:0
}

const mutations = {
  set_orderSort: (state) => {
    state.orderSort = state.orderSort + 1
  },
  del_orderSort: (state, order) => {
    console.log(order)
    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.orderSort = state.orderSort - 1
  },
}

const actions = {

}

const getters = {
  options:()=>{
    return QUESTION_NUMBERS.map((label,value)=>({label,value}))
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}