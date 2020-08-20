<template>
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
      title: '新增解答题',
      editQuestionId: null,
      openedFrame: false,
      isdisabledFn: false,
      errorVal: '',
      questionData: {
        number: 1,
        topic: '解答题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        ShowScore: true, // 显示分数
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
      'AlreadyTopics',
      'currentQuestion',
      'letterArr',
      'determineTopic'
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'BigQuestion'
    ]),
    ...mapState('answerQuestion', ['answerQuestionArr',]),
    childGroups () {
      let Arr = []
      this.dataTopic.group.forEach(item => {
        Arr.push(...item.childGroup)
      })
      return Arr
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
            this.dataTopic.number = this.BigQuestion
          })
        }
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'set_objectiveData',
      'deletePageData'
    ]),
    ...mapMutations('questionType', [
      'set_AlreadyTopics',
      'del_AlreadyTopics',
      'set_currentQuestion',
      'set_closeFrame',
      'set_determineTopic',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
    ]),
    ...mapMutations('answerQuestion', ['set_answerQuestionArr',]),
    opened () {
      // 开打弹框
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (obj) {
      //编辑弹框
      this.editQuestionId = obj.pid
      this.openedFrame = true
      let index = this.answerQuestionArr.findIndex(itme => itme.pid === obj.pid)
      if (index > -1) {
        this.questionData = JSON.parse(JSON.stringify(this.answerQuestionArr[index]))
      }
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    closeFrame () {
      // 关闭弹窗
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    preCreateQuestion () {
      //确定信息
      // 当前页内容所占高度
      let heights = this.pageHeight[this.pageHeight.length - 1].map(item => item).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      })
      let currentPageHeight = this.page_size - heights - 20 - 20 // 20当前大题下移的20，32标题高度
      let Arr = []
      let date = +new Date()
      let rectHeight = this.dataTopic.rows * 35 + 10 // 小题初始高度

      this.RefactorData.forEach((item, index) => {
        // 计算解答题生成的答题框，获取当页高度和所占高度，每个答题框
        // 当前页面剩余高度-当前解答题框
        currentPageHeight -= rectHeight
        let obj = {
          height: rectHeight,
          id: `answer${+new Date()}_${index}`,
          pid: `answer${date}`,
          questionType: 'answerQuestion',
          content: {}
        }
        if (index == 0) {
          obj = {
            ...obj,
            first: true,
            content: {
              ...this.dataTopic,
              totalScore: this.totalScore,
              group: { ...item }
            }
          }
        } else {
          obj = {
            ...obj,
            first: false,
            content: {
              ...this.dataTopic,
              group: { ...item }
            }
          }
        }

        // console.log(currentPageHeight)
        // console.log(item)

        if (currentPageHeight >= rectHeight) {
          Arr.push(obj)
        } else {
          // 超出高度部分拆分成两个对象，分上下部分
          if (currentPageHeight >= 52) {
            let difference = Math.abs(rectHeight - currentPageHeight) // 差值
            let preObj = { // 上半部分
              ...obj,
              height: currentPageHeight
            }
            let nextObj = { // 下半部分
              ...obj,
              height: difference,
              top: 20,
              content: { ...obj.content, group: {} }
            }
            Arr.push(preObj, nextObj)

            currentPageHeight = this.page_size - difference - 20
          } else {
            Arr.push(obj)
          }
        }
      })
      //----------
      if (this.editQuestionId == null) {
        // 新增
        Arr.forEach(obj => {
          this.initPageData(obj)
        })
      } else {
        // 编辑
        //清空编辑前数据
        this.deletePageData(this.dataTopic.pid)
        Arr.forEach(obj => {
          this.initPageData(obj)
        })
      }
      // 解答题-编辑时使用数据
      this.set_answerQuestionArr({ ...this.questionData, pid: `answer${date}` })
      // 大题号修改
      this.set_objectiveData(this.dataTopic.number)
      //------------------------------------
      this.openedFrame = false // 关闭弹窗
      this.set_determineTopic(this.topicList)
      this.set_currentQuestion()
      // 清空弹框数据
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame() // 弹窗关闭置空

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


