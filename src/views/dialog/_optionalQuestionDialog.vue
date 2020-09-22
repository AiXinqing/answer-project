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
            :value="data.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="data.topic"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
      </el-row>
      <add-form
        v-for="(item, i) in data.group"
        :key="i"
        :form-data="item"
        @hanlde-status="hanldeStatus"
        @pre-optional-data="preOptionalData"
      />
      <div class="question-group">
        <optional-item
          v-for="(item, i) in groupItemData"
          :key="i"
          :optional-data="item"
        />
      </div>
      <div class="condition_box">
        <el-checkbox v-model="data.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="data.HorizontalLine">
          <span>行数：</span>
          <el-input
            v-model.number="data.rows"
            size="mini"
            @input="rowsFunc"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          />
          <span class="p-5"> 行 </span>
        </span>
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
import AddForm from '../questionContent/Precautions/optional/_index'
import optionalItem from '../questionContent/Precautions/optional/_item'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    AddForm,
    optionalItem,
  },
  data() {
    return {
      data: {},
      title: '新增选作题',
      openedFrame: false,
      isdisabledFn: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      existNumber: null,
      questionData: {
        number: 1,
        topic: '选作题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        InsertTitle: false,
        Postpone: false,
        group: [
          {
            choices: '', // 几选几
            select: '',
            start: 1,
            end: '',
            score: '',
            id: 'optionalTopic',
            childGroup: [],
          },
        ],
      },
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'currentQuestion',
      'determineTopic',
      'existBigQuestion',
    ]),
    ...mapState('pageContent', ['BigQuestion', 'orderSort', 'pageData']),
    ...mapState('answerQuestion', ['answerQuestionArr']),
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    groupItemData() {
      return this.data.group.map((item) => item.childGroup)[0]
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
            }
          })
          this.data.group.map((item) => {
            return {
              ...item,
              start: item.end == '' ? this.currentQuestion : item.start,
            }
          })
          // const { group } = this.data
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
      'set_objectiveData',
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
      this.questionData.number = this.BigQuestion
      this.data.number = this.BigQuestion
      // 开打弹框
      this.set_currentQuestion()
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit(obj) {
      //编辑弹框
      this.set_currentQuestion()
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj))
      this.title = '编辑选作题'
    },
    closeFrame() {
      // 关闭弹窗
      this.set_currentQuestion()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    preCreateQuestion() {
      // 当前页内容所占高度topic, number,Postpone
      const { rows, InsertTitle, Postpone } = this.data

      let rectHeight = rows * 35 // 当前内容高度 45(内部高度)
      let MarginHeight = +14 + 40
      let heights = rectHeight + MarginHeight + 54

      let objId = `optional_${+new Date()}`

      let obj = {
        MarginHeight: MarginHeight,
        heightTitle: 54,
        height: heights,
        rowHeight: 35,
        id: objId,
        questionType: 'optionalQuestion',
        content: this.data,
        order: this.orderSort,
        first: true,
      }
      //存在大题追加
      let existBigQuestionObj = {
        id: objId,
        label: `${this.capitalTopicNum}.${this.data.topic}`,
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
        this.set_orderSort()
      } else {
        // 编辑
        obj.id = this.editQuestionId
        this.amendPageData(obj)
        this.set_existBigQuestion({ ...existBigQuestionObj, id: obj.id })
      }
      // 大题号修改
      this.set_objectiveData(this.data.number)
      //------------------------------------
      this.openedFrame = false // 关闭弹窗
      // 清空弹框数据

      this.set_determineTopic(this.data.group[0].childGroup)
      this.set_currentQuestion()

      this.data = JSON.parse(JSON.stringify(this.closeData))
    },
    hanldeStatus(val) {
      // 报错状态
      this.errorVal = val
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
    preOptionalData(obj) {
      // 新增题组
      const index = this.data.group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    rowsFunc() {
      if (this.data.rows <= 0) {
        this.errorVal = '行数必须大于0'
        this.isdisabledFn = true
      } else {
        this.errorVal = ''
        this.isdisabledFn = false
      }
    },
    hanldeSelect(e) {
      // 选择答题号
      this.questionData.number = e
      this.data.number = e
    },
  },
}
</script>

<style lang="less"></style>
