import axios from 'axios'

const state = {
  pageLayout: {}, // 页面布局
  pageData: [],
  page_size: 1170 - 60, // 一页高度
  BigQuestion: 1, // 大题题号
  pageHeight: [], // 页面高度
  orderSort: 0, // 排序
}

const mutations = {
  initPageLayout: (state, obj) => {
    state.pageLayout = obj
  },
  initPageData: (state, Arr) => {
    state.pageData.push(Arr)
    // state.pageData = state.pageData.sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  amendPageData: (state, ArrItem) => { // 编辑page-data
    const index = state.pageData.findIndex((itme) => itme.id === ArrItem.id)
    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem)
    }
  },
  deletePageData: (state, id) => { // 解答题使用
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.pid)
    })
    // .sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  Empty_PageData: (state, id) => { // 内容分页
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.id)
    })
    // .sort((a, b) => {
    //   return a.order - b.order;
    // })
  },
  delPageData: (state, index) => {
    state.pageData.splice(index, 1)
  },
  insert_pageData: (state, {
    obj,
    num,
    order,
    SelfO0rder
  }) => {
    //插入非作答

    // state.pageData.map(item => item.order > order ? item.order + 1 : item.order)
    state.pageData.forEach((item, index) => {
      if (item.order > order) {
        state.pageData.splice(index, 1, {
          ...item,
          order: item.order + 1
        })
      }
    })

    setTimeout(() => {
      state.pageData.splice(num, 0, obj)
      state.pageData = state.pageData.sort((a, b) => {
        return a.order - b.order
      })
      if (SelfO0rder) {
        let tig = 0
        state.pageData.forEach((item, index) => {
          if (item.content.positionNum != undefined) {
            tig += 1
          }
          console.log(item)
          if (item.content.number != undefined) {
            state.pageData.splice(index, 1, {
              ...item,
              content: {
                ...item.content,
                number: index - tig
              }
            })
          }
        })
      }
    }, 50);
  },
  set_objectiveData: (state) => {
    state.BigQuestion = state.BigQuestion + 1
  },
  del_objectiveData: (state) => {
    state.BigQuestion = state.BigQuestion - 1
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
  },
  set_orderSort: (state) => {
    state.orderSort = state.orderSort + 1
  },
  del_orderSort: (state, order) => {
    console.log(order)
    state.pageData.map(item => item.order > order ? item.order - 1 : item.order)
    state.orderSort = state.orderSort - 1
  }
}

const actions = {
  getPageData: (context) => {
    axios.get('./pageData.json')
      .then(({
        data
      }) => {
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