import axios from 'axios'

const state = {
  pageLayout: {}, // 页面布局
  pageData: [],
  page_size: 1170 - 60, // 一页高度
  BigQuestion: 0, // 大题题号
  pageHeight: [], // 页面高度
  orderSort: 0, // 排序
  paperTotalScore:0, // 试卷总分
}

const mutations = {
  resetScore:(state)=>{
    state.paperTotalScore = 0
  },
  overlayScore: (state,score) =>{
    state.paperTotalScore += score
  }, // 试卷总分
  initPageLayout: (state, obj) => {
    state.pageLayout = obj
  },
  initPageData: (state, Arr) => {
    state.pageData.push(Arr)
  },
  amendPageData: (state, ArrItem) => {
    // 编辑page-data
    const index = state.pageData.findIndex((itme) => itme.id === ArrItem.id)
    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem)
    }
  },
  deletePageData: (state, obj) => {
    // 解答题使用objId
    state.pageData.map((question, index) => {
      if (question.objId && question.objId === obj.objId) {
        state.pageData.splice(index, 1, {
          ...question,
          group: [obj.group]
        })
      }
    })
  },
  answerFilter_pageData: (state, objId) => {
    // 解答题
    state.pageData = state.pageData.filter(question => !question.objId && question.objId != objId)
  },

  answer_insertPageData: (state, data) => {
    // 解答题插入
    state.pageData.splice(data.num, 0, data.obj)
  },

  answer_editPageOrder: (state, data) => {
    // 解答题
    state.pageData.forEach((question,index) => {
      if(question.objId === data.objId){
        state.pageData.splice(index, 1, {...question,previousOrder:data.num})
      }
    })
  },

  Empty_PageData: (state, id) => {
    // 内容分页
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.id)
    })
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
    state.pageData.forEach((item, index) => {
      if (item.order > order) {
        state.pageData.splice(index, 1, {
          ...item,
          order: item.order == item.order + 1 ? item.order + 2 : item.order + 1,
        })
      }
    })
    setTimeout(() => {
      state.pageData.splice(num, 0, {
        ...obj,
        order: obj.order + 1
      })

      state.pageData = state.pageData.sort((a, b) => {
        return a.order - b.order
      })

      if (SelfO0rder) {
        let tig = 0
        state.pageData.forEach((item, index) => {
          if (item.content.positionNum != undefined) {
            tig += 1
          }

          if (item.content.number != undefined) {
            state.pageData.splice(index, 1, {
              ...item,
              content: {
                ...item.content,
                number: index - tig,
              },
            })
          }
        })
      }
    }, 100)
  },
  set_objectiveData: (state) => {
    state.BigQuestion = state.BigQuestion + 1
  },
  del_objectiveData: (state) => {
    state.BigQuestion = state.BigQuestion - 1
    if (state.BigQuestion < 0) {
      state.BigQuestion = 0
    }
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
    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.orderSort = state.orderSort - 1
  },
}

const actions = {
  getPageData: (context) => {
    axios.get('./pageData.json').then(({
      data
    }) => {
      if (data) {
        context.commit('initPageLayout', data.pageLayout)
        context.commit('initPageData', data.data)
      }
    })
  },
}

const getters = {
  dataLayout: (state) => {
    return state.pageLayout
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}