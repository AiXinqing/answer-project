const state = {
  questionNumber: ['一', '二', '三', '四', '五', '六', '七', '八',
    '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七',
    '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四'
  ],
  pageLayout: {}, // 页面布局
  pageData: [],

  pageHeight: [], // 页面高度

  questionOrder: 0, // 题序
  // questionNumber_big: 0, // 大题题号

  scoreTotal: 0, // 试卷总分

  nonAnswer:[], // 非答题存在数组
}

const mutations = {
  scoreTotal_reset: (state) => {
    state.scoreTotal = 0
  },
  scoreTotal_sum: (state, score) => {
    state.scoreTotal += score
  }, // 试卷总分

  pageData_add: (state, Arr) => {
    state.pageData.push(Arr)
  },
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
  },
  pageData_edit: (state, question) => {
    // 编辑page-data
    const index = state.pageData.findIndex((itme) => itme.id === question.id)
    if (index > -1) {
      if (question.changeOrder) { // 非作答题
        state.pageData.splice(index, 1)
        state.pageData.splice(question.changeOrder, 0, question)
      } else {
        state.pageData.splice(index, 1, question)
      }
    }
  },
  pageData_id_filter: (state, id) => {
    // 解答题
    state.pageData = state.pageData.filter(question => question.id != id)
  },
  pageData_objId_filter: (state, objId) => {
    // 解答题
    state.pageData = state.pageData.filter(question => !question.objId && question.objId != objId)
  },
  pageData_objId_del: (state, obj) => {
    state.pageData = state.pageData.map(question => ({
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

  pageData_nonA_clean: (state,objId) => {
    state.pageData = state.pageData.filter((item) => item.questionType != "NonRresponseArea")
    state.pageData = state.pageData.filter((item) => item.objId != objId)
  },

  pageData_insert: (state, {
    obj,
    bigId,
    SelfOrder
  }) => {
    let nums = 0
    const index = state.pageData.findIndex((itme) => itme.id == bigId)
    if (index > -1) {
      nums = index + 1
      if(obj.questionType == "answerQuestion"){
        // 解答题插入
        nums = nums + obj.index
      }
      state.pageData.splice(nums, 0, obj)
    }
    if (SelfOrder) {
      let order = 0
      state.pageData = state.pageData.map((question) => {
        if (question.questionType !== "NonRresponseArea") {
          order += 1
        }
        let num = {}
        if (!question.questionType !== "AnswerSheetTitle") {
          num = {
            number:order - 2
          }
        }
        return {
          ...question,
          content: {
            ...question.content,
            ...num
          }
        }
      })

    }
  },

  pageData_simple_insert: (state, data) => {
    // 解答题插入
    if (data.num > -1) {
      state.pageData.splice(data.num + 1,0,data.obj)
    }
  },
  pageData_order_edit: (state, data) => {
    // 解答题
    state.pageData = state.pageData.map(question => ({
      ...question,
      previousOrder: question.objId === data.objId ? data.num : question.previousOrder
    }))
  },


  pageHeight_set: (state, Arr = []) => {
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

  questionOrder_subtract: (state, order) => {
    state.pageData.map((item) =>
      item.order > order ? item.order - 1 : item.order
    )
    state.questionOrder = state.questionOrder - 1
  },

  pageLayout_launch_page: (state, layout) => {
    let containerWidth = layout.column === 3 && layout.size == 'A3' ? 456 : 720
    let latticeWidth = layout.column === 3 && layout.size == 'A3' ? 32.5 : 30
    let lattice = Math.floor(containerWidth / latticeWidth)

    state.pageData = state.pageData.map(question => {

      let row = Math.ceil(question.content.totalWordCount / lattice)
      //行数高度 = 格子大小 + 间距（间距同上要求）
      let rowHeight = latticeWidth + 2 + question.content.spacing

      let rectHeight = row * rowHeight // 当前内容高度 45(内部高度)
      let MarginHeight = 45
      const heights = rectHeight + MarginHeight + 32
      let tem = {}
      if (question.questionType == 'compositionLanguage') {
        tem = {
          height: heights,
          rowWidth: latticeWidth,
          rowHeight: rowHeight,
          lattice: lattice
        }
      }

      return {
        ...question,
        content: {
          ...question.content,
          pageLayout: layout
        },
        ...tem
      }
    })
  },

  add_nonAnswer: (state, obj) => {
    // 非答题新增
    let index = state.nonAnswer.findIndex(ele => ele.id == obj.id)
    if (index > -1) {
      state.nonAnswer = state.nonAnswer.splice(index, 0, obj)
    } else {
      state.nonAnswer.push(obj)
    }
  },

  del_nonAnswer: (state, obj) => {
    // 非答题新增
    let index = state.nonAnswer.findIndex(ele => ele.id == obj.id)
    if (index > -1) {
      state.nonAnswer = state.nonAnswer.splice(index, 1)
    }
  },
  // 插入清空的非答题
  nonAnswer_insert: (state) => {
    state.nonAnswer.forEach(obj => {
      let index = state.pageData.findIndex(question => question.id == obj.insertIndex)
      if (index > -1) {
        state.pageData.splice(index + 1, 0, obj)
      }
    })
  },
}

const actions = {}

const getters = {
  dataLayout: (state) => {
    return state.pageLayout
  },
  questionNumber_big_exist: (state) => {
    // 大题号
    let obj = {}

    let Arr =  state.pageData.filter(question => question.questionType !== 'AnswerSheetTitle' )
      .filter(question => question.questionType !== 'NonRresponseArea')
      .map((question, index) => {
        let {
          number,
          topicName
        } = question.content
        let objId = {}
        if (question.objId) {
          objId = {objId:question.objId}
        }
        return {
          id: question.id,
          ...objId,
          label: state.questionNumber[number] + '.' + topicName,
          order: !question.order ? index + 1 : question.order,
          value: index,
          type:question.questionType
        }
      })
      .reduce((acc, cur) => {
        obj[cur.label] ? '' : obj[cur.label] = true && acc.push(cur)
        return acc.map(question => {
          return question.label == cur.label && question.order < cur.order ? cur : question
        })
      }, [])
    return Arr
  },
  question_order: (state) => {
    return state.pageData.filter(question => question.questionType !== 'NonRresponseArea').length
  },
  options:()=>{
    return state.questionNumber.map((label,value)=>({label,value}))
  },
  pageWidth:(state) => {
    return state.pageLayout.column === 3 && state.pageLayout.size == 'A3' ? 480 : 745
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}