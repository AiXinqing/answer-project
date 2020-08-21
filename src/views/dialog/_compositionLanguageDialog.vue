<template>
<!-- 作文语文 -->
  <hj-dialog
    class="newAdd-content composition_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
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
          <el-input v-model="data.topic" size="mini" placeholder="请输入内容"></el-input>
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
          <el-input v-model="data.number" size="mini" placeholder="请输入内容" />
          <span>题</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">分数:</div>
          <el-input v-model="data.number" size="mini" placeholder="请输入内容" />
          <span>分</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">字数最少:</div>
          <el-input v-model="data.number" size="mini" placeholder="请输入内容" />
          <span>字</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="select-item">
          <div class="label">字数标记:</div>
          <el-radio v-model="data.radio" label="1">最少字数处显示一个字数标记</el-radio>
          <el-radio v-model="data.radio" label="2">每100字显示一个字数标记</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">总字数:</div>
          <el-input v-model="data.number" size="mini" placeholder="请输入内容" />
          <span>字</span>
        </el-col>
      </el-row>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
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
      isdisabledFn: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      questionData: {
        number: 1,
        topic: '选作题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        Attach: false,
        radio: '',
        group: [{
          choices: '', // 几选几
          select: '',
          start: 1,
          end: '',
          score: '',
          id: 'optionalTopic',
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
      'BigQuestion',
      'pageData',
    ]),
    ...mapState('answerQuestion', ['answerQuestionArr',]),
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    groupItemData () {
      return this.data.group.map(item => item.childGroup)[0]
    }
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
            this.data.number = this.BigQuestion
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
      'set_objectiveData',
      'deletePageData'
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_closeFrame',
      'set_determineTopic',
      'once_AlreadyTopics',
    ]),
    opened () {
      // 开打弹框
      this.set_currentQuestion()
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (obj) {
      //编辑弹框
      this.set_currentQuestion()
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj))
      this.title = '编辑选作题'
    },
    closeFrame () {
      // 关闭弹窗
      this.set_currentQuestion()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    hanldeStatus (val) {
      // 报错状态
      this.errorVal = val
    },
    preOptionalData (obj) {
      // 新增题组
      const index = this.data.group.findIndex(item => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    preCreateQuestion () { }
  },
}
</script>

<style lang="less" >
@import '~@/assets/css/variables.less';
.el-radio__input.is-checked + .el-radio__label {
  color: @main;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: @main;
  background: @main;
}
.el-radio__inner:hover {
  border-color: @main;
}
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: @main;
}
</style>


