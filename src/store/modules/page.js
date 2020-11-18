import { QUESTION_NUMBERS } from '@/models/base'
const state = {
  questionNumber: QUESTION_NUMBERS,
  pageLayout: {
    size: 'A3',
    column:2
  },
  pageData: [],
  nonAnswer:[], // 非答题存在数组
}

const mutations = {
  //编辑页面布局
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
  },

  //新增页面数据
  pageData_add: (state, question) => {
    state.pageData.push(question)
  },

  // 编辑页面数据
  pageData_edit: (state, question) => {
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

  pageData_del: (state, index) => {
    state.pageData.splice(index, 1)
  },

  pageData_id_clean: (state, id) => {
    // 内容分页
    state.pageData = state.pageData.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  pageData_orderFirst: (state, objId) => {
    // 解答题删除后续排序
    state.pageData = state.pageData.map(question => question.objId == objId ? {
      ...question,
      orderFirst: question.orderFirst - 1
    }:question)
  },

  pageData_order_edit: (state, data) => {
    // 解答题
    state.pageData = state.pageData.map(question => ({
      ...question,
      previousOrder: question.objId === data.objId ? data.num : question.previousOrder
    }))
  },

  pageData_id_filter: (state, id) => {
    // 解答题
    state.pageData = state.pageData.filter(question => question.id != id)
  },

  pageData_simple_insert: (state, data) => {
    // 解答题插入
    if (data.num > -1) {
      state.pageData.splice(data.num + 1,0,data.obj)
    }
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

  pageData_nonA_clean: (state,objId) => {
    state.pageData = state.pageData.filter((item) => item.questionType != "NonRresponseArea")
    state.pageData = state.pageData.filter((item) => item.objId != objId)
  },

}

const actions = {

}

const getters = {
  // 页面宽度
  page_width:(state) => {
    return state.pageLayout.column === 3 && state.pageLayout.size == 'A3'
        ? 480
        : 745
  },

  latticeWidth: (state,getters) => {
    //作文格子承载宽度
      return getters.page_width === 480 ? 31 : 31.73
  },

  latticeNum: (state, getters) => {
    return  getters.page_width === 480 ? 15 : 23
  },

  questionOrder: (state) => {
    return state.pageData.filter(question => question.questionType !== 'NonRresponseArea').length
  },

  compile_pageData: (state,getters) => {
    return state.pageData.map(question => {
      return question.questionType == 'ObjectiveQuestion' ? getters.question_objective(question) :
        question.questionType == 'compositionLanguage' ? getters.question_language(question) : question
    })
  },

  question_objective: (state, getters) => (question) => {
    // 客观题
    let { rowGroup, titleH } = question.height
    //题型分组
    let RowArr = [],columnArr = [],widthSum = 0,
      max = getters.page_width

        rowGroup.forEach(question => {
          let maxWidth = question.map(subtopic => subtopic.width)
            .reduce((a, b) => b > a ? b : a)
            widthSum += maxWidth
            if(widthSum < max){
                columnArr.push(question)
              }else{
                RowArr.push(columnArr)
                widthSum = maxWidth
                columnArr = []
                columnArr.push(question)
              }
        })

        if(columnArr.length > 0){
            RowArr.push(columnArr)
        }
        //计算内容高度
        let heights = titleH + RowArr.length * question.rowHeight
        return {...question,height:heights,showData:RowArr}
  },

  question_language: (state, getters) => (question) => {
    const { totalWordCount,spacing} = question.content
    let rows = Math.ceil(totalWordCount / getters.latticeNum) // .toFixed(2)
    console.log(rows)
    let rowHeight = getters.latticeWidth + spacing.value
        rowHeight = Number(rowHeight.toFixed(2))
    let height = rows * rowHeight + question.MarginHeight + question.heightTitle
      height = Number(height.toFixed(2))
    console.log(height)
    return {
      ...question,
      height: height,
      rowHeight: rowHeight,
      lattice:getters.latticeNum,
      rowWidth:getters.latticeWidth
    }
  },

  questionNumber_big_exist: (state,getters) => {
    // 大题号
    let obj = {}
    let Arr = []

    Arr =  getters.compile_pageData.filter(question => question.questionType !== 'AnswerSheetTitle' )
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

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}