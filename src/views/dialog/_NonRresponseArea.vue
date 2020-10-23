<template>
  <!-- 非作答区 -->
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
  >
    <div class="non_box">
      <div class="non_box_item">
        <div class="label_item">位置:</div>
        <div class="label_right">
          <hj-select
            :items="existBigQuestion"
            size="mini"
            @change="hanldeVerification"
            :value="data.positionNum"
          />
          <div class="Comment">注：非作答区将加在选中的大框后</div>
        </div>
      </div>
      <div class="non_box_item">
        <div class="label_item">高度:</div>
        <div class="label_right">
          <el-input
            v-model="data.rows"
            size="mini"
            @blur="hanldeVerification"
            @input="hanldeVerification"
            placeholder="请输入内容"
          />
        </div>
      </div>
      <div class="error-message non_box_error" v-if="errorMessage">
        <i></i>{{ errorVal }}
      </div>
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
  data() {
    return {
      title: '设置',
      openedFrame: false,
      errorVal: '',
      data: {
        rows: 3,
        positionNum: 0,
      },
      closeData: {},
      editQuestionId: null,
      options:[]
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'existBigQuestion']),
    ...mapState('pageContent', ['questionOrder', 'pageData','pageLayout']),
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn() {
      return  this.existBigQuestion.length > 0 && !this.errorMessage ? false:true
    },
    tabStatusVal() {
      const { rows, positionNum } = this.data
      return positionNum == null
        ? '请选择位置'
        : rows < 3 || rows == ''
        ? '行数不能少于3'
        : ''
    },
    tabStatus() {
      const { rows, positionNum } = this.data
      return positionNum == null ? true : rows < 3 || rows == '' ? true : false
    },
    orderVal() {
      const { positionNum } = this.data
      let index = this.existBigQuestion.findIndex((item) => {
        item.value == positionNum
      })
      if (index > -1) {
        return this.existBigQuestion[index].order + 1
      } else {
        return 2
      }
    },
  },
  watch: {
    existBigQuestion: {
      immediate: true,
      handler() {
        if (this.editQuestionId == null) {
          this.data = {
            ...this.data,
            positionNum:
              this.existBigQuestion.length > 0
                ? this.existBigQuestion[0].value
                : null,
          }
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      },
    },
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.data))
  },
  methods: {
    ...mapMutations('pageContent', [
      'pageData_insert',
      'pageData_simple_insert',
      'pageData_id_filter',
      'set_questionOrder',
    ]),
    closeFrame() {
      this.openedFrame = false
      this.errorVal = ''
      this.data = JSON.parse(JSON.stringify(this.closeData))
    },
    change(obj, num) {
      let current = this.pageData.filter((item) => item.id === obj.id)
      this.data = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = obj.id
      let rows = this.data.rows
      if (num == 1) {
        // 1减法 2加法
        if (rows > 3) {
          rows -= 1
        } else {
          rows = 3
          this.$message({
            message: '行数不能少于3',
            type: 'warning',
          })
        }
      } else {
        rows += 1
      }
      this.data.rows = rows
      this.$nextTick(() => {
        this.preCreateQuestion()
      })
    },
    preCreateQuestion() {
      const { rows, positionNum } = this.data
      this.errorVal = this.tabStatusVal

      if (!this.tabStatus) {
        let heights = rows * 37
        let obj = {
          heightTitle: 0,
          MarginHeight: 7,
          height: heights,
          id: `NonRresponseArea_${+new Date()}`,
          questionType: 'NonRresponseArea',
          order: this.orderVal,
          first: true,
          rowHeight: 37,
          content: {
            ...this.data,
            pageLayout:this.pageLayout
          },
        }
        if (this.editQuestionId == null) {
          let index = this.existBigQuestion.findIndex(
            (item) => item.value === positionNum
          )
          if (index > -1) {
            let objIndex = this.pageData.findIndex(
              (item) => item.id == this.existBigQuestion[index].id
            )
            if (objIndex > -1) {
              let data = {
                obj: { ...obj, order: this.pageData[objIndex].order },
                num: positionNum,
                order: this.pageData[objIndex].order,
                SelfOrder: false,
              }

              this.pageData_insert(data)
            }
          }
        } else {
          this.pageData_id_filter(this.editQuestionId)
          let data = {
            obj:{ ...obj, id: this.editQuestionId },
            num:this.data.positionNum + 2
          }
          this.pageData_simple_insert(data)
        }
        this.openedFrame = false
        this.data = JSON.parse(JSON.stringify(this.closeData))
      }
    },
    opened() {
      this.openedFrame = true
    },
    openedEdit(obj) {
      this.editQuestionId = obj.id
      this.data = JSON.parse(JSON.stringify(obj.content))
      this.openedFrame = true
    },
    hanldeVerification(e) {
      this.data.positionNum = e
      this.errorVal = this.tabStatusVal
    },
  },
}
</script>

<style lang="less">
.non_box {
  border-bottom: 1px solid #eee;
  padding-bottom: 40px;
  position: relative;
  left: -20px;
  width: 500px;
}
.non_box_error {
  position: absolute;
  left: 145px;
  margin-top: 5px;
}
.non_box_item {
  margin-top: 10px;
  .label_item {
    width: 60px;
    height: 34px;
    line-height: 34px;
  }
  .label_right {
    width: calc(100% - 60px);
  }
  .el-input.el-input--mini {
    height: 34px;
    line-height: 34px;
  }
  .el-input--mini .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .hj-select {
    width: 100%;
    .el-input.el-input--mini.el-input--suffix {
      width: 120%;
    }
  }
  width: 60%;
  margin-left: 20%;
  display: inline-flex;
}
.non_box_item:nth-child(n + 2) {
  margin-top: 34px;
}
.Comment {
  position: absolute;
  color: #999;
  margin-top: 2px;
}
.error-message.non_box_error {
  margin-left: 15px;
}
</style>
