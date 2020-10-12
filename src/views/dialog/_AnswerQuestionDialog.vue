<template>
<!-- 填空题 -->
  <hj-dialog
    class="newAdd-content answer_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box ">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="dataTopic.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="dataTopic.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <add-form
        v-for="(item,i) in dataTopic.group"
        :key="i"
        :form-data="item"
        @hanlde-status="hanldeStatus"
        @add-answer-topic-group="addAnswerTopicGroup"
      />
      <div class="question-group">
        <el-collapse >

          <answer-item
            v-for="(item,i) in childGroups"
            :key="i"
            :child-data="item"
            @pre-edit-sub-answer-item="preEditSubAnswerItem"
            @pre-edit-last-answer-item="preEditLastAnswerItem"
            @pre-edit-points-answer-group="preEditPointsAnswerGroup"
            @pre-edit-points-item="preEditPointsItem"
          />
        </el-collapse>
      </div>
      <div class="condition_box">
        <el-checkbox v-model="dataTopic.ShowScore">小题显示分数</el-checkbox>
        <el-checkbox v-model="dataTopic.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="dataTopic.HorizontalLine">
          <span>行数：</span>
          <el-input v-model.number="dataTopic.rows" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
          <span class="p-5"> 行 </span>
        </span>
      </div>
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="dataTopic.InsertTitle">插入添加题目</el-checkbox>
        <div
          :class="['existBigQuestion_style',{'Fade':!dataTopic.InsertTitle}]">
          <span>插入到第</span>
          <hj-select
              :items="existBigQuestion"
              size="mini"
              :value="existNumber"
              @change="hanldeSelectexistBig" />
          <span>大题后</span>
        </div>
        <el-checkbox :class="['Postpone',{'Fade':!dataTopic.InsertTitle}]" v-model="dataTopic.Postpone">大题号自动顺延</el-checkbox>
        <div class="Insert_Mask" v-show="!dataTopic.InsertTitle"></div>
      </div>

    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import AddForm from '../questionContent/Precautions/answer/_index'
import answerItem from '../questionContent/Precautions/answer/_item'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    AddForm,
    answerItem
  },
  data () {
    return {
      dataTopic: {},
      closeData: {},
      editQuestionId: null,
      openedFrame: false,
      isdisabledFn: false,
      errorVal: '',
      existNumber: null,
      questionData: {
        number: 1,
        topic: '解答题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        ShowScore: true, // 显示分数
        InsertTitle: false,
        Postpone: false,
        group: [{
          start: 1,
          end: null,
          score: 1,
          space: 1,
          id: 'answerTopic',
          childGroup: [],
        },]
      }
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'currentQuestion',
      'determineTopic',
      'existBigQuestion',
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'BigQuestion',
      'orderSort',
    ]),
    ...mapState('answerQuestion', ['answerQuestionArr',]),

    title(){
      return !this.editQuestionId ? '编辑解答题': '新增解答题'
    },

    childGroups () {
      let Arr = []
      this.dataTopic.group.forEach(item => {
        Arr.push(...item.childGroup)
      })
      return Arr
    },
    capitalTopicNum () {
      let index = this.options.findIndex(item => this.dataTopic.number == item.value)
      if (index > -1) {
        return this.options[index].label
      } else {
        return '一'
      }
    },
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    RefactorData () {
      let group = this.questionData.group
      let itemArr = []
      group.forEach(item => {
        if (item.childGroup.length > 0) {

          let subItem = item.childGroup

          subItem.forEach(subEle => {
            if (subEle.childGroup.length > 0) {

              let lastItem = subEle.childGroup

              lastItem.forEach(lastEle => {

                if (lastEle.childGroup.length > 0) {

                  let pointsItem = lastEle.childGroup

                  pointsItem.forEach(ele => {

                    if (ele.childGroup > 0) {
                      ele.childGroup.forEach(eleItem => {
                        itemArr.push(eleItem)
                      })
                    } else {
                      itemArr.push(ele)
                    }

                  })

                } else {
                  itemArr.push(lastEle)
                }

              })

            } else {
              itemArr.push(subEle)
            }

          })

        } else {
          itemArr.push(item)
        }
      })
      console.log(itemArr)
      return itemArr
    },
    topicList () {
      let Arr = [...this.dataTopic.group.map(item => item.childGroup)]
      return Arr
    },
    totalScore () {
      return this.topicList[0].map(item => item.score).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    }
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.set_currentQuestion()
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.dataTopic = {
          ...this.questionData
        }

        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.dataTopic = {
              ...this.dataTopic,
              number: this.BigQuestion
            }
          })
          this.existNumber = this.existBigQuestion.length > 0 ? this.existBigQuestion[0].value : null
        }
      }
    },
  },
  methods: {
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'insert_pageData',
      'set_objectiveData',
      'deletePageData',
      'set_orderSort',
      'del_orderSort'
    ]),
    ...mapMutations('questionType', [
      'set_AlreadyTopics',
      'set_currentQuestion',
      'set_determineTopic',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_existBigQuestion',
      'insert_existBigQuestion',
    ]),
    ...mapMutations('answerQuestion', ['set_answerQuestionArr',]),
    opened () {
      // 开打弹框
      this.questionData.number = this.BigQuestion
      this.dataTopic.number = this.BigQuestion

      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (obj) {
      //编辑弹框
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.questionData = JSON.parse(JSON.stringify(obj.content))
      this.set_currentQuestion()
    },
    closeFrame () {
      // 关闭弹窗
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    preCreateQuestion () {
      const { InsertTitle, Postpone } = this.dataTopic
      //确定信息
      let Arr = []
      let objId = `answer_${+new Date()}`
      let rectHeight = this.dataTopic.rows * 35 + 12 + 20 // 小题初始高度
      let orders = this.orderSort - 1 // 题型排序序列号
      this.RefactorData.forEach((item, index) => {
        orders += 1
        let obj = {
          heightTitle: index == 0 ? 32 : 0,
          height: index == 0 ? rectHeight + 32 : rectHeight,
          MarginHeight: 12,
          ...item,
          content: this.dataTopic,
          first: index === 0 ? true : false,
          questionType: 'answerQuestion',
          objId: objId,
          row:this.dataTopic.rows,
          rowHeight:35,
          order: orders,
          totalScore:++item.score
        }
        Arr.push(obj)
        this.set_orderSort()
      })

      //存在大题追加
      let existBigQuestionObj = {
        id: objId,
        label: `${this.capitalTopicNum}.${this.dataTopic.topic}`,
        value: this.dataTopic.number
      }

      if (this.editQuestionId == null) {
        // 新增
        if(InsertTitle && this.existBigQuestion.length > 0){

          let index = this.existBigQuestion.findIndex(
            (item) => item.value === this.existNumber
          )


          if(index > -1){
            let existNum = this.existNumber - 1
            let orders = this.existBigQuestion[index].order - 1
            Arr.forEach((obj,index) => {
              existNum += 1
              orders += 1
              let data = {
                obj: {
                  ...obj,
                  order: orders,
                },
                num: existNum,
                order: orders,
                SelfO0rder: Postpone,
              }
              this.insert_pageData(data)

              if(index === 0){
                this.insert_existBigQuestion({
                  obj: {
                    ...existBigQuestionObj,
                    order: orders,
                  },
                  num: existNum,
                  order: this.existBigQuestion[index].order,
                  SelfO0rder: Postpone,
                })
              }

            })
          }
        } else {
          Arr.forEach(obj => {
            this.initPageData(obj)
          })
          this.set_existBigQuestion(existBigQuestionObj)
        }

      } else {
        // 编辑

      }

      // 大题号修改
      this.set_objectiveData(this.dataTopic.number)
      //------------------------------------

      this.openedFrame = false // 关闭弹窗
      this.set_determineTopic(this.topicList)
      this.set_currentQuestion()
      // 清空弹框数据
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
    },
    hanldeStatus (val) {
      this.errorVal = val
    },
    addAnswerTopicGroup (obj) {
      // 新增题组数据
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.id)
      if (index > -1) {
        group.splice(index, 1, obj)
      }

    },
    preEditSubAnswerItem (obj, isDel = false) {
      // 新增题组数据
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.pid)
      if (index > -1) {
        let subItem = group[index]
        let itemIndex = subItem.childGroup.findIndex(item => item.id == obj.id)

        if (itemIndex > -1) {
          if (isDel) {
            subItem.childGroup.splice(itemIndex, 1)
          } else {
            subItem.childGroup.splice(itemIndex, 1, obj)
            // 改变分数值
            subItem.childGroup[itemIndex].score = this.calculateTheScore(subItem.childGroup[itemIndex])
          }

        }
      }
    },
    preEditLastAnswerItem (obj, isDel = false) {
      // 新增小题
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.fid)
      if (index > -1) {
        let items = group[index]
        let itemsIndex = items.childGroup.findIndex(item => item.id == obj.pid)

        if (itemsIndex > -1) {

          let subItems = items.childGroup[itemsIndex] // 当前小题
          let subItemIndex = subItems.childGroup.findIndex(item => item.id == obj.id)

          if (subItemIndex > -1) {
            if (isDel) {
              subItems.childGroup.splice(subItemIndex, 1)
            } else {
              subItems.childGroup.splice(subItemIndex, 1, obj)

              let lastItem = subItems.childGroup[index]
              // 更改分值
              lastItem.score = this.calculateTheScore(lastItem)
              this.$nextTick(() => {
                subItems.score = this.calculateTheScore(subItems)
              })
            }
            this.set_AlreadyTopics([subItems]) // 更新临时数组

          }
        }
      }
    },
    preEditPointsAnswerGroup (obj, isDel = false) {
      // 添加小题下的小题

      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.sid)
      if (index > -1) {
        let items = group[index]
        let itemsIndex = items.childGroup.findIndex(item => item.id == obj.fid)
        if (itemsIndex > -1) {
          let subItems = items.childGroup[itemsIndex]
          let subItemIndex = subItems.childGroup.findIndex(item => item.id == obj.pid)

          if (subItemIndex > -1) {
            let lastItem = subItems.childGroup[subItemIndex]
            let lastIndex = lastItem.childGroup.findIndex(item => item.id == obj.id)
            if (lastIndex > -1) {
              if (isDel) {
                lastItem.childGroup.splice(lastIndex, 1)
              } else {
                lastItem.childGroup.splice(lastIndex, 1, obj)

                // 更改分值
                subItems.score = this.calculateTheScore(subItems)
                lastItem.score = this.calculateTheScore(lastItem)
                this.$nextTick(() => {
                  subItems.score = this.calculateTheScore(subItems)
                })
              }


              this.set_AlreadyTopics([subItems]) // 更新临时数组
            }

          }
        }
      }
    },
    preEditPointsItem (obj, isDel = false) {
      // 末尾题
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.spId)
      if (index > -1) {
        let items = group[index]
        let itemsIndex = items.childGroup.findIndex(item => item.id == obj.sid)
        if (itemsIndex > -1) {
          let subItems = items.childGroup[itemsIndex]
          let subItemIndex = subItems.childGroup.findIndex(item => item.id == obj.fid)

          if (subItemIndex > -1) {
            let lastItem = subItems.childGroup[subItemIndex]
            let lastIndex = lastItem.childGroup.findIndex(item => item.id == obj.pid)
            if (lastIndex > -1) {
              let pointsItem = lastItem.childGroup[subItemIndex]
              let pointsIndex = pointsItem.childGroup.findIndex(item => item.id == obj.id)
              if (pointsIndex > -1) {
                if (isDel) {
                  pointsItem.childGroup.splice(pointsIndex, 1)
                } else {
                  pointsItem.childGroup.splice(pointsIndex, 1, obj)

                  // 更改分值
                  pointsItem.score = this.calculateTheScore(pointsItem)
                  subItems.score = this.calculateTheScore(subItems)
                  lastItem.score = this.calculateTheScore(lastItem)
                  this.$nextTick(() => {
                    subItems.score = this.calculateTheScore(subItems)
                  })
                }
                this.set_AlreadyTopics([subItems]) // 更新临时数组
              }

            }

          }
        }
      }
    },
    calculateTheScore (obj) {
      let sum = 0
      obj.childGroup.forEach(item => {
        sum += item.score
      })
      return sum
    },
    hanldeSelect (e) {
      // 选择答题号
      this.questionData.number = e
      this.dataTopic.number = e
    },
    hanldeSelectexistBig (e) {
      this.existNumber = e
    },
  },
}
</script>

<style lang="less" >
.answer_box {
  .select-item:last-child {
    margin-top: 0;
  }
  .big-item .el-input--mini {
    width: 68px;
  }
  .big-item input {
    width: 68px;
    margin-top: 10px;
    text-align: center;
  }
  .condition_box {
    margin-top: 15px;
  }
  .big-item {
    span {
      top: 15px;
    }
  }
  .p-5 {
    padding: 0 5px;
  }
  .answer_rows {
    display: inline-block;
    width: 140px;
    position: absolute;
    margin-top: -3px;
    margin-left: 40px;
    .el-input,
    input {
      width: 48px;
    }
  }
  .error-message {
    margin-top: 10px;
    text-indent: 0;
  }
}
</style>


