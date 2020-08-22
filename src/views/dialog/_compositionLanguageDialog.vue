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
        spacing: 4, // 间距
      },
      editData: {},

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
    containerWidth () {
      // 格子承载宽度
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 456
        : 720
    },
    latticeWidth () {
      // 格子宽度
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 32
        : 30
    },
    pageRow () {
      // 一页所占用的行数
      let row = Math.floor((this.page_size - 60) / (this.latticeWidth + this.data.spacing))
      return row
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
    rowsData () {
      // 计算内容是否分页
      const { totalWordCount, spacing } = this.data
      let Arr = []
      let currentPageHeight = this.currentPageHeight

      if (this.editQuestionId != null) { // 编辑

        currentPageHeight = this.editData.BeforeEditing
      }
      console.log(currentPageHeight)
      //内容高度-----------------------------------------------------------------
      //一行数格子 = 向下取整（总字数/格数）
      let lattice = Math.floor(this.containerWidth / this.latticeWidth)
      // 行数 向上取整
      let row = Math.ceil(totalWordCount / lattice)

      //行数高度 = 格子大小 + 间距（间距同上要求）
      let rowHeight = this.latticeWidth + spacing
      // 内容高度 = 行数 * 行数高度 + 内部标题高度 45 + 标题高度 32
      // let containerHeight = row * rowHeight + 32 + 45

      let AvailableRow = Math.floor((currentPageHeight - 77) / rowHeight) // 向下取整
      //----------------------------------------------------------------------------------

      let temArr = [row]
      let i = AvailableRow
      for (var a = 0; a < row; a++) {
        var val = temArr[a] - i
        if (val > 0) {
          temArr.push(val)
          Arr.push(i)
          i = this.pageRow
        } else {
          Arr.push(temArr[a])
          break;
        }
      }

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
      'Empty_PageData'
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_determineTopic',
    ]),
    opened () {
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
      const { spacing } = this.data
      this.errorVal = this.tabStatusVal
      if (!this.tabStatus) {
        // console.log(this.rowsData)
        //一行数格子 = 向下取整（总字数/格数）
        let lattice = Math.floor(this.containerWidth / this.latticeWidth)
        //行数高度 = 格子大小 + 间距（间距同上要求）
        let rowHeight = this.latticeWidth + spacing

        let objId = `compositionLanguage_${+new Date()}`
        //------------------------------------------------------------
        let obj = {}
        let ArrData = this.rowsData.map((item, i) => {
          obj = {
            height: i == 0 ? item * rowHeight + 77 : item * rowHeight,
            id: objId,
            questionType: 'compositionLanguage',
            content: this.data,
            order: this.pageData.length,
            first: i == 0 ? true : false,
            lattice: lattice,
            showRow: item,
            rowHeight: rowHeight,
            rowWidth: this.latticeWidth,
            BeforeEditing: this.editQuestionId != null ? this.editData.BeforeEditing : this.BeforeEditing
          }
          return obj
        })
        //-------------------------------------------------------------------------------------
        if (this.editQuestionId == null) {
          // 新增
          ArrData.forEach(obj => {
            this.initPageData(obj)
          })
          this.Add_AlreadyTopics([this.data])
          this.set_determineTopic([this.data])
        } else {
          // 编辑
          //清空编辑前数据
          this.Empty_PageData(this.editData.id)

          ArrData.forEach(obj => {
            this.initPageData(obj)
          })
        }

        this.set_currentQuestion()
        this.data = JSON.parse(JSON.stringify(this.closeData))
        this.openedFrame = false
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


