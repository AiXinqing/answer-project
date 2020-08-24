"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  pageLayout: {},
  // 页面布局
  pageData: [],
  page_size: 1160 - 20,
  // 一页高度
  BigQuestion: 1,
  // 大题题号
  pageHeight: [] // 页面高度

};
var mutations = {
  initPageLayout: function initPageLayout(state, obj) {
    state.pageLayout = obj;
  },
  initPageData: function initPageData(state, Arr) {
    state.pageData.push(Arr);
    state.pageData = state.pageData.sort(function (a, b) {
      return a.order - b.order;
    });
  },
  amendPageData: function amendPageData(state, ArrItem) {
    // 编辑page-data
    var index = state.pageData.findIndex(function (itme) {
      return itme.id === ArrItem.id;
    });

    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem);
      state.pageData = state.pageData.sort(function (a, b) {
        return a.order - b.order;
      });
    }
  },
  deletePageData: function deletePageData(state, id) {
    // 解答题使用
    state.pageData = state.pageData.filter(function (item) {
      return ![id].includes(item.pid);
    }).sort(function (a, b) {
      return a.order - b.order;
    });
  },
  Empty_PageData: function Empty_PageData(state, id) {
    // 内容分页
    state.pageData = state.pageData.filter(function (item) {
      return ![id].includes(item.id);
    }).sort(function (a, b) {
      return a.order - b.order;
    });
    console.log(state.pageData);
  },
  delPageData: function delPageData(state, index) {
    state.pageData.splice(index, 1);
  },
  set_objectiveData: function set_objectiveData(state) {
    state.BigQuestion = state.BigQuestion + 1;
  },
  set_pageHeight: function set_pageHeight(state) {
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
  }
};
var actions = {
  getPageData: function getPageData(context) {
    _axios["default"].get('./pageData.json').then(function (_ref) {
      var data = _ref.data;
      console.log(data);

      if (data) {
        context.commit('initPageLayout', data.pageLayout);
        context.commit('initPageData', data.data);
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