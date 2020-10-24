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
  subTopic_number_already: [],
  // 已有的题组
  subTopic_number: 1,
  letterList: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K'],
  largest_questionNum: 200,
  // 最大题数
  subTopic_number_determine: [],
  // 确定下的小题
  questionNumber_big_exist: [] // 存在大题

};
var mutations = {
  subTopic_already_del: function subTopic_already_del(state, Arr) {
    if (Arr == undefined) {
      return false;
    } // 删除已有小题数组


    Arr.forEach(function (item) {
      var index = state.subTopic_number_already.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.subTopic_number_already.splice(index, 1);
      }
    });
  },
  subTopic_already_add: function subTopic_already_add(state, Arr) {
    if (Arr == undefined) {
      return false;
    } //新增小题数组


    Arr.forEach(function (item) {
      if (state.subTopic_number_already.length > 0) {
        var index = state.subTopic_number_already.findIndex(function (row) {
          return row.topic === item.topic;
        });

        if (index > -1) {
          state.subTopic_number_already.splice(index, 1, item);
        } else {
          state.subTopic_number_already.push(item);
        }
      } else {
        state.subTopic_number_already.push(item);
      }
    });
  },
  subTopic_already_clean: function subTopic_already_clean(state, id) {
    // 一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter(function (item) {
      return ![id].includes(item.id);
    });
  },
  subTopic_already_pid_clean: function subTopic_already_pid_clean(state, pid) {
    // 解答一次清除
    state.subTopic_number_already = state.subTopic_number_already.filter(function (item) {
      return ![pid].includes(item.pid);
    });
  },
  subTopic_number_calculate_already: function subTopic_number_calculate_already(state, Arr) {
    if (Arr == undefined) {
      return false;
    }

    Arr.forEach(function (item) {
      var index = state.subTopic_number_already.findIndex(function (row) {
        return row.topic == item.topic;
      });

      if (index > -1) {
        state.subTopic_number_already.splice(index, 1, item);
      }
    });
  },
  subTopic_already_reset: function subTopic_already_reset(state) {
    // 清空数据
    state.subTopic_number_already = [];
  },
  subTopic_number_calculate: function subTopic_number_calculate(state) {
    var _loop = function _loop(i) {
      //
      var index = state.subTopic_number_already.findIndex(function (item) {
        return item.topic === i;
      });

      if (index <= -1) {
        state.subTopic_number = i;
        return "break";
      } else {
        state.subTopic_number = 1;
      }
    };

    for (var i = 1; i < state.largest_questionNum; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    }
  },
  subTopic_calculate_determine: function subTopic_calculate_determine(state, Arr) {
    if (Arr == undefined) {
      return false;
    } // 添加确定值


    Arr.forEach(function (item) {
      var index = state.subTopic_number_determine.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.subTopic_number_determine.splice(index, 1, item);
      } else {
        state.subTopic_number_determine.push(item);
      }
    });
  },
  subTopic_determine_pid_clean: function subTopic_determine_pid_clean(state, pid) {
    // 一次清除相同pid
    state.subTopic_number_determine = state.subTopic_number_determine.filter(function (item) {
      return ![pid].includes(item.pid);
    });
  },
  subTopic_determine_del: function subTopic_determine_del(state, Arr) {
    if (Arr == undefined) {
      return false;
    }

    Arr.forEach(function (item) {
      var index = state.subTopic_number_determine.findIndex(function (row) {
        return row.topic === item.topic;
      });

      if (index > -1) {
        state.subTopic_number_determine.splice(index, 1);
      }
    });
  },
  // 存在大题
  questionNumber_big_exist_edit: function questionNumber_big_exist_edit(state, obj) {
    var index = state.questionNumber_big_exist.findIndex(function (row) {
      return row.id === obj.id;
    });

    if (index > -1) {
      state.subTopic_number_determine.splice(index, 1, obj);
    } else {
      state.questionNumber_big_exist.push(obj);
    }
  },
  questionNumber_big_exist_insert: function questionNumber_big_exist_insert(state, _ref) {
    var obj = _ref.obj,
        num = _ref.num,
        order = _ref.order,
        SelfOrder = _ref.SelfOrder;
    console.log(order);
    state.questionNumber_big_exist.map(function (item) {
      return _objectSpread({}, item, {
        order: item.order >= order ? item.order + 1 : item.order
      });
    });
    setTimeout(function () {
      state.questionNumber_big_exist.splice(num, 0, obj);
      state.questionNumber_big_exist = state.questionNumber_big_exist.sort(function (a, b) {
        return a.order - b.order;
      });

      if (SelfOrder) {
        state.questionNumber_big_exist.forEach(function (item, index) {
          // const i = state.options.findIndex(item => item.value == (index + 1))
          state.questionNumber_big_exist.splice(index, 1, _objectSpread({}, item, {
            label: state.options[index].label + '.' + item.label.split('.')[1]
          }));
        });
      }
    }, 50);
  },
  questionNumber_big_exist_del: function questionNumber_big_exist_del(state, obj) {
    var id = obj.objId != undefined ? obj.objId : obj.id;
    var index = state.questionNumber_big_exist.findIndex(function (row) {
      return row.id === id;
    });

    if (index > -1) {
      state.questionNumber_big_exist.splice(index, 1);
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