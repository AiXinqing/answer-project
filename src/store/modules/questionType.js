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
  minTopic: 1, // 删除最小值
  SubtitleNumber: [], // 已有的题号数组
  delTopics: [], // 删除的题组
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
  set_minTopic: (state, val) => {
    state.minTopic = val
  },
  set_SubtitleNumber: (state, {
    start,
    end,
    id
  }) => {
    let index = state.SubtitleNumber.findIndex(item => item.id === id)
    let Arr = []
    for (let i = start; i <= end; i++) {
      Arr.push(i)
    }

    let obj = {
      id: id,
      data: Arr
    }
    if (index > -1) {
      state.SubtitleNumber.splice(index, 1, obj)
    } else {
      state.SubtitleNumber.push(obj)
    }
  },
  delete_SubtitleNumber: (state, id) => {
    // 追加生成的题号
    let index = state.SubtitleNumber.findIndex(item => item.id === id)
    if (index > -1) {
      state.SubtitleNumber.splice(index, 1)
    }
  },
  set_delTopics: (state, {
    start,
    end,
  }) => {
    for (let i = start; i <= end; i++) {
      let index = state.delTopics.findIndex(item => item === i)
      if (index <= -1) {
        state.delTopics.push(i)
      }
    }
  }
}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}