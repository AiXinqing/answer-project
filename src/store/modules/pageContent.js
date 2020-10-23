import axios from 'axios'

const state = {
  pageLayout: {}, // 页面布局
  pageData: [],
  page_size: 1170 - 60, // 一页高度
  BigQuestion: 0, // 大题题号
  pageHeight: [], // 页面高度
  orderSort: 0, // 排序
  scoreTotal:0, // 试卷总分
}

const mutations = {
  scoreTotal_reset:(state)=>{
    state.scoreTotal = 0
  },
  scoreTotal_sum: (state,score) =>{
    state.scoreTotal += score
  }, // 试卷总分

  pageData_add: (state, Arr) => {
    state.pageData.push(Arr)
  },
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
  },
  pageData_edit: (state, ArrItem) => {
    // 编辑page-data
    const index = state.pageData.findIndex((itme) => itme.id === ArrItem.id)
    if (index > -1) {
      state.pageData.splice(index, 1, ArrItem)
    }
  },
  pageData_id_filter: (state, id) => {
    // 解答题
    state.pageData = state.pageData.filter(question =>  question.id != id)
  },
  pageData_objId_filter: (state, objId) => {
    // 解答题
    state.pageData = state.pageData.filter(question => !question.objId && question.objId != objId)
  },
  pageData_objId_del: (state, obj) => {
    state.pageData = state.pageData.map(question =>  ({
      ...question,
      group: question.objId === obj.objId ? [obj.group] : question.group
    }))
  },
  pageData_del: (state, index) => {
    state.pageData.splice(index, 1)
  },
  pageData_id_clean: (state, id) => {
    // 内容分页
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  pageData_insert: (state, {
    obj,
    num,
    order,
    SelfOrder
  }) => {
    //插入非作答
    state.pageData = state.pageData.map(question => {
      let lg = {}
      if (question.order > order){
        lg = {
          order: question.order == question.order + 1 ? question.order + 2 : question.order + 1,
        }
      }
      return {
        ...question,
        ...lg
      }
    })

    // 插入题型
    setTimeout(() => {
      state.pageData.splice(num, 0, {
        ...obj,
        order: obj.order + 1
      })

      state.pageData = state.pageData.sort((a, b) => {
        return a.order - b.order
      })

      if (SelfOrder) {
        state.pageData = state.pageData.map((question,index) => {
          let tig = 0
          let content = {}
          if (question.content.positionNum != undefined) {
            tig += 1
          }
          if(!question.content.number){
            content = {
              content: {
                ...question.content,
                number: index - tig,
              }
            }
          }
          return {
            ...question,
            ...content
          }
        })

      }
    }, 100)
  },

  answer_editPageOrder: (state, data) => {
    // 解答题
    state.pageData.forEach((question,index) => {
      if(question.objId === data.objId){
        state.pageData.splice(index, 1, {...question,previousOrder:data.num})
      }
    })
  },

  answer_insertPageData: (state, data) => {
    // 解答题插入
    state.pageData.splice(data.num, 0, data.obj)
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
    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.orderSort = state.orderSort - 1
  },
  layout_pageData: (state,layout) => {
    let containerWidth = layout.column === 3 && layout.size == 'A3'? 456 : 720
    let latticeWidth = layout.column === 3 && layout.size == 'A3'? 32.5 : 30
    let lattice = Math.floor(containerWidth / latticeWidth)

    state.pageData = state.pageData.map(question => {

      let row = Math.ceil(question.content.totalWordCount / lattice)
      //行数高度 = 格子大小 + 间距（间距同上要求）
      let rowHeight = latticeWidth + 2 + question.content.spacing

      let rectHeight = row * rowHeight // 当前内容高度 45(内部高度)
      let MarginHeight = 45
      const heights = rectHeight + MarginHeight + 32
      let tem = {}
      if(question.questionType == 'compositionLanguage'){
        tem ={
          height:heights,
          rowWidth:latticeWidth,
          rowHeight:rowHeight,
          lattice:lattice
        }
      }

      return {
        ...question,
        content:{
          ...question.content,
          pageLayout:layout
        },
        ...tem
      }
    })
  },
}

const actions = {
  getPageData: (context) => {
    axios.get('./pageData.json').then(({
      data
    }) => {
      if (data) {
        context.commit('pageLayout_change', data.pageLayout)
        context.commit('pageData_add', data.data)
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