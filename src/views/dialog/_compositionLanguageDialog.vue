<template>
  <!-- 作文语文 -->
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
            <el-input
              v-model="data.topic"
              size="mini"
              placeholder=""
            ></el-input>
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
              size="mini"
              @blur="hanldeVerification"
              placeholder=""
            />
            <span>题</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">分数:</div>
            <el-input
              v-model="data.score"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
              placeholder=""
            />
            <span>分</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">字数最少:</div>
            <el-input
              v-model="data.minWordCount"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
              placeholder=""
            />
            <span>字</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="select-item">
            <div class="label">字数标记:</div>
            <el-radio v-model="data.mark" label="1"
              >最少字数处显示一个字数标记</el-radio
            >
            <el-radio v-model="data.mark" label="2"
              >每100字显示一个字数标记</el-radio
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="select-item">
            <div class="label">总字数:</div>
            <el-input
              v-model.number="data.totalWordCount"
              @input="hanldeRowsFunc"
              @blur="hanldeVerification"
              size="mini"
              placeholder=""
            />
            <span>字</span>
          </el-col>
        </el-row>
      </div>
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="data.InsertTitle">插入添加题目</el-checkbox>
        <div :class="['existBigQuestion_style', { Fade: !data.InsertTitle }]">
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
          :class="['Postpone', { Fade: !data.InsertTitle }]"
          v-model="data.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!data.InsertTitle"></div>
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
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
        name: '作文', // 题目
        Attach: false,
        topic: 1,
        score: '',
        minWordCount: 800,
        mark: '1', // 1 ，2
        totalWordCount: 1000,
        spacing: 4, // 间距
        InsertTitle: false,
        Postpone: false,
      },
      editData: {},
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
      'pageLayout',
      'orderSort',
      'pageData',
    ]),
    containerWidth() {
      // 格子承载宽度
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 456
        : 720
    },
    latticeWidth() {
      // 格子宽度
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 32
        : 30
    },
    capitalTopicNum() {
      let index = this.options.findIndex(
        (item) => this.data.number == item.value
      )
      if (index > -1) {
        return this.options[index].label
      } else {
        return '一'
      }
    },
    pageRow() {
      // 一页所占用的行数
      let row = Math.floor(
        (this.page_size - 60) / (this.latticeWidth + this.data.spacing)
      )
      return row
    },
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn() {
      return this.errorVal != '' ? true : false
    },
    tabStatusVal() {
      const { topic, score, minWordCount, totalWordCount } = this.data
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
      return topic == ''
        ? '小题题号不能为空'
        : score == ''
        ? '分数不能为空'
        : minWordCount == ''
        ? '最少字数不能为空'
        : totalWordCount == ''
        ? '总字数不能为空'
        : minWordCount > totalWordCount
        ? '最少字数不能大于总字数'
        : str != ''
        ? str
        : ''
    },
    tabStatus() {
      const { topic, score, minWordCount, totalWordCount } = this.data
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
      return topic == ''
        ? true
        : score == ''
        ? true
        : minWordCount == ''
        ? true
        : totalWordCount == ''
        ? true
        : minWordCount > totalWordCount
        ? true
        : str != ''
        ? true
        : false
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
              number: this.BigQuestion,
              topic: this.currentQuestion,
            }
          })
        }
        this.existNumber =
          this.existBigQuestion.length > 0
            ? this.existBigQuestion[0].value
            : null
      },
    },
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'insert_pageData',
      'Empty_PageData',
      'set_orderSort',
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_determineTopic',
      'set_existBigQuestion',
      'insert_existBigQuestion',
    ]),
    opened() {
      this.questionData = JSON.parse(
        JSON.stringify({
          ...this.questionData,
          number: this.BigQuestion,
          topic: this.currentQuestion,
        })
      )
      // 开打弹框
      this.set_currentQuestion()
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
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
    },
    hanldeStatus(val) {
      // 报错状态
      this.errorVal = val
    },
    preOptionalData(obj) {
      // 新增题组
      const index = this.data.group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    preCreateQuestion() {
      const { spacing, totalWordCount, InsertTitle, Postpone } = this.data
      this.errorVal = this.tabStatusVal

      if (!this.tabStatus) {
        // 一行数格子 = 向下取整（总字数/格数）
        let lattice = Math.floor(this.containerWidth / this.latticeWidth)

        // 行数 向上取整
        let row = Math.ceil(totalWordCount / lattice)
        console.log(row)
        //行数高度 = 格子大小 + 间距（间距同上要求）
        let rowHeight = this.latticeWidth + spacing

        let rectHeight = row * rowHeight // 当前内容高度 45(内部高度)
        let MarginHeight = 45
        let heights = rectHeight + MarginHeight + 32

        let objId = `compositionLanguage_${+new Date()}`
        //------------------------------------------------------------
        let obj = {
          heightTitle: 32,
          MarginHeight: MarginHeight,
          height: heights,
          id: objId,
          questionType: 'compositionLanguage',
          content: this.data,
          order: this.orderSort,
          first: true,
          lattice: lattice,
          rowHeight: rowHeight,
          rowWidth: this.latticeWidth,
          BeforeEditing:
            this.editQuestionId != null
              ? this.editData.BeforeEditing
              : this.BeforeEditing,
        }

        //存在大题追加
        let existBigQuestionObj = {
          id: objId,
          label: `${this.capitalTopicNum}.${this.data.name}`,
          value: this.data.number,
          order: this.orderSort,
        }

        if (this.editQuestionId == null) {
          if (InsertTitle && this.existBigQuestion.length > 0) {
            let index = this.existBigQuestion.findIndex(
              (item) => item.value === this.existNumber
            )
            if (index > -1) {
              let objIndex = this.pageData.findIndex(
                (item) => item.id == this.existBigQuestion[index].id
              )
              if (objIndex > -1) {
                //-------------------------------------------------插入数组对象
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
                //-------------------------------------------------已选大题数组
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
            }
          } else {
            this.initPageData(obj)
            this.set_existBigQuestion(existBigQuestionObj)
          }

          this.Add_AlreadyTopics([this.data])
          this.set_determineTopic([this.data])
          this.set_orderSort()
        } else {
          this.amendPageData({ ...obj, id: this.editQuestionId })
          this.set_existBigQuestion({ ...existBigQuestionObj, id: obj.id })
        }
        this.set_currentQuestion()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
      }
    },
    hanldeRowsFunc() {
      const { minWordCount, score, totalWordCount } = this.data
      if (minWordCount <= 0) {
        this.errorVal = '最少字数必须大于0'
      } else if (score <= 0) {
        this.errorVal = '分数必须大于0'
      } else if (totalWordCount <= 0) {
        this.errorVal = '最少字数不能大于总字数'
      } else {
        this.errorVal = ''
      }
    },
    hanldeVerification() {
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
@import '~@/assets/css/variables.less';
.el-radio__input.is-checked + .el-radio__label {
  color: @main !important;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: @main !important;
  background: @main !important;
}
.el-radio__inner:hover {
  border-color: @main !important;
}
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: @main !important;
}
</style>
