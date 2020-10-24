"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
  pageLayout: {},
  // 页面布局
  pageData: [],
  page_size: 1170 - 60,
  // 一页高度
  questionNumber_big: 1,
  // 大题题号
  pageHeight: [],
  // 页面高度
  questionOrder: 0 // 排序

};
var mutations = {
  pageLayout_change: function pageLayout_change(state, obj) {
    state.pageLayout = obj;
  },
  pageData_add: function pageData_add(state, Arr) {
    state.pageData.push(Arr); // state.pageData = state.pageData.sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  pageData_edit: function pageData_edit(state, ArrItem) {
    // 编辑page-data
    var index = state.pageData.findIndex(function (itme) {
      return itme.id === ArrItem.id;
    });

    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem);
    }
  },
  pageData_objId_del: function pageData_objId_del(state, id) {
    // 解答题使用
    state.pageData = state.pageData.filter(function (item) {
      return ![id].includes(item.pid);
    }); // .sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  pageData_id_clean: function pageData_id_clean(state, id) {
    // 内容分页
    state.pageData = state.pageData.filter(function (item) {
      return ![id].includes(item.id);
    }); // .sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  pageData_del: function pageData_del(state, index) {
    state.pageData.splice(index, 1);
  },
  pageData_insert: function pageData_insert(state, _ref) {
    var obj = _ref.obj,
        num = _ref.num,
        order = _ref.order,
        SelfOrder = _ref.SelfOrder;
    //插入非作答
    // state.pageData.map(item => item.order > order ? item.order + 1 : item.order)
    state.pageData.forEach(function (item, index) {
      if (item.order > order) {
        state.pageData.splice(index, 1, _objectSpread({}, item, {
          order: item.order + 1
        }));
      }
    });
    setTimeout(function () {
      state.pageData.splice(num, 0, obj);
      state.pageData = state.pageData.sort(function (a, b) {
        return a.order - b.order;
      });

      if (SelfOrder) {
        var tig = 0;
        state.pageData.forEach(function (item, index) {
          if (item.content.positionNum != undefined) {
            tig += 1;
          }

          console.log(item);

          if (item.content.number != undefined) {
            state.pageData.splice(index, 1, _objectSpread({}, item, {
              content: _objectSpread({}, item.content, {
                number: index - tig
              })
            }));
          }
        });
      }
    }, 50);
  },
  questionNumber_big_add: function questionNumber_big_add(state) {
    state.questionNumber_big = state.questionNumber_big + 1;
  },
  questionNumber_big_subtract: function questionNumber_big_subtract(state) {
    state.questionNumber_big = state.questionNumber_big - 1;
  },
  pageHeight_set: function pageHeight_set(state) {
    var Arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    // 页面高度更新
    var results = []; // currentPage.height 总高度

    var currentPage = {
      height: 0,
      rects: []
    };
    Arr.forEach(function (rect) {
      currentPage.height += rect;

      if (currentPage.height < state.page_size) {
        currentPage.rects.push(rect);
      } else {
        currentPage.height = rect;
        results.push(currentPage.rects);
        currentPage.rects = [];
        currentPage.rects.push(rect);
      }
    });

    if (currentPage.rects.length > 0) {
      results.push(currentPage.rects);
    }

    state.pageHeight = results;
  },
  questionOrder_add: function questionOrder_add(state) {
    state.questionOrder = state.questionOrder + 1;
  },
  questionOrder_subtract: function questionOrder_subtract(state, order) {
    console.log(order);
    state.pageData.map(function (item) {
      return item.order > order ? item.order - 1 : item.order;
    });
    state.questionOrder = state.questionOrder - 1;
  }
};
var actions = {
  getPageData: function getPageData(context) {
    _axios["default"].get('./pageData.json').then(function (_ref2) {
      var data = _ref2.data;

      if (data) {
        context.commit('pageLayout_change', data.pageLayout);
        context.commit('pageData_add', data.data);
      }
    });
  }
};
var getters = {
  dataLayout: function dataLayout(state) {
    return state.pageLayout;
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