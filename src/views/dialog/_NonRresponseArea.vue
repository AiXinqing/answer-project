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
            :items="questionNumber_big_exist"
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
            v-model.number="data.rows"
            size="mini"
            @blur="changRow"
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
import { mapState, mapMutations,mapGetters } from 'vuex'
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
    ...mapState('questionType', ['questionNumber']),
    ...mapState('pageContent', ['questionOrder', 'pageData','pageLayout']),
    ...mapGetters('pageContent', ['questionNumber_big_exist']),
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn() {
      return  this.questionNumber_big_exist.length > 0 && !this.errorMessage ? false:true
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
  },
  watch: {
    questionNumber_big_exist: {
      immediate: true,
      handler() {
        if (this.editQuestionId == null) {
          this.data = {
            ...this.data,
            positionNum:
              this.questionNumber_big_exist.length > 0
                ? this.questionNumber_big_exist[0].value
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
      'pageData_edit',
      'pageData_id_filter',
      'add_nonAnswer'
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
          first: true,
          rowHeight: 37,
          content: {
            ...this.data,
            pageLayout:this.pageLayout
          },
        }

        let index = this.questionNumber_big_exist.findIndex(question => question.value == positionNum)
        let select = {}
        if(index > -1){
          select = this.questionNumber_big_exist[index]
        }

        if (this.editQuestionId == null) {
          let data = {
            obj: obj,
            bigId: select.id,
            SelfOrder: false,
          }
            this.pageData_insert(data)
            this.add_nonAnswer({...obj,insertIndex:select.id})
        } else {
          this.pageData_edit({
            ...obj,
            id:this.editQuestionId,
            changeOrder:positionNum + 2
          })
          this.add_nonAnswer({
            ...obj,
            id:this.editQuestionId,
            insertIndex:select.id
          })
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
    changRow() {
      this.errorVal = this.tabStatusVal
    }
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
