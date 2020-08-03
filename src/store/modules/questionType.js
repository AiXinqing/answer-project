const state = {
  options: [{
      value: 1,
      label: '一',
    },
    {
      value: 2,
      label: '二',
    },
    {
      value: 3,
      label: '三',
    },
    {
      value: 4,
      label: '四',
    },
    {
      value: 5,
      label: '五',
    },
    {
      value: 6,
      label: '六',
    },
    {
      value: 7,
      label: '七',
    },
    {
      value: 8,
      label: '八',
    },
    {
      value: 9,
      label: '九',
    },
    {
      value: 10,
      label: '十',
    },
    {
      value: 11,
      label: '十一',
    },
    {
      value: 12,
      label: '十二',
    },
    {
      value: 13,
      label: '十三',
    },
    {
      value: 14,
      label: '十四',
    },
    {
      value: 15,
      label: '十五',
    },
    {
      value: 16,
      label: '十六',
    },
    {
      value: 17,
      label: '十七',
    },
    {
      value: 18,
      label: '十八',
    },
    {
      value: 19,
      label: '十九',
    },
    {
      value: 20,
      label: '二十',
    },
    {
      value: 21,
      label: '二十一',
    },
    {
      value: 22,
      label: '二十二',
    },
  ],
  startQuestion: 1, // 分段题组开始题号
  endQuestion: null, // 分段题组结束题号
  delStartQuestion: null, // 分段题组开始题号-已删除
  endStartQuestion: null, // 分段题组结束题号-已删除
}

const mutations = {
  set_startQuestion: (state, val) => {
    // 开始题号
    state.startQuestion = val
  },
  set_endQuestion: (state, val) => {
    // 结束题号
    state.endQuestion = val
  },
}

const actions = {}

const getters = {
  currentQuestion(state) { // 分段题组
    let start = state.startQuestion
    let end = state.endQuestion
    let delStart = state.delStartQuestion
    return end == null ? start :
      delStart != null && delStart > start ? start :
      delStart != null && delStart < start ? delStart : 1

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}