const state = {
  // questionNumber: ['一','二','三','四','五','六','七','八',
  // '九','十','十一','十二','十三','十四','十五','十六','十七',
  // '十八','十九','二十','二十一','二十二','二十三','二十四'],

  // questionNumber_big_exist: [], // 存在大题
  subTopic_number: 1,
  subTopic_number_already: [], // 已有的题组
  subTopic_number_determine: [], // 确定下的小题

  largest_questionNum: 200, // 最大题数
}

const mutations = {
  subTopic_already_del(state, Arr) {
    // 删除已有小题数组
    Arr.forEach((item) => {
      state.subTopic_number_already = state.subTopic_number_already.filter(question => question.topic != item.topic)
    })
  },

  subTopic_already_add(state, Arr) {
    //新增小题数组
    Arr.forEach((item) => {
      const index = state.subTopic_number_already.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.subTopic_number_already.splice(index, 1, item)
      } else {
        state.subTopic_number_already.push(item)
      }

    })
  },

  subTopic_already_clean: (state, id) => {
    // 一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  subTopic_already_pid_clean: (state, pid) => {
    // 解答一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  already_pid_clean:(state, pid) => {
    state.subTopic_number_already = state.subTopic_number_already.filter((item) => item.pid == pid)
  },

  subTopic_number_calculate_already: (state, Arr) => {
    Arr.forEach((newTopic) => {
      state.subTopic_number_already = state.subTopic_number_already.map(subTopic => {
        return subTopic.topic == newTopic.topic ? newTopic : subTopic
      })
    })
  },

  subTopic_already_reset: (state) => {
    // 重置
    state.subTopic_number_already = []
  },

  subTopic_number_calculate: (state) => {
    // 计算小题题号
    for (let i = 1; i < state.largest_questionNum; i++) {
      //
      const index = state.subTopic_number_already.findIndex((item) => item.topic === i)
      if (index <= -1) {
        state.subTopic_number = i
        break
      } else {
        state.subTopic_number = 1
      }
    }
  },

  subTopic_calculate_determine: (state, Arr) => {
    // 添加确定值
    Arr.forEach((item) => {
      const index = state.subTopic_number_determine.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.subTopic_number_determine.splice(index, 1, item)
      } else {
        state.subTopic_number_determine.push(item)
      }
    })
  },

  subTopic_determine_pid_clean: (state, pid) => {
    // 清除相同pid
    state.subTopic_number_determine = state.subTopic_number_determine.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  subTopic_determine_clean: (state, topic) => {
    // 清除相同pid
    state.subTopic_number_determine = state.subTopic_number_determine.filter((item) => {
      return ![topic].includes(item.topic)
    })
  },

  subTopic_determine_del: (state, Arr) => {
    Arr.forEach((newTopic) => {
      state.subTopic_number_determine = state.subTopic_number_determine.map(subTopic => {
        return subTopic.topic == newTopic.topic ? newTopic : subTopic
      })
    })
  },
  // 编辑存在大题
  // questionNumber_big_exist_edit: (state, obj) => {
  //   const index = state.questionNumber_big_exist.findIndex(
  //     (row) => row.id === obj.id
  //   )
  //   if (index > -1) {
  //     state.subTopic_number_determine.splice(index, 1, obj)
  //   } else {
  //     state.questionNumber_big_exist.push(obj)
  //   }
  // },

  // questionNumber_big_exist_insert: (state, {
  //   obj,
  //   num,
  //   order,
  //   SelfOrder
  // }) => {
  //   state.questionNumber_big_exist.map(function (item) {
  //     return {
  //       ...item,
  //       order: item.order >= order ? item.order + 1 : item.order,
  //     }
  //   });
  //   setTimeout(function () {
  //     state.questionNumber_big_exist.splice(num, 0, obj);
  //     state.questionNumber_big_exist = state.questionNumber_big_exist.sort(function (a, b) {
  //       return a.order - b.order;
  //     });
  //     if (SelfOrder) {
  //       state.questionNumber_big_exist.forEach((item, index) => {
  //         state.questionNumber_big_exist.splice(index, 1, {
  //           ...item,
  //           label: state.options[index].label + '.' + item.label.split('.')[1]
  //         })
  //       })
  //     }
  //   }, 50);
  // },

  // questionNumber_big_exist_del: (state, obj) => {
  //   let id = obj.objId != undefined ? obj.objId : obj.id
  //   const index = state.questionNumber_big_exist.findIndex(
  //     (row) => row.id === id
  //   )
  //   if (index > -1) {
  //     state.questionNumber_big_exist.splice(index, 1)
  //   }
  // },

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