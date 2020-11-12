const state = {
  pageLayout: {
    size: 'A3',
    column:2
  },

  pageData: [],
}

const mutations = {
  //编辑页面布局
  pageLayout_change: (state, obj) => {
    state.pageLayout = obj
  },

  //新增页面数据
  pageData_add: (state, Arr) => {
    state.pageData.push(Arr)
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

  compile_pageData: (state,getters) => {
    if (state.pageData.length) {
      return state.pageData.map(question => {
        return question.questionType == 'ObjectiveQuestion' ? getters.question_objective(question) : question
      })
    } else {
      return state.pageData
    }
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
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}