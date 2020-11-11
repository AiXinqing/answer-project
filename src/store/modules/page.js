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
    const maxWidthArr = []
    //题型分组
    let RowArr = [],columnArr = [],widthSum = 0,
        max = getters.page_width
    rowGroup.filter((item) => {
      let widthS = item.map((row) => row.width)
      maxWidthArr.push(Math.max.apply(null, widthS))

      let maxWidth = Math.max.apply(Math, item.map(function(o) {return o.width}))
          widthSum += maxWidth

          if(widthSum < max){
            columnArr.push(item)
          }else{
            RowArr.push(columnArr)
            widthSum = maxWidth
            columnArr = []
            columnArr.push(item)
          }
    })

    if(columnArr.length > 0){
      RowArr.push(columnArr)
    }

    let sum = 0,arr = [], numberArr = []
        maxWidthArr.forEach(num => {
          sum += num
          if(sum <= max){
            arr.push(num)
          }else{
            numberArr.push(arr)
            sum = num
            arr = [num]
          }
        })
        if(arr.length > 0){
          numberArr.push(arr)
        }
    let maxWidth = numberArr.map(num => num.length)
    let heights = rowGroup.map((item) => item.length * 22)
    let twoDimensional = [], num = 0, contentHeight = 0
    for (let i = 0; i < maxWidth.length; i++) {
          num += maxWidth[i]
          twoDimensional.push(heights.slice(num - maxWidth[i], num))
        }
    let heightList = twoDimensional.map((item) => {
      return Math.max.apply(null, item)
    })
    if (heightList.length > 0) {
      contentHeight = (
        heightList.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        ) +
        heightList.length * 10
      )
    }
    let height_content = contentHeight + titleH
    return {...question,height:height_content,showData:RowArr}
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}