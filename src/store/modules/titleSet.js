const state = {
  textVal: '',
  titleInfo: [{
      // 学生信息
      name: '考号',
      checked: true
    },
    {
      name: '学校',
      checked: false
    },
    {
      name: '姓名',
      checked: false
    },
    {
      name: '班级',
      checked: true
    },
    {
      name: '学号',
      checked: false
    }
  ],
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