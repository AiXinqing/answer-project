import axios from 'axios'

const state = {
  pageLayout: {}, // 页面布局
  pageData: [],
  page_size: 1160, // 一页高度
  BigQuestion: 1, // 大题题号
  pageHeight: [], // 页面高度
}

const mutations = {
  initPageLayout: (state, obj) => {
    state.pageLayout = obj
  },
  initPageData: (state, Arr) => {
    state.pageData.push(Arr)
  },
  amendPageData: (state, ArrItem) => { // 编辑page-data
    const index = state.pageData.findIndex((itme) => itme.id === ArrItem.id)
    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem)
    }
  },
  deletePageData: (state, id) => { // 解答题使用
    const index = state.pageData.findIndex((itme) => itme.pid === id)
    if (index > -1) {
      state.pageData.splice(index, 1)
    }
  },
  delPageData: (state, index) => {
    state.pageData.splice(index, 1)
  },
  set_objectiveData: (state, val) => {
    state.BigQuestion = val + 1
  },
  set_pageHeight: (state, Arr = []) => {
    // 页面高度更新
    const results = []
    // currentPage.height 总高度
    var currentPage = {
      height: 0,
      rects: [],
    }
    Arr.forEach((rect) => {
      currentPage.height += rect
      if (currentPage.height < state.page_size) {
        currentPage.rects.push(rect)
      } else {
        currentPage.height = rect
        results.push(currentPage.rects)
        currentPage.rects = []
        currentPage.rects.push(rect)
      }
    })
    if (currentPage.rects.length > 0) {
      results.push(currentPage.rects)
    }
    state.pageHeight = results
  }
}

const actions = {
  getPageData: (context) => {
    axios.get('./pageData.json')
      .then(({
        data
      }) => {
        console.log(data)
        if (data) {
          context.commit('initPageLayout', data.pageLayout)
          context.commit('initPageData', data.data)
        }
      })
  }
}

const getters = {
  dataLayout: (state) => {
    return state.pageLayout
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}