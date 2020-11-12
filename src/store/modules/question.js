import { QUESTION_NUMBERS } from '@/models/base'

const state = {

}

const mutations = {

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