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
            @add-sub-answer-item="addSubAnswerItem"
            @add-last-answer-item="addLastAnswerItem"
            @add-points-answer-group="addPointsAnswerGroup"
          />
        </el-collapse>
      </div>
      <div class="condition_box">
        <el-checkbox v-model="ShowScore">小题显示分数</el-checkbox>
        <el-checkbox v-model="HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="ShowScore">
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
// import spaceQuestion from '../questionContent/Precautions/_spaceQuestion'
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
      openedFrame: false,
      isdisabledFn: false,
      errorVal: '',
      HorizontalLine: false, // 横行
      ShowScore: false, // 显示分数
      questionData: {
        number: 1,
        topic: '解答题',
        rows: 6,
        startQuestion: 1,
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
  },
  mounted () {
    this.closeData = []
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.dataTopic = {
          ...this.questionData
        }
        if (this.dataTopic != null) {
          this.dataTopic.number = this.BigQuestion
        }
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', ['initPageData', 'amendPageData', 'set_objectiveData',]),
    ...mapMutations('questionType', [
      'set_AlreadyTopics'
    ]),
    opened () {
      // 开打弹框
      this.openedFrame = true
    },
    openedEdit (id) {
      //编辑弹框
      this.openedFrame = true
      console.log(id)
    },
    closeFrame () {
      // 关闭弹窗
      this.openedFrame = false
    },
    preCreateQuestion () {
      //确定信息
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
    addSubAnswerItem (obj) {
      // 新增题组数据
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.pid)
      if (index > -1) {
        let subItem = group[index]
        let itemIndex = subItem.childGroup.findIndex(item => item.id == obj.id)

        if (itemIndex > -1) {
          subItem.childGroup.splice(itemIndex, 1, obj)
          // 改变分数值
          subItem.childGroup[itemIndex].score = this.calculateTheScore(subItem.childGroup[itemIndex])

        }
      }
    },
    addLastAnswerItem (obj) {
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

            subItems.childGroup.splice(subItemIndex, 1, obj)

            let lastItem = subItems.childGroup[index]
            // 更改分值
            lastItem.score = this.calculateTheScore(lastItem)
            this.$nextTick(() => {
              subItems.score = this.calculateTheScore(subItems)
            })



            this.set_AlreadyTopics([subItems]) // 更新临时数组
          }
        }
      }
    },
    addPointsAnswerGroup (obj) {
      // 添加小题下的小题
      // console.log(obj)
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
              lastItem.childGroup.splice(lastIndex, 1, obj)

              // 更改分值
              subItems.score = this.calculateTheScore(subItems)
              lastItem.score = this.calculateTheScore(lastItem)
              this.$nextTick(() => {
                subItems.score = this.calculateTheScore(subItems)
              })

              this.set_AlreadyTopics([subItems]) // 更新临时数组
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
    }
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


