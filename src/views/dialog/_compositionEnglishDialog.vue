<template>
<!-- 作文英 -->
  <hj-dialog
    class="newAdd-content composition_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="dialog_content">

      <div class="item-box ">
        <el-row>
          <el-col :span="10" class="select-item">
            <div class="label">大题题号:</div>
            <hj-select
              :items="options"
              size="mini"
              :value="data.number"

            ></hj-select>
          </el-col>
          <el-col :span="8" class="select-item composition_item">
            <div class="label">题目:</div>
            <el-input v-model="data.name" size="mini" placeholder=""></el-input>
          </el-col>
          <el-col :span="4" class="select-item composition_item_5">
            <el-checkbox v-model="data.Attach">附加题</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div class="item-box">
        <el-row>
          <el-col :span="12" class="select-item composition_topic">
            <div class="label">小题题号:</div>
            <el-input v-model.number="data.topic" @blur="hanldeVerification" size="mini" placeholder="" />
            <span>题</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">分数:</div>
            <el-input v-model.number="data.score" @blur="hanldeVerification" @input="hanldeRowsFunc" size="mini" placeholder="" />
            <span>分</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">作文行数:</div>
            <el-input v-model.number="data.rows" @blur="hanldeVerification" @input="hanldeRowsFunc" size="mini" placeholder="" />
            <span>行</span>
          </el-col>
        </el-row>
      </div>
      <div class="error-message" v-if="errorMessage"><i></i>{{ errorVal }}</div>
    </div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>

import { mapState, mapMutations } from 'vuex'

export default {
  components: {

  },
  data () {
    return {
      data: {},
      title: '设置',
      openedFrame: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      questionData: {
        number: 1, // 大题号
        name: '作文',
        rows: 10,
        topic: 1,
        Attach: false,
        score: '',
      },
      editData: {}
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'currentQuestion',
      'determineTopic'
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'BigQuestion',
      'orderSort',
    ]),
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    groupItemData () {
      return this.data.group.map(item => item.childGroup)[0]
    },
    isdisabledFn () {
      return this.errorVal != '' ? true : false
    },
    tabStatusVal () {
      const { topic, score, rows } = this.data
      let determineTopic = this.determineTopic
      let str = ''
      if (determineTopic.length > 0) {

        let index = determineTopic.findIndex(item => item.topic == topic)
        if (index > -1) {
          if (this.editQuestionId != null && this.editData.content.topic == this.data.topic) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      }
      return score == '' ? '分数不能为空' :
        rows == '' ? '作文行数不能为空' :
          topic == '' ? '小题题号不能为空' :
            str != '' ? str : ''
    },
    tabStatus () {
      const { topic, score, rows } = this.data
      let determineTopic = this.determineTopic

      let str = ''
      if (determineTopic.length > 0) {

        let index = determineTopic.findIndex(item => item.topic == topic)
        if (index > -1) {
          if (this.editQuestionId != null && this.editData.content.topic == this.data.topic) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      }
      return score == '' ? true :
        rows == '' ? true :
          topic == '' ? true :
            str != '' ? true : false
    },
    currentPageHeight () {

      let heights = this.pageHeight[this.pageHeight.length - 1].map(item => item).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      })

      let currentPageHeight = this.page_size - heights - 32 // 当前页剩余可用高度
      return currentPageHeight
    },
    BeforeEditing () {
      let num = 0
      if (this.editQuestionId == null) {
        num = this.currentPageHeight
      }
      return num
    },
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.data = {
              ...this.data,
              number: this.BigQuestion,
              topic: this.currentQuestion
            }
          })
        }

      }
    }
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'Empty_PageData',
      'set_orderSort',
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_determineTopic',
    ]),
    opened () {
      this.questionData.number = this.BigQuestion
      this.data.number = this.BigQuestion
      // 开打弹框
      this.set_currentQuestion()
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (obj) {
      this.editData = JSON.parse(JSON.stringify(obj))
      //编辑弹框
      this.set_currentQuestion()
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj.content))
      this.title = '编辑作文'
    },
    closeFrame () {
      // 关闭弹窗
      this.set_currentQuestion()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },

    preCreateQuestion () {
      const { rows } = this.data
      this.errorVal = this.tabStatusVal

      let rectHeight = rows * 35  // 当前内容高度 45(内部高度)
      let MarginHeight = + 17
      let heights = rectHeight + MarginHeight + 33
      if (!this.tabStatus) {
        let objId = `compositionEnglish_${+new Date()}`
        //------------------------------------------------------------
        let obj = {
          heightTitle: 32,
          MarginHeight: MarginHeight,
          height: heights,
          id: objId,
          questionType: 'compositionEnglish',
          content: this.data,
          order: this.orderSort,
          first: true,
          BeforeEditing: this.editQuestionId != null ? this.editData.BeforeEditing : this.BeforeEditing
        }

        if (this.editQuestionId == null) {
          this.initPageData(obj)
          this.Add_AlreadyTopics([this.data])
          this.set_determineTopic([this.data])
        } else {
          this.amendPageData({ ...obj, id: this.editQuestionId })
        }

        this.set_currentQuestion()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
      }

    },
    hanldeRowsFunc () {
      const { rows, score } = this.data
      if (rows <= 0) {
        this.errorVal = '作文行数必须大于0'
      } else if (score <= 0) {
        this.errorVal = '分数必须大于0'
      } else {
        this.errorVal = ''
      }
    },
    hanldeVerification () {
      this.errorVal = this.tabStatusVal
    }
  },
}
</script>

<style lang="less" >
.composition_box {
  .el-dialog__body {
    padding: 10px 0 15px !important;
  }
  .dialog_content {
    border-bottom: 1px solid #eee;
    padding: 0 20px 30px;
  }
  .select-item .label {
    width: 85px;
    line-height: 28px;
    top: 0;
  }
  .dialog-footer {
    padding-top: 15px;
    padding-right: 20px;
  }
  .item-box:nth-child(n + 2) {
    .el-row {
      margin-top: 20px;
      span {
        line-height: 28px;
        padding-left: 10px;
      }
    }
  }
  .select-item:last-child {
    margin-top: 0;
  }
  .composition_item {
    margin-left: 35px;
  }
  .composition_item_5 {
    margin-left: 11px;
    line-height: 28px;
  }
  .composition_topic {
    .el-input.el-input--mini {
      width: 68px;
    }
    .el-input--mini .el-input__inner {
      width: 68px;
      text-align: center;
    }
  }
  .el-input--mini .el-input__inner {
    text-align: center;
  }
  .el-radio__inner {
    margin-left: -10px;
  }
  .error-message {
    margin-top: 15px;
    margin-left: -17px;
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: red;
      position: relative;
      left: -10px;
    }
  }
}
</style>


