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

          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="data.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <add-form
        v-for="(item,i) in data.group"
        :key="i"
        :form-data="item"
        @hanlde-status="hanldeStatus"
        @pre-optional-data="preOptionalData"
      />
      <div class="question-group">
        <optional-item
          v-for="(item,i) in groupItemData"
          :key="i"
          :optional-data="item"
        />
      </div>
      <div class="condition_box">
        <el-checkbox v-model="data.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="data.HorizontalLine">
          <span>行数：</span>
          <el-input v-model.number="data.rows" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
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
import AddForm from '../questionContent/Precautions/optional/_index'
import optionalItem from '../questionContent/Precautions/optional/_item'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    AddForm,
    optionalItem,
  },
  data () {
    return {
      data: {},
      title: '新增选作题',
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
      'BigQuestion'
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
        if (this.data != null) {
          this.data.number = this.BigQuestion
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
    ]),
    opened () {
      // 开打弹框
      this.openedFrame = true
    },
    openedEdit (obj) {
      //编辑弹框
      this.editQuestionId = obj.pid
      this.openedFrame = true
    },
    closeFrame () {
      // 关闭弹窗
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    preCreateQuestion () {

    },
    hanldeStatus (val) {
      // 报错状态
      this.errorVal = val
    },
    preOptionalData (obj) {
      // 新增题组
      console.log(obj)
      // console.log(this.data.group)
      const index = this.data.group.findIndex(item => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }

    }
  },
}
</script>

<style lang="less" >
</style>


