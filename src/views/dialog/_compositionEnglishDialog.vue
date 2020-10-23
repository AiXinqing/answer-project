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
              @change="hanldeSelect"
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
            <el-input
              v-model.number="data.topic"
              @blur="hanldeVerification"
              size="mini"
              placeholder=""
            />
            <span>题</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">分数:</div>
            <el-input
              v-model.number="data.score"
              @blur="hanldeVerification"
              @input="hanldeRowsFunc"
              size="mini"
              placeholder=""
            />
            <span>分</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">作文行数:</div>
            <el-input
              v-model.number="data.rows"
              @blur="hanldeVerification"
              @input="hanldeRowsFunc"
              size="mini"
              placeholder=""
            />
            <span>行</span>
          </el-col>
        </el-row>
      </div>
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="data.InsertTitle">插入添加题目</el-checkbox>
        <div :class="['existquestionNumber_big_style', { Fade: !data.InsertTitle }]">
          <span>插入到第</span>
          <hj-select
            :items="existquestionNumber_big"
            size="mini"
            :value="existNumber"
            @change="hanldeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !data.InsertTitle }]"
          v-model="data.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!data.InsertTitle"></div>
      </div>
      <div class="error-message" v-if="errorMessage"><i></i>{{ errorVal }}</div>
    </div>
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
import { mapState, mapMutations } from 'vuex'

export default {
  components: {},
  data() {
    return {
      data: {},
      title: '设置',
      openedFrame: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      existNumber: null,
      questionData: {
        number: 1, // 大题号
        name: '作文',
        rows: 10,
        topic: 1,
        Attach: false,
        score: '',
        InsertTitle: false,
        Postpone: false,
      },
      editData: {},
      options:[],
      changeClick:false,
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'currentQuestion',
      'determineTopic',
      'existquestionNumber_big',
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'questionNumber_big',
      'questionOrder',
      'pageData',
      'pageLayout',
    ]),
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    groupItemData() {
      return this.data.group.map((item) => item.childGroup)[0]
    },
    isdisabledFn() {
      return !this.editQuestionId && !this.changeClick ?  true :
              this.changeClick && this.errorVal != '' ?  true :false
    },
    tabStatusVal() {
      const { topic, score, rows } = this.data
      let determineTopic = this.determineTopic
      let str = ''
      if (determineTopic.length > 0) {
        let index = determineTopic.findIndex((item) => item.topic == topic)
        if (index > -1) {
          if (
            this.editQuestionId != null &&
            this.editData.content.topic == this.data.topic
          ) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      }
      return score == ''
        ? '分数不能为空'
        : rows == ''
        ? '作文行数不能为空'
        : topic == ''
        ? '小题题号不能为空'
        : str != ''
        ? str
        : ''
    },
    tabStatus() {
      const { topic, score, rows } = this.data
      let determineTopic = this.determineTopic

      let str = ''
      if (determineTopic.length > 0) {
        let index = determineTopic.findIndex((item) => item.topic == topic)
        if (index > -1) {
          if (
            this.editQuestionId != null &&
            this.editData.content.topic == this.data.topic
          ) {
            str = ''
          } else {
            str = `${topic}题已经存在，请勿重复添加`
          }
        }
      }
      return score == ''? true :
              rows == ''? true :
                topic == ''? true:
                str != ''? true: false
    },
    currentPageHeight() {
      let heights = this.pageHeight[this.pageHeight.length - 1]
        .map((item) => item)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })

      let currentPageHeight = this.page_size - heights - 32 // 当前页剩余可用高度
      return currentPageHeight
    },
    BeforeEditing() {
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
      handler() {
        this.data = {
          ...this.questionData,
        }
        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.data = {
              ...this.data,
              number: this.questionNumber_big,
              topic: this.currentQuestion,
            }
          })
        }
        this.existNumber =
          this.existquestionNumber_big.length > 0
            ? this.existquestionNumber_big[0].value
            : null
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      },
    },
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('pageContent', [
      'pageData_add',
      'pageData_edit',
      'pageData_insert',
      'pageData_id_clean',
      'questionOrder_add',
      'questionNumber_big_add'
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_determineTopic',
      'set_existquestionNumber_big',
      'insert_existquestionNumber_big',
    ]),
    opened() {
      this.questionData = JSON.parse(
        JSON.stringify({
          ...this.questionData,
          number: this.questionNumber_big,
          topic: this.currentQuestion,
        })
      )

      // 开打弹框
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
      this.set_currentQuestion()
    },
    openedEdit(obj) {
      this.editData = JSON.parse(JSON.stringify(obj))
      //编辑弹框
      this.set_currentQuestion()
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj.content))
      this.title = '编辑作文'
    },
    closeFrame() {
      // 关闭弹窗
      this.set_currentQuestion()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.Empty_AlreadyTopics() // 清空
    },

    preCreateQuestion() {
      const { rows, InsertTitle, Postpone,number,name ,score} = this.data
      this.errorVal = this.tabStatusVal

      let rectHeight = rows * 35 // 当前内容高度 45(内部高度)
      let MarginHeight = +17
      let heights = rectHeight + MarginHeight + 33
      if (!this.tabStatus) {
        let objId = `compositionEnglish_${+new Date()}`
        //------------------------------------------------------------
        let obj = {
          heightTitle: 32,
          MarginHeight: MarginHeight,
          height: heights,
          rowHeight: 36,
          id: objId,
          questionType: 'compositionEnglish',
          content: {
            ...this.data,
            scoreTotal:parseFloat(score),
            pageLayout:this.pageLayout,
          },
          order: this.questionOrder,
          first: true,
          BeforeEditing:
            this.editQuestionId != null
              ? this.editData.BeforeEditing
              : this.BeforeEditing,
        }
        this.Add_AlreadyTopics([this.data])
        //存在大题追加
        let existquestionNumber_bigObj = {
          id: objId,
          label: `${this.options[number].label}.${name}`,
          value: number,
          order: this.questionOrder,
        }

        if (this.editQuestionId == null) {
          if (InsertTitle && this.existquestionNumber_big.length > 0) {
            let index = this.existquestionNumber_big.findIndex(
              (item) => item.value === this.existNumber
            )
            if (index > -1) {
              let objIndex = this.pageData.findIndex(
                (item) => item.id == this.existquestionNumber_big[index].id
              )
              if (objIndex > -1) {
                let data = {
                  obj: {
                    ...obj,
                    order: this.pageData[index].order + 1,
                  },
                  num: this.existNumber + 1,
                  order: this.pageData[index].order + 1,
                  SelfOrder: Postpone,
                }
                this.pageData_insert(data)
                //-------------------------------------------------已选大题数组
                this.insert_existquestionNumber_big({
                  obj: {
                    ...existquestionNumber_bigObj,
                    order: this.existquestionNumber_big[index].order + 1,
                  },
                  num: this.existNumber,
                  order: this.existquestionNumber_big[index].order,
                  SelfOrder: Postpone,
                })
              }
            }
          } else {
            this.pageData_add(obj)
            this.set_existquestionNumber_big(existquestionNumber_bigObj)
          }
          this.set_determineTopic([this.data])
          this.questionOrder_add()
          // 大题号修改
          this.questionNumber_big_add(number)
        } else {
          this.pageData_edit({ ...obj, id: this.editQuestionId })
          this.set_existquestionNumber_big({ ...existquestionNumber_bigObj, id: obj.id })
        }

        this.set_currentQuestion()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
      }
    },
    hanldeRowsFunc() {
      const { rows, score } = this.data
      if (rows <= 0) {
        this.errorVal = '作文行数必须大于0'
      } else if (score <= 0) {
        this.errorVal = '分数必须大于0'
      } else {
        this.errorVal = ''
      }
    },
    hanldeVerification() {
      this.changeClick = true
      this.errorVal = this.tabStatusVal
    },
    hanldeSelect(e) {
      // 选择答题号
      this.questionData.number = e
      this.data.number = e
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
  },
}
</script>

<style lang="less">
.composition_box {
  .el-dialog__body {
    padding: 10px 0 15px !important;
  }
  .Insert_box {
    margin-top: 20px;
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
    padding: 0 0;
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
