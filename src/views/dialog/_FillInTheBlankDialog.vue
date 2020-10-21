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
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="objectiveData.InsertTitle"
          >插入添加题目</el-checkbox
        >
        <div
          :class="[
            'existBigQuestion_style',
            { Fade: !objectiveData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="existBigQuestion"
            size="mini"
            :value="existNumber"
            @change="hanldeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !objectiveData.InsertTitle }]"
          v-model="objectiveData.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!objectiveData.InsertTitle"></div>
      </div>
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
  data() {
    return {
      openedFrame: false,
      existNumber: null,
      spaceTopic: {
        number: 0,
        topic: '填空题',
        rows: 4,
        startQuestion: 1,
        InsertTitle: false,
        Postpone: false,
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
      editQuestionId: null,
      ContentHeight: 0, // 内容高度
      options:[],
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'currentQuestion',
      'determineTopic',
      'existBigQuestion',
    ]),
    ...mapState('pageContent', [
      'pageData',
      'pageLayout',
      'BigQuestion',
      'orderSort',
    ]),
    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    topicGroupData() {
      let {rows,group} = this.objectiveData
      let array = []

      group.map((item) => {
        array.push(...item.childGroup)
      })

      if (array.length > 0) {
        let temporaryArr = []
        let datas = []
        array.forEach((ele) => {
          let { childGroup } = ele
          if (childGroup && childGroup.length > 0) {
            childGroup.forEach((row, index) => {
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

    childGroups(){
      return this.objectiveData.group.map(item => item.childGroup).flat()
    },

    isdisabledFn(){
      return  this.childGroups.length > 0 && !this.errorMessage ? false:true
    },

    title(){
      return !this.editQuestionId ? '新增填空题' : '编辑填空题'
    }
  },
  watch: {
    spaceTopic: {
      immediate: true,
      handler() {
        this.objectiveData = {
          ...this.spaceTopic,
        }

        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.objectiveData.number = this.BigQuestion
          })
          this.objectiveData.group.map((item) => {
            return {
              ...item,
              start: item.end == null ? this.currentQuestion : item.start,
            }
          })
          this.existNumber =
            this.existBigQuestion.length > 0
              ? this.existBigQuestion[0].value
              : null
        }
      },
    },

    questionNumber: {
      immediate: true,
      handler() {
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      }
    },

    childGroups:{
      immediate: true,
      handler(){
        this.Empty_AlreadyTopics()
        if(this.childGroups.length > 0){
          this.Add_AlreadyTopics(this.childGroups)
        }else{
          this.Add_AlreadyTopics(this.determineTopic)
        }
        this.set_currentQuestion()
      }
    }
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.spaceTopic))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Add_AlreadyTopics', // 小题数组
      'del_AlreadyTopics', // 删除题组-小题
      'set_determineTopic', // 储存确定题型
      'Empty_AlreadyTopics', // 清空
      'Fullin_once_AlreadyTopics',
      'delOnce_determineTopic',
      'set_existBigQuestion',
      'insert_existBigQuestion',
    ]),
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'insert_pageData',
      'set_objectiveData',
      'set_orderSort',
    ]),
    closeFrame() {
      // 关闭弹框
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      //--------------
      this.Empty_AlreadyTopics() // 清空临时小题group
      this.Add_AlreadyTopics(this.determineTopic)
    },
    opened() {
      this.spaceTopic = JSON.parse(
        JSON.stringify({ ...this.spaceTopic, number: this.BigQuestion })
      )

      this.openedFrame = true
      //-------------------打开
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
      this.set_currentQuestion()
    },
    openedEdit(id) {
      let current = this.pageData.filter((item) => item.id === id)

      this.spaceTopic = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.openedFrame = true
      this.set_currentQuestion()
    },
    preCreateQuestion() {
      // 数据编辑完成添加至全局数组中---------------
      // 计算高度
      let height = this.topicGroupData.length * 45 + 17 + 32
      // 此题总分计算
      const { topic, number, InsertTitle, Postpone } = this.objectiveData

      let totalScore = 0

      this.childGroups.map((item) => {
        totalScore += item.sum
      })
      let objId = `FillInTheBlank_${+new Date()}`
      // 此题总分计算
      let obj = {
        heightTitle: 32,
        MarginHeight: 17,
        id: objId,
        height: height, // 32标题高度
        rowHeight: 45,
        questionType: 'FillInTheBlank',
        content: { ...this.objectiveData, totalScore: totalScore },
        order: this.orderSort,
        showData: this.topicGroupData,
        first: true,
        // 此题总分
      }
      //存在大题追加
      let existBigQuestionObj = {
        id: objId,
        label: `${this.options[number].label}.${topic}`,
        value: number,
      }
      // 小题数组追加至确定题型
      this.set_currentQuestion()

      if (this.editQuestionId == null) {
        if (InsertTitle && this.existBigQuestion.length > 0) {
          let index = this.existBigQuestion.findIndex(
            (item) => item.value === this.existNumber
          )
          if (index > -1) {
            let data = {
              obj: {
                ...obj,
                order: this.pageData[index].order + 1,
              },
              num: this.existNumber + 1,
              order: this.pageData[index].order + 1,
              SelfO0rder: Postpone,
            }
            this.insert_pageData(data)

            this.insert_existBigQuestion({
              obj: {
                ...existBigQuestionObj,
                order: this.existBigQuestion[index].order + 1,
              },
              num: this.existNumber,
              order: this.existBigQuestion[index].order,
              SelfO0rder: Postpone,
            })
          }
        } else {
          this.initPageData(obj)
          this.set_existBigQuestion(existBigQuestionObj)
        }
        this.set_orderSort()
        this.set_objectiveData(this.spaceTopic.number) // 大题号修改
      } else {
        this.delOnce_determineTopic(this.childGroups[0].pid)
        obj.id = this.editQuestionId
        this.amendPageData(obj)
        this.set_existBigQuestion({ ...existBigQuestionObj, id: obj.id })
      }
      this.Add_AlreadyTopics(this.childGroups)
      this.set_determineTopic(this.childGroups)
      //------------------------------------
      this.openedFrame = false // 关闭弹窗

      //------------------------
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
    },
    hanldeSelect(e) {
      // 选择答题号
      this.spaceTopic.number = e
      this.objectiveData.number = e
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
    traverse() {},
    HeightCalculation() {
      // 计算题型内容所占高度
    },
    hanldeStatus(val) {
      this.errorVal = val
    },
    hanldeAddGroupQuestion(obj) {
      //添加题组
      let {group} = this.spaceTopic
      const index = group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        group.splice(index, 1, obj) // 替换
        // 追曾小题号至数组
      }
    },
    hanldeDelGroup(id) {
      //删除题组
      let {group} = this.spaceTopic
      const index = group.findIndex((item) => item.id === id)
      if (index > -1) {
        let itemTopic = group[index]
        // 更改题型状态值

        this.del_AlreadyTopics(itemTopic.childGroup) // 删除弹框内临时数组
        group.splice(index, 1) // 删除
        this.$nextTick(() => {
          this.set_currentQuestion()
        })
        this.errorVal = ''
      }
    },
    hanldeSubtopicDel(obj) {
      // 删除小题
      let dataObj = JSON.parse(JSON.stringify(this.spaceTopic))
      let {group} = dataObj
      const index = group.findIndex((item) => item.id === obj.pid)
      let groupObj = group[index]

      let arr = []
      for (let i = groupObj.start; i <= groupObj.end; i++) {
        arr.push(i)
      }
      let lastIndex = groupObj.childGroup.findIndex(
        (item) => item.id === obj.id
      )
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

            this.spaceTopic.group.splice(0, 1, ...SplitArray)
          }
        }
      }
    },
    hanldeAddSubtopic() {
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
    },
    SplitFunc(index, groupObj, arr) {
      // 删除小题拆分数组 sub
      let arrObj = JSON.parse(JSON.stringify(arr)) // 赋值操作

      let FirstHalf = arr.splice(0, index) // 前半份
      let SecondHalf = arrObj.splice(index + 1, groupObj.end) // 后半份

      let SplitCombine = []
      SplitCombine.push(this.SplitArrObject(FirstHalf, groupObj))
      SplitCombine.push(this.SplitArrObject(SecondHalf, groupObj))

      return SplitCombine.sort((a, b) => {
        return a.start - b.start
      })
    },
    SplitArrObject(arrParameter, groupObj) {
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
    topicDetailAdd(obj) {
      // 添加小题
      let {group} = this.spaceTopic
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
            id: 'subLastTopic_' + +new Date() + '_' + childItem.topic,
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
                { ...subObj, id: 'subLastTopic_' + +new Date() + '_' + childItem.topic },
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
    ChangeSpaceValue(obj) {
      // 分值分数修改
      // 添加小题空格数

      let {group} = this.spaceTopic
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
    hanldeLastTopicDel(obj) {
      // 删除小题last题组item
      let {group} = this.spaceTopic // 找到题组
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
    changeLastSubTopicScore(obj, oldObj) { // 改变分值
      // last-sub分值改变
      const {fid} = obj // ,pid,id
      let {group} = this.spaceTopic
      if(fid){

        let index = group.findIndex(group => group.id === obj.fid)
        if(index > -1){
          let subGroup = group[index].childGroup
          let subIndex = subGroup.findIndex(subObj => subObj.id === obj.pid)
          if(subIndex > -1){
            let lastGrop = subGroup[subIndex].childGroup
            let lastIndex = lastGrop.findIndex(lastObj => lastObj.id === obj.id)
            if(lastIndex > -1){
              lastGrop.splice(lastIndex, 1, {...obj,sum:obj.score,score:oldObj.score})
              // 计算小题下所有总分值
              const groupSum = lastGrop.reduce((acc,cur) => acc.sum + cur.sum)
              subGroup.splice(subIndex, 1, {...subGroup[index],sum:groupSum})

            }
          }
        }
      }else{
        let index = group.findIndex(group => group.id === obj.pid)
        if(index > -1){
          let subGroup = group[index].childGroup
          let subIndex = subGroup.findIndex(subObj => subObj.id === obj.id)
          if(subIndex > -1) {
            let iss = subGroup[subIndex].sum - oldObj.score + obj.score
            subGroup.splice(subIndex, 1, {...obj,sum:iss})
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
