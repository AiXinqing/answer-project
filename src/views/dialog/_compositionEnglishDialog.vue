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
            <span>分</span>
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
import { black } from 'color-name';
export default {
  components: {

  },
  data () {
    return {
      data: {},
      title: '设置',
      openedFrame: false,
      // isdisabledFn: false,
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
      }
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'AlreadyTopics',
      'currentQuestion',
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
          str = `${topic}题已经存在，请勿重复添加`
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
      console.log(determineTopic)
      let str = ''
      if (determineTopic.length > 0) {

        let index = determineTopic.findIndex(item => item.topic == topic)
        if (index > -1) {
          str = `${topic}题已经存在，请勿重复添加`
        }
      }
      return score == '' ? true :
        rows == '' ? true :
          topic == '' ? true :
            str != '' ? true : false
    },
    rowsData () {
      // 计算内容是否分页
      const { rows } = this.data
      let Arr = []
      let heights = this.pageHeight[this.pageHeight.length - 1].map(item => item).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      })
      let currentPageHeight = this.page_size - heights // 当前页剩余可用高度
      // 67 = 20 (ivtop值) - 37 (标题高度+边框) - 10 (容器padding-bottom) 35 行高
      let AvailableRow = Math.floor((currentPageHeight - 67) / 35) // 向下取整
      //----------------------------------------------------------------------------------
      if (AvailableRow > 0) {
        let Difference = AvailableRow - rows
        if (Difference > 0) {
          Arr.push(rows)
        } else {
          Arr.push(AvailableRow) // 上部分
          Arr.push(Math.abs(Difference)) // 下部分
        }
      } else {
        Arr.push(rows)
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
            this.data.topic = this.currentQuestion
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
      'set_objectiveData'
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

    preCreateQuestion () {
      this.errorVal = this.tabStatusVal
      if (!this.tabStatus) {
        let objId = `compositionEnglish${+new Date()}`
        //------------------------------------------------------------
        console.log(this.rowsData)
        let obj = {}
        let ArrData = this.rowsData.map((item, i) => {
          obj = {
            height: item * 35,
            id: objId,
            questionType: 'compositionEnglish',
            content: this.data,
            order: this.pageData.length,
            first: i == 0 ? true : false,
            showRow: item
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
          // this.deletePageData(this.dataTopic.pid)
          // ArrData.forEach(obj => {

          //   this.amendPageData({ ...obj, id: this.editQuestionId })
          // })
        }

        console.log(ArrData)
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


