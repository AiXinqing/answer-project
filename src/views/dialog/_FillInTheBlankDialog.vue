<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="objectiveData.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="objectiveData.topic"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每行展示</div>
          <el-input
            v-model.number="objectiveData.rows"
            size="mini"
            placeholder="请输入内容"
          />
          <div class="label m-5" style="padding-left:5px">空</div>
        </el-col>
      </el-row>
      <space-question
        :group-data="objectiveData.group"
        :edit-id="editQuestionId"
        @hanlde-status="hanldeStatus"
        @hanlde-add-group-question="hanldeAddGroupQuestion"
        @hanlde-del-group="hanldeDelGroup"
        @hanlde-add-sub-topic="hanldeAddSubtopic"
        @hanlde-subtopic-del="hanldeSubtopicDel"
        @topic-detail-add="topicDetailAdd"
        @change-space-value="ChangeSpaceValue"
        @hanlde-last-topic-del="hanldeLastTopicDel"
        @change-last-sub-topic-score="changeLastSubTopicScore"
      />
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="preCreateQuestion"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
import spaceQuestion from '../questionContent/Precautions/_spaceQuestion'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    spaceQuestion,
  },
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增填空题',
      spaceTopic: {
        number: 1,
        topic: '填空题',
        rows: 4,
        startQuestion: 1,
        group: [
          {
            start: 1,
            end: null,
            score: null,
            space: 1,
            id: 'spaceTopic',
            childGroup: [],
          },
        ],
      },
      closeData: {},
      errorVal: '',
      objectiveData: {},
      topicList: [],
      editQuestionId: null,
      ContentHeight: 0, // 内容高度
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'AlreadyTopics',
      'currentQuestion',
      'letterArr',
      'determineTopic',
    ]),
    ...mapState('pageContent', [
      'pageData',
      'pageLayout',
      'BigQuestion',
      'orderSort',
    ]),
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    topicGroupData () {
      let rows = this.objectiveData.rows
      let array = []

      this.objectiveData.group.map((item) => {
        array.push(...item.childGroup)
      })

      if (array.length > 0) {
        let temporaryArr = []
        let datas = []
        array.forEach((ele) => {

          if (ele.childGroup != undefined && ele.childGroup.length > 0) {
            ele.childGroup.forEach((row, index) => {
              for (let i = 1; i <= row.space; i++) {
                if (temporaryArr.length + 1 > rows) {
                  datas.push(temporaryArr)
                  temporaryArr = []
                  if (i == 1) {
                    temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
                  } else {
                    temporaryArr.push(row)
                  }
                } else {
                  if (i == 1) {
                    temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
                  } else {
                    temporaryArr.push(row)
                  }
                }
              }
            })
          } else {

            for (let i = 1; i <= ele.space; i++) {
              if (temporaryArr.length + 1 > rows) {
                datas.push(temporaryArr)
                temporaryArr = []
                if (i == 1) {
                  temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
                } else {
                  temporaryArr.push(ele)
                }
              } else {
                if (i == 1) {
                  temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
                } else {
                  temporaryArr.push(ele)
                }
              }
            }
          }
        })
        if (temporaryArr.length > 0) {
          datas.push(temporaryArr)
        }

        return datas
      } else {

        return []
      }
    },
  },
  watch: {
    spaceTopic: {
      immediate: true,
      handler () {
        this.objectiveData = {
          ...this.spaceTopic,
        }

        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.objectiveData.number = this.BigQuestion
          })
        }
      },
    },
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.spaceTopic))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('questionType', [
      'set_SubtitleNumber',
      'delete_SubtitleNumber',
      'set_currentQuestion',
      'set_closeFrame',
      'Add_AlreadyTopics', // 小题数组
      'del_AlreadyTopics', // 删除题组-小题
      'set_determineTopic', // 储存确定题型
      'Empty_AlreadyTopics', // 清空
      'Fullin_once_AlreadyTopics',
    ]),
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'set_objectiveData',
      'set_orderSort',
    ]),
    closeFrame () {
      // 关闭弹框
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame()
      this.openedFrame = false
      //--------------
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    opened () {
      this.spaceTopic = JSON.parse(JSON.stringify({ ...this.spaceTopic, start: this.currentQuestion }))
      this.spaceTopic.number = this.BigQuestion
      this.objectiveData.number = this.BigQuestion
      this.openedFrame = true
      this.set_currentQuestion()
      //-------------------打开
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (id) {
      let current = this.pageData.filter((item) => item.id === id)

      this.spaceTopic = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.openedFrame = true
      this.title = '编辑填空题'
      this.set_currentQuestion()
    },
    preCreateQuestion () {
      // 数据编辑完成添加至全局数组中---------------
      // 计算高度
      // console.log(this.topicGroupData)
      let height = this.topicGroupData.length * 45 + 17 + 32
      // 此题总分计算
      this.objectiveData.group.forEach((item) => {
        this.topicList.push(...item.childGroup)
      })

      let totalScore = 0

      this.topicList.map((item) => {
        totalScore += item.score
      })

      // 此题总分计算
      let obj = {
        heightTitle: 32,
        MarginHeight: 17,
        id: 'FillInTheBlank' + +new Date(),
        height: height, // 32标题高度
        questionType: 'FillInTheBlank',
        content: { ...this.objectiveData, totalScore: totalScore },
        order: this.orderSort,
        showData: this.topicGroupData,
        first: true,
        // 此题总分
      }
      // 小题数组追加至确定题型
      this.Add_AlreadyTopics(this.topicList)
      this.set_determineTopic(this.topicList)
      this.set_currentQuestion()

      if (this.editQuestionId == null) {
        this.initPageData(obj)
      } else {
        obj.id = this.editQuestionId
        this.amendPageData(obj)
      }
      this.set_objectiveData(this.spaceTopic.number) // 大题号修改
      //------------------------------------
      this.set_orderSort()
      this.openedFrame = false // 关闭弹窗


      //------------------------
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame() // 改变大题号
    },
    hanldeSelect (e) {
      // 选择答题号
      window.console.log(e)
    },
    traverse () { },
    HeightCalculation () {
      // 计算题型内容所占高度
    },
    hanldeStatus (val) {
      this.errorVal = val
    },
    hanldeAddGroupQuestion (obj) {
      //添加题组
      let group = this.spaceTopic.group
      const index = group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        group.splice(index, 1, obj) // 替换
        // 追曾小题号至数组
        let objs = { start: obj.start, end: obj.end, id: obj.id }
        this.set_SubtitleNumber(objs)
      }
    },
    hanldeDelGroup (id) {
      //删除题组
      let group = this.spaceTopic.group
      const index = group.findIndex((item) => item.id === id)
      if (index > -1) {
        let itemTopic = group[index]
        // 更改题型状态值

        this.del_AlreadyTopics(itemTopic.childGroup) // 删除弹框内临时数组
        group.splice(index, 1) // 删除
        this.delete_SubtitleNumber(id)

        this.$nextTick(() => {
          this.set_currentQuestion()
        })
      }
    },
    hanldeSubtopicDel (obj) {
      // 删除小题
      let dataObj = JSON.parse(JSON.stringify(this.spaceTopic))
      let group = dataObj.group
      const index = group.findIndex((item) => item.id === obj.pid)
      let groupObj = group[index]

      let arr = []
      for (let i = groupObj.start; i <= groupObj.end; i++) {
        arr.push(i)
      }
      let lastIndex = groupObj.childGroup.findIndex(
        (item) => item.id === obj.id
      )
      // console.log(obj)
      // console.log(index)
      // console.log(lastIndex)
      // console.log(arr)
      if (lastIndex > -1) {

        if (obj.topic == arr[0]) {
          // 判断点击的是否是首尾
          this.del_AlreadyTopics([groupObj.childGroup[index]])
          groupObj.childGroup.splice(lastIndex, 1)
          let objItem = {
            ...groupObj,
            start: groupObj.start + 1,
          }

          if (objItem.start > arr[arr.length - 1]) {
            group.splice(index, 1)
          } else {
            group.splice(index, 1, objItem)
          }
          this.spaceTopic = JSON.parse(JSON.stringify(dataObj))
        } else if (obj.topic == arr[arr.length - 1]) {
          this.del_AlreadyTopics([groupObj.childGroup[index]])
          groupObj.childGroup.splice(lastIndex, 1)
          let objItem = {
            ...groupObj,
            end: groupObj.end - 1,
          }
          if (objItem.start > arr[0]) {
            group.splice(index, 1)
          } else {
            group.splice(index, 1, objItem)
          }
          this.spaceTopic = JSON.parse(JSON.stringify(dataObj))
        } else {
          this.Fullin_once_AlreadyTopics(obj.pid) // 删除全部小题

          let SplitArray = this.SplitFunc(lastIndex, groupObj, arr)
          if (SplitArray.length > 0) {
            let itemArr = []
            SplitArray.forEach((item) => {
              if (item.childGroup != undefined) {
                itemArr.push(...item.childGroup)
              }
            })
            group.splice(index, 1) // 删除

            this.spaceTopic.group.splice(0,1, ...SplitArray)

          }
        }
      }
    },
    hanldeAddSubtopic () {
      //添加分段题组
      let obj = {
        start: this.currentQuestion,
        end: null,
        score: null,
        space: 1,
        id: `spaceTopic_${+new Date()}`,
        childGroup: [],
      }
      this.spaceTopic.group.push(obj)
      // console.log(this.objectiveData)
    },
    SplitFunc (index, groupObj, arr) {
      // 删除小题拆分数组 sub
      let arrObj = JSON.parse(JSON.stringify(arr)) // 赋值操作

      let FirstHalf = arr.splice(0, index) // 前半份
      let SecondHalf = arrObj.splice(index + 1, groupObj.end) // 后半份

      let SplitCombine = []
      SplitCombine.push(this.SplitArrObject(FirstHalf, groupObj))
      SplitCombine.push(this.SplitArrObject(SecondHalf, groupObj))
      // console.log(SplitCombine)
      return SplitCombine.sort((a, b) => {
        return a.start - b.start
      })
    },
    SplitArrObject (arrParameter, groupObj) {
      // 生成数组对象
      if (arrParameter.length > 0) {
        let arr = []
        let ids = 'spaceTopic_' + +new Date()
        arrParameter.forEach((item) => {
          arr.push({
            id: 'topic_' + +new Date() + item,
            pid: ids,
            start: arrParameter[0],
            end: arrParameter[arrParameter.length - 1],
            score: groupObj.score,
            space: groupObj.space,
            sum: groupObj.score * groupObj.space,
            topic: item,
            subtopic: 1,
            childGroup: [],
          })
        })
        let obj = {
          start: arrParameter[0],
          end: arrParameter[arrParameter.length - 1],
          id: ids,
          score: 1,
          space: 1,
          childGroup: arr,
        }
        // 弹框临时小题数
        this.Add_AlreadyTopics(arr)
        return obj
      } else {
        return {}
      }
    },
    topicDetailAdd (obj) {
      // 添加小题
      let group = this.spaceTopic.group
      const i = group.findIndex((item) => item.id === obj.pid)
      let questionArr = group[i]
      if (i > -1) {
        const index = questionArr.childGroup.findIndex(
          (row) => row.id === obj.id
        )
        let childItem = questionArr.childGroup[index]
        let changeItem = {}
        if (index > -1) {
          let subObj = {
            fid: childItem.pid,
            pid: childItem.id,
            id: 'subLastTopic_' + +new Date(),
            space: 1,
            sum: 1,
            score: 1,
            topic: childItem.topic,
          }
          if (childItem.childGroup != undefined) {
            changeItem = {
              ...childItem,
              space: childItem.space + 1,
              sum: childItem.score * (childItem.space + 1),
              childGroup: [
                ...childItem.childGroup,
                { ...subObj, id: 'subLastTopic_' + +new Date() },
              ],
            }
          } else {
            changeItem = {
              ...childItem,
              space: 1,
              sum: 1,
              childGroup: [{ ...subObj }],
            }
          }

          questionArr.childGroup.splice(index, 1, changeItem)
        }
      }
    },
    ChangeSpaceValue (obj) {
      // 分值分数修改
      // 添加小题空格数
      let group = this.spaceTopic.group
      const i = group.findIndex((item) => item.id === obj.pid)
      let questionArr = group[i]

      if (i > -1) {
        const index = questionArr.childGroup.findIndex(
          (row) => row.id === obj.id
        )
        if (index > -1) {
          let objItem = {
            ...obj,
            sum: obj.space * obj.score,
          }
          questionArr.childGroup.splice(index, 1, objItem)
        }
      }
    },
    hanldeLastTopicDel (obj) {
      // 删除小题last题组item
      let group = this.spaceTopic.group // 找到题组
      const i = group.findIndex((item) => item.id === obj.fid)
      let questionArr = group[i]
      if (i > -1) {
        // 找到小题
        const a = questionArr.childGroup.findIndex((row) => row.id === obj.pid)
        let topicGroupArr = questionArr.childGroup[a]
        if (a > -1) {
          // 找到小题题空

          const index = topicGroupArr.childGroup.findIndex(
            (row) => row.id === obj.id
          )
          let lastObj = topicGroupArr.childGroup[index]
          if (index > -1) {
            let subObj = {
              // 小题
              ...topicGroupArr,
              space: topicGroupArr.space - 1 < 0 ? 0 : topicGroupArr.space - 1,
              sum:
                topicGroupArr.sum - lastObj.space * lastObj.score < 0
                  ? 0
                  : topicGroupArr.sum - lastObj.space * lastObj.score,
            }
            questionArr.childGroup.splice(a, 1, subObj) // 替换被改变的小题

            topicGroupArr.childGroup.splice(index, 1)
          }
        }
      }
    },
    changeLastSubTopicScore (obj, oldObj) {
      // last-sub分值改变

      let group = this.spaceTopic.group

      let gid = obj.fid == undefined ? obj.pid : obj.fid
      let sid = obj.fid == undefined ? obj.id : obj.pid

      const i = group.findIndex((item) => item.id === gid)
      let questionArr = group[i]

      if (i > -1) {
        const a = questionArr.childGroup.findIndex((row) => row.id === sid)
        let subObj = questionArr.childGroup[a]
        if (a > -1) {
          if (obj.fid == undefined) {
            let sums = subObj.sum - oldObj.score + obj.score
            let last = { ...subObj, sum: sums }
            questionArr.childGroup.splice(a, 1, last)
          } else {
            const index = subObj.childGroup.findIndex(
              (row) => row.id === obj.id
            )
            let subLast = subObj.childGroup[index]
            if (index > -1) {
              let subLastSum = subLast.sum - oldObj.score + obj.score

              let subLastItem = { ...subLast, sum: subLastSum }
              subObj.childGroup.splice(a, 1, subLastItem)
            }
          }
        }
      }
    },
  },
}
</script>

<style lang="less">
.el-tabs__nav-wrap {
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #1ab394 !important;
}
</style>
