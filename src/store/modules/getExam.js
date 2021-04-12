import {
  getExamInfo,
  GetStuResults
} from '@/config/getExam'

  const state = {
    examInfo: []
  }

  const mutations = {
    SET_EXAMINFO: (state, res) => {
      const data = res.ResponseContent
      state.examInfo = [
        {
          subject:'科目',
          type:'single',
          stretch:false,
          subjectList:data.subjects.map(item => ({
            ...item,
            check: item.sid == 'totalScore' ? true : false,
            name: item.sname
          }))
        },
        {
          subject:'班级',
          type:'multiple',
          stretch:false,
          subjectList:data.classes.map(item => ({
            ...item,
            check: item.cid == 'all' ? true : false,
            name: item.cname
          }))
        }
      ]
    },
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
        const { tid, subjectId, classIds, keyWords, pageIndex, pageSize } = padata
        GetStuResults({ tid, subjectId, classIds, keyWords, pageIndex, pageSize }).then(response => {
          console.log(response)
          // const { result, columns } = response
          // const columnsList = columns.map((item, i) => ({
          //   label: item.name,
          //   minWidth: item.width,
          //   prop: 'tab' + i
          // }))
          // const Arr = []
          // result.datas.forEach((element) => {
          //   const obj = {}
          //   for (var key in element.itemArray) {
          //     obj['tab' + key] = element.itemArray[key]
          //   }

          //   Arr.push(obj)
          // })
          // commit('GET_TABLELIST', Arr)
          // commit('GET_TABLECOLUMN', columnsList)
          // commit('GET_RECORDCOUNT', result.recordCount)
          // commit('GET_PAGECOUNT', result.pageCount)
          // commit('GET_PAGEINDEX', result.pageIndex)
          // commit('GET_PAGESIZE', result.pageSize)
          // commit('GET_TABLELOADING', false)
          resolve(response)
        }).catch(error => {
          commit('GET_TABLELOADING', true)
          reject(error)
        })
      })
    }
  }

  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
