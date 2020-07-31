const state = {
  precautions: {
    // 答题卡标题信息
    textarea: '',
    studentInfo: [{
        // 学生信息
        name: '考号',
        checked: true,
      },
      {
        name: '学校',
        checked: false,
      },
      {
        name: '姓名',
        checked: false,
      },
      {
        name: '班级',
        checked: true,
      },
      {
        name: '学号',
        checked: false,
      },
    ],
    AdmissionTicket: 8, // 准考证号
  },
}

const mutations = {
  setPrecautionsText(state, val) {
    state.precautions.textarea = val
  },
  setStudentInfo(state, Arr) {
    state.studentInfo = Arr
  },
  setAdmissionTicket(state, val) {
    state.precautions.AdmissionTicket = val
  },
}

const actions = {
  PrecautionsTextFunc: (context, layoutVal) => {
    context.commit('setPrecautionsText', layoutVal)
  },
  setStudentInfoFunc: (context, Arr) => {
    context.commit('setStudentInfo', Arr)
  },
  setAdmissionTicketFunc: (context, val) => {
    context.commit('setAdmissionTicket', val)
  }
}

const getters = {
  studentInfoArr: (state) => {
    // window.console.log(state.precautions.studentInfo)
    return state.precautions.studentInfo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}