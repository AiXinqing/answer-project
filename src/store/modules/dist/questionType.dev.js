"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var state = {
  options: [{
    value: 1,
    label: '一'
  }, {
    value: 2,
    label: '二'
  }, {
    value: 3,
    label: '三'
  }, {
    value: 4,
    label: '四'
  }, {
    value: 5,
    label: '五'
  }, {
    value: 6,
    label: '六'
  }, {
    value: 7,
    label: '七'
  }, {
    value: 8,
    label: '八'
  }, {
    value: 9,
    label: '九'
  }, {
    value: 10,
    label: '十'
  }, {
    value: 11,
    label: '十一'
  }, {
    value: 12,
    label: '十二'
  }, {
    value: 13,
    label: '十三'
  }, {
    value: 14,
    label: '十四'
  }, {
    value: 15,
    label: '十五'
  }, {
    value: 16,
    label: '十六'
  }, {
    value: 17,
    label: '十七'
  }, {
    value: 18,
    label: '十八'
  }, {
    value: 19,
    label: '十九'
  }, {
    value: 20,
    label: '二十'
  }, {
    value: 21,
    label: '二十一'
  }, {
    value: 22,
    label: '二十二'
  }],
  SubtitleNumber: [],
  // 已有的题号数组
  AlreadyTopics: [],
  // 已有的题组
  currentQuestion: 1,
  letterArr: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K'],
  maxTopic: 200,
  // 最大题数
  determineTopic: [] // 确定下的小题

};
var mutations = {
  set_SubtitleNumber: function set_SubtitleNumber(state, _ref) {
    var start = _ref.start,
        end = _ref.end,
        id = _ref.id;
    // 追加生成的题号
    var index = state.SubtitleNumber.findIndex(function (item) {
      return item.id === id;
    });
    var Arr = [];

    for (var i = start; i <= end; i++) {
      Arr.push(i);
    }

    var obj = {
      id: id,
      data: Arr
    };

    if (index > -1) {
      state.SubtitleNumber.splice(index, 1, obj);
    } else {
      state.SubtitleNumber.push(obj);
    }
  },
  delete_SubtitleNumber: function delete_SubtitleNumber(state, id) {
    // 删除生成的题号
    var index = state.SubtitleNumber.findIndex(function (item) {
      return item.id === id;
    });

    if (index > -1) {
      state.SubtitleNumber.splice(index, 1);
    }
  },
  del_AlreadyTopics: function del_AlreadyTopics(state, Arr) {
    // 删除已有小题数组
    Arr.forEach(function (item) {
      var index = state.AlreadyTopics.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.AlreadyTopics.splice(index, 1);
      }
    });
  },
  Add_AlreadyTopics: function Add_AlreadyTopics(state, Arr) {
    //新增小题数组
    Arr.forEach(function (item) {
      if (state.AlreadyTopics.length > 0) {
        var index = state.AlreadyTopics.findIndex(function (row) {
          return row.topic === item.topic;
        });

        if (index > -1) {
          state.AlreadyTopics.splice(index, 1, item);
        } else {
          state.AlreadyTopics.push(item);
        }
      } else {
        state.AlreadyTopics.push(item);
      }
    });
  },
  once_AlreadyTopics: function once_AlreadyTopics(state, id) {
    // 一次清除
    state.AlreadyTopics = state.AlreadyTopics.filter(function (item) {
      return ![id].includes(item.id);
    });
  },
  Fullin_once_AlreadyTopics: function Fullin_once_AlreadyTopics(state, pid) {
    // 解答一次清除
    state.AlreadyTopics = state.AlreadyTopics.filter(function (item) {
      return ![pid].includes(item.pid);
    });
  },
  set_AlreadyTopics: function set_AlreadyTopics(state, Arr) {
    Arr.forEach(function (item) {
      var index = state.AlreadyTopics.findIndex(function (row) {
        return row.topic == item.topic;
      });

      if (index > -1) {
        state.AlreadyTopics.splice(index, 1, item);
      }
    });
  },
  Empty_AlreadyTopics: function Empty_AlreadyTopics(state) {
    // 清空数据
    state.AlreadyTopics = [];
  },
  set_currentQuestion: function set_currentQuestion(state) {
    var _loop = function _loop(i) {
      //
      var index = state.AlreadyTopics.findIndex(function (item) {
        return item.topic === i;
      });

      if (index <= -1) {
        state.currentQuestion = i;
        return "break";
      } else {
        state.currentQuestion = 1;
      }
    };

    for (var i = 1; i < state.maxTopic; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    }
  },
  set_closeFrame: function set_closeFrame(state) {
    // 弹窗关闭置空
    state.SubtitleNumber = [];
    state.AlreadyTopics.forEach(function (item, i) {
      if (item.subtopic != null || item.subtopic != undefined) {
        state.AlreadyTopics.splice(i, 1);
      }
    });
  },
  set_determineTopic: function set_determineTopic(state, Arr) {
    // 添加确定值
    Arr.forEach(function (item) {
      var index = state.determineTopic.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.determineTopic.splice(index, 1, item);
      } else {
        state.determineTopic.push(item);
      }
    });
  },
  del_determineTopic: function del_determineTopic(state, Arr) {
    Arr.forEach(function (item) {
      var index = state.determineTopic.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.determineTopic.splice(index, 1);
      }
    });
  }
};
var actions = {};
var getters = {};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
exports["default"] = _default;