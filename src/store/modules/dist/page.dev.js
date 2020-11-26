"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = require("@/models/base");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  questionNumber: _base.QUESTION_NUMBERS,
  pageLayout: {
    size: 'A3',
    column: 2
  },
  pageData: [],
  nonAnswer: [] // 非答题存在数组

};
var mutations = {
  //编辑页面布局
  pageLayout_change: function pageLayout_change(state, obj) {
    state.pageLayout = obj;
  },
  //新增页面数据
  pageData_add: function pageData_add(state, question) {
    state.pageData.push(question);
  },
  // 编辑页面数据
  pageData_edit: function pageData_edit(state, question) {
    var index = state.pageData.findIndex(function (itme) {
      return itme.id === question.id;
    });

    if (index > -1) {
      if (question.changeOrder) {
        // 非作答题
        state.pageData.splice(index, 1);
        state.pageData.splice(question.changeOrder, 0, question);
      } else {
        state.pageData.splice(index, 1, question);
      }
    }
  },
  pageData_insert: function pageData_insert(state, _ref) {
    var obj = _ref.obj,
        bigId = _ref.bigId,
        SelfOrder = _ref.SelfOrder;
    var nums = 0;
    var index = state.pageData.findIndex(function (itme) {
      return itme.id == bigId;
    });

    if (index > -1) {
      nums = index + 1;

      if (obj.questionType == "answerQuestion") {
        // 解答题插入
        nums = nums + obj.index;
      }

      state.pageData.splice(nums, 0, obj);
    }

    if (SelfOrder) {
      var order = 0;
      state.pageData = state.pageData.map(function (question) {
        if (question.questionType !== "NonRresponseArea") {
          order += 1;
        }

        var num = {};

        if (!question.questionType !== "AnswerSheetTitle") {
          num = {
            number: order - 2
          };
        }

        return _objectSpread({}, question, {
          content: _objectSpread({}, question.content, {}, num)
        });
      });
    }
  },
  pageData_del: function pageData_del(state, index) {
    state.pageData.splice(index, 1);
  },
  pageData_id_clean: function pageData_id_clean(state, id) {
    // 内容分页
    state.pageData = state.pageData.filter(function (item) {
      return ![id].includes(item.id);
    });
  },
  pageData_orderFirst: function pageData_orderFirst(state, objId) {
    // 解答题删除后续排序
    state.pageData = state.pageData.map(function (question) {
      return question.objId == objId ? _objectSpread({}, question, {
        orderFirst: question.orderFirst - 1
      }) : question;
    });
  },
  pageData_order_edit: function pageData_order_edit(state, data) {
    // 解答题
    state.pageData = state.pageData.map(function (question) {
      return _objectSpread({}, question, {
        previousOrder: question.objId === data.objId ? data.num : question.previousOrder
      });
    });
  },
  pageData_id_filter: function pageData_id_filter(state, id) {
    // 解答题
    state.pageData = state.pageData.filter(function (question) {
      return question.id != id;
    });
  },
  pageData_simple_insert: function pageData_simple_insert(state, data) {
    // 解答题插入
    if (data.num > -1) {
      state.pageData.splice(data.num + 1, 0, data.obj);
    }
  },
  add_nonAnswer: function add_nonAnswer(state, obj) {
    // 非答题新增
    var index = state.nonAnswer.findIndex(function (ele) {
      return ele.id == obj.id;
    });

    if (index > -1) {
      state.nonAnswer = state.nonAnswer.splice(index, 0, obj);
    } else {
      state.nonAnswer.push(obj);
    }
  },
  del_nonAnswer: function del_nonAnswer(state, obj) {
    // 非答题新增
    var index = state.nonAnswer.findIndex(function (ele) {
      return ele.id == obj.id;
    });

    if (index > -1) {
      state.nonAnswer.splice(index, 1);
    } else {
      state.nonAnswer.splice(0, 1);
    }
  },
  // 插入清空的非答题
  nonAnswer_insert: function nonAnswer_insert(state) {
    state.nonAnswer.forEach(function (obj) {
      var index = state.pageData.findIndex(function (question) {
        return question.id == obj.insertIndex;
      });

      if (index > -1) {
        state.pageData.splice(index + 1, 0, obj);
      }
    });
  },
  pageData_nonA_clean: function pageData_nonA_clean(state, objId) {
    state.pageData = state.pageData.filter(function (item) {
      return item.questionType != "NonRresponseArea";
    });
    state.pageData = state.pageData.filter(function (item) {
      return item.objId != objId;
    });
  }
};
var actions = {};
var getters = {
  // 页面宽度
  page_width: function page_width(state) {
    return state.pageLayout.column === 3 && state.pageLayout.size == 'A3' ? 480 : 745;
  },
  latticeWidth: function latticeWidth(state, getters) {
    //作文格子承载宽度
    return getters.page_width === 480 ? 31 : 32;
  },
  latticeNum: function latticeNum(state, getters) {
    return getters.page_width === 480 ? 15 : 23;
  },
  questionOrder: function questionOrder(state) {
    return state.pageData.filter(function (question) {
      return question.questionType !== 'NonRresponseArea';
    }).length;
  },
  compile_pageData: function compile_pageData(state, getters) {
    return state.pageData.map(function (question) {
      return question.questionType == 'ObjectiveQuestion' ? getters.question_objective(question) : question.questionType == 'compositionLanguage' ? getters.question_language(question) : question;
    });
  },
  question_objective: function question_objective(state, getters) {
    return function (question) {
      // 客观题
      var _question$height = question.height,
          rowGroup = _question$height.rowGroup,
          titleH = _question$height.titleH; //题型分组

      var RowArr = [],
          columnArr = [],
          widthSum = 0,
          max = getters.page_width;
      rowGroup.forEach(function (question) {
        var maxWidth = question.map(function (subtopic) {
          return subtopic.width;
        }).reduce(function (a, b) {
          return b > a ? b : a;
        });
        widthSum += maxWidth;

        if (widthSum < max) {
          columnArr.push(question);
        } else {
          RowArr.push(columnArr);
          widthSum = maxWidth;
          columnArr = [];
          columnArr.push(question);
        }
      });

      if (columnArr.length > 0) {
        RowArr.push(columnArr);
      }

      var lastHeight = RowArr[RowArr.length - 1].map(function (temp) {
        return temp.length * 21 + 10;
      }).reduce(function (a, b) {
        return b > a ? b : a;
      });
      var less = lastHeight >= question.rowHeight ? 0 : question.rowHeight - lastHeight; //计算内容高度

      var heights = titleH + RowArr.length * question.rowHeight - less;
      return _objectSpread({}, question, {
        height: heights,
        showData: RowArr
      });
    };
  },
  question_language: function question_language(state, getters) {
    return function (question) {
      var _question$content = question.content,
          totalWordCount = _question$content.totalWordCount,
          spacing = _question$content.spacing;
      var rows = Math.ceil(totalWordCount / getters.latticeNum); // .toFixed(2)

      var rowHeight = getters.latticeWidth + spacing.value;
      rowHeight = Number(rowHeight.toFixed(2));
      var height = rows * rowHeight + question.MarginHeight + question.heightTitle + question.rowTitle;
      height = Number(height.toFixed(2));
      return _objectSpread({}, question, {
        height: height,
        rowHeight: rowHeight,
        lattice: getters.latticeNum,
        rowWidth: getters.latticeWidth
      });
    };
  },
  questionNumber_big_exist: function questionNumber_big_exist(state, getters) {
    // 大题号
    var obj = {};
    var Arr = [];
    Arr = getters.compile_pageData.filter(function (question) {
      return question.questionType !== 'AnswerSheetTitle';
    }).filter(function (question) {
      return question.questionType !== 'NonRresponseArea';
    }).map(function (question, index) {
      var _question$content2 = question.content,
          number = _question$content2.number,
          topicName = _question$content2.topicName;
      var objId = {};

      if (question.objId) {
        objId = {
          objId: question.objId
        };
      }

      return _objectSpread({
        id: question.id
      }, objId, {
        label: state.questionNumber[number] + '.' + topicName,
        order: !question.order ? index + 1 : question.order,
        value: index,
        type: question.questionType
      });
    }).reduce(function (acc, cur) {
      obj[cur.label] ? '' : obj[cur.label] = true && acc.push(cur);
      return acc.map(function (question) {
        return question.label == cur.label && question.order < cur.order ? cur : question;
      });
    }, []);
    return Arr;
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
exports["default"] = _default;