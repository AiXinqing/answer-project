  import {
    getExamInfo,
    GetStuResults,
    dynamicHeader
  } from '@/config/getExam'

  const state = {
    headerTable: [],
    tsid: 'totalScore',
    subjectsArr: [],
    classesArr: [],
    TableList: [],
    tableLoading: false
  }

  const mutations = {
    SET_EXAMINFO: (state, res) => {
      const data = res.ResponseContent
      // 科目
      state.subjectsArr = data.subjects.map(item => ({
        ...item,
        check: item.sid == 'totalScore' ? true : false,
        name: item.sname
      }))
      // 班级
      state.classesArr = data.classes.map(item => ({
        ...item,
        check: true,
        name: item.cname
      }))

    },

    SET_HEADERTABLE: (state, res) => {
      const data = res.ResponseContent
      state.headerTable = data
    },

    SET_TABLE: (state, res) => {
      const { data } = res.ResponseContent
      state.TableList = data
    },

    GET_TABLELOADING: (state, isLoading) => {
      state.tableLoading = isLoading
    }
  }

  const actions = {
    getExamInfo ({ commit }, padata) {
      return getExamInfo(padata).then((res) => {
        commit('SET_EXAMINFO', res)
        return res
      })
    },

    GetStuResults({ commit }, padata) {
      return new Promise((resolve, reject) => {
        const { tid, tsid, cids, keyWords, pageIndex, pageSize, url } = padata
        GetStuResults({ tid, tsid, cids, keyWords, pageIndex, pageSize,url}).then(res => {
          commit('SET_TABLE', res)
          resolve(res)
          commit('GET_TABLELOADING', false)
          return res
        }).catch(error => {
          commit('GET_TABLELOADING', true)
          reject(error)
        })
      })
    },

    // 获取动态表头
    dynamicHeader ({ commit }, padata) {
      return dynamicHeader(padata).then((res) => {
        commit('SET_HEADERTABLE', res)
        return res
      })
    },
  }

  const getters = {
    // 页面宽度
    examInfo:(state) => {
      return [
        {
          subject:'科目',
          type:'single',
          stretch:true,
          subjectList:state.subjectsArr
        },
        {
          subject:'班级',
          type:'multiple',
          stretch:true,
          subjectList:state.classesArr
        }
      ]
    },
  }

  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
