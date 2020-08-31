"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  AlreadyTopics: [],
  // 已有的题组
  currentQuestion: 1,
  letterArr: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K'],
  maxTopic: 200,
  // 最大题数
  determineTopic: [],
  // 确定下的小题
  existBigQuestion: [] // 存在大题

};
var mutations = {
  del_AlreadyTopics: function del_AlreadyTopics(state, Arr) {
    if (Arr == undefined) {
      return false;
    } // 删除已有小题数组


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
    if (Arr == undefined) {
      return false;
    } //新增小题数组


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
    if (Arr == undefined) {
      return false;
    }

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
  set_determineTopic: function set_determineTopic(state, Arr) {
    if (Arr == undefined) {
      return false;
    } // 添加确定值


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
  delOnce_determineTopic: function delOnce_determineTopic(state, pid) {
    // 一次清除相同pid
    state.determineTopic = state.determineTopic.filter(function (item) {
      return ![pid].includes(item.pid);
    });
  },
  del_determineTopic: function del_determineTopic(state, Arr) {
    if (Arr == undefined) {
      return false;
    }

    Arr.forEach(function (item) {
      var index = state.determineTopic.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.determineTopic.splice(index, 1);
      }
    });
  },
  // 存在大题
  set_existBigQuestion: function set_existBigQuestion(state, obj) {
    var index = state.existBigQuestion.findIndex(function (row) {
      return row.id === obj.id;
    });

    if (index > -1) {
      state.determineTopic.splice(index, 1, obj);
    } else {
      state.existBigQuestion.push(obj);
    }
  },
  insert_existBigQuestion: function insert_existBigQuestion(state, _ref) {
    var obj = _ref.obj,
        num = _ref.num,
        order = _ref.order;
    state.existBigQuestion.map(function (item) {
      return _objectSpread({}, item, {
        order: item.order > order ? item.order + 1 : item.order
      });
    });
    console.log(state.existBigQuestion);
    setTimeout(function () {
      state.existBigQuestion.splice(num, 0, obj);
      state.existBigQuestion = state.existBigQuestion.sort(function (a, b) {
        return a.order - b.order;
      });
    }, 50);
  },
  del_existBigQuestion: function del_existBigQuestion(state, obj) {
    var id = obj.objId != undefined ? obj.objId : obj.id;
    var index = state.existBigQuestion.findIndex(function (row) {
      return row.id === id;
    });

    if (index > -1) {
      state.existBigQuestion.splice(index, 1);
    }
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