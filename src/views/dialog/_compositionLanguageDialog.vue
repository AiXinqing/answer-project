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

          ></hj-select>
        </el-col>
        <el-col :span="8" class="select-item composition_item">
          <div class="label">题目:</div>
          <el-input v-model="data.topic" size="mini" placeholder=""></el-input>
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
          <el-input v-model.number="data.topic" size="mini" @blur="hanldeVerification" placeholder="" />
          <span>题</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">分数:</div>
          <el-input v-model="data.score" @input="hanldeRowsFunc" @blur="hanldeVerification" size="mini" placeholder="" />
          <span>分</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">字数最少:</div>
          <el-input v-model="data.minWordCount" @input="hanldeRowsFunc" @blur="hanldeVerification" size="mini" placeholder="" />
          <span>字</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="select-item">
          <div class="label">字数标记:</div>
          <el-radio v-model="data.mark" label="1">最少字数处显示一个字数标记</el-radio>
          <el-radio v-model="data.mark" label="2">每100字显示一个字数标记</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">总字数:</div>
          <el-input v-model.number="data.totalWordCount" @input="hanldeRowsFunc" @blur="hanldeVerification" size="mini" placeholder="" />
          <span>字</span>
        </el-col>
      </el-row>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
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
        name: '作文', // 题目
        Attach: false,
        topic: 1,
        score: '',
        minWordCount: 800,
        mark: '1', // 1 ，2
        totalWordCount: 1000,
      }
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'currentQuestion',
      'determineTopic',
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'BigQuestion',
      'pageData',
      'pageLayout',
    ]),
    latticeWidth () {
      // 格子承载宽度
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 456
        : 722
    },
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn () {
      return this.errorVal != '' ? true : false
    },
    tabStatusVal () {
      const { topic, score, minWordCount, totalWordCount } = this.data
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
      return topic == '' ? '小题题号不能为空' :
        score == '' ? '分数不能为空' :
          minWordCount == '' ? '最少字数不能为空' :
            totalWordCount == '' ? '总字数不能为空' :
              minWordCount > totalWordCount ? '最少字数不能大于总字数' :
                str != '' ? str : ''
    },
    tabStatus () {
      const { topic, score, minWordCount, totalWordCount } = this.data
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
      return topic == '' ? true :
        score == '' ? true :
          minWordCount == '' ? true :
            totalWordCount == '' ? true :
              minWordCount > totalWordCount ? true :
                str != '' ? true : false
    },
    rowsData () {
      // 计算内容是否分页
      // const { rows } = this.data
      let Arr = []
      let heights = this.pageHeight[this.pageHeight.length - 1].map(item => item).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      })
      let currentPageHeight = this.page_size - heights // 当前页剩余可用高度

      if (this.editQuestionId != null) { // 编辑
        let editHeight = 0
        this.pageData.filter(item => item.id == this.editData.id).forEach(item => {
          editHeight += item.TotalHeight
        })
        currentPageHeight = currentPageHeight + editHeight + 9
      }

      // 67 = 20 (ivtop值) - 32 (标题高度+边框) - 5(底部) - 10 (容器padding-bottom) 35 行高
      let AvailableRow = Math.floor((currentPageHeight - 67) / 35) // 向下取整
      //----------------------------------------------------------------------------------
      console.log(AvailableRow)
      // if (AvailableRow > 0) {
      //   let Difference = AvailableRow - rows
      //   if (Difference > 0) {
      //     Arr.push(rows)
      //   } else {
      //     Arr.push(AvailableRow) // 上部分
      //     Arr.push(Math.abs(Difference)) // 下部分
      //   }
      // } else {
      //   Arr.push(rows)
      // }
      return Arr
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
    preCreateQuestion () {
      this.errorVal = this.tabStatusVal
      if (!this.tabStatus) {
        console.log(1)
      }
    },
    hanldeRowsFunc () {
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
    hanldeVerification () {
      this.errorVal = this.tabStatusVal
    }
  },
}
</script>

<style lang="less" >
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


