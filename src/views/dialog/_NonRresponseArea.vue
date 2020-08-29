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
      <div  class="non_box_item">
        <div class="label_item">位置:</div>
        <div class="label_right">
          <hj-select
            :items="existBigQuestion"
            size="mini"
            @change="hanldeVerification"
            :value="data.number" />
          <div class="Comment">注：非作答区将加在选中的大框后</div>
        </div>
      </div>
      <div class="non_box_item">
        <div class="label_item">高度:</div>
        <div class="label_right">
          <el-input v-model="data.rows" size="mini" @blur="hanldeVerification" @input="hanldeVerification" placeholder="请输入内容" />
        </div>
      </div>
      <div class="error-message non_box_error" v-if="errorMessage"><i></i>{{ errorVal }}</div>
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
  data () {
    return {
      title: '设置',
      openedFrame: false,
      errorVal: '',
      data: {
        rows: 3,
        number: null,
      },
      closeData: {},
      editQuestionId: null,
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'existBigQuestion',
    ]),
    ...mapState('pageContent', [
      'orderSort',
      'pageData'
    ]),
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    isdisabledFn () {
      return this.errorVal != '' ? true : false
    },
    tabStatusVal () {
      const { rows, number } = this.data
      return number == null ? '请选择位置' :
        rows < 3 || rows == '' ? '行数不能少于3' : ''
    },
    tabStatus () {
      const { rows, number } = this.data
      return number == null ? true :
        rows < 3 || rows == '' ? true : false
    },
    orderVal () {
      const { number } = this.data
      let index = this.existBigQuestion.findIndex(item => { item.value == number })
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
      handler () {
        if (this.editQuestionId == null) {
          this.data = {
            ...this.data,
            number: this.existBigQuestion.length > 0 ? this.existBigQuestion[0].value : null
          }
        }
      }
    },
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.data))
  },
  methods: {
    ...mapMutations('pageContent', [
      'insert_pageData',
      'amendPageData',
      'set_orderSort',
    ]),
    closeFrame () {
      this.openedFrame = false
      this.errorVal = ''
      this.data = JSON.parse(JSON.stringify(this.closeData))
    },
    change (obj, num) {
      let current = this.pageData.filter(item => item.id === obj.id)
      this.data = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = obj.id
      let rows = this.data.rows
      if (num == 1) { // 1减法 2加法
        if (rows > 3) {
          rows -= 1
        } else {
          rows = 3
          this.$message({
            message: '行数不能少于3',
            type: 'warning'
          });
        }
      } else {
        rows += 1
      }
      this.data.rows = rows
      this.$nextTick(() => {
        this.preCreateQuestion()
      })
    },
    preCreateQuestion () {
      const { rows, number } = this.data
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
          content: this.data
        }
        if (this.editQuestionId == null) {

          this.insert_pageData(obj, number, this.orderVal)
        } else {
          this.amendPageData({ ...obj, id: this.editQuestionId })
        }
        this.openedFrame = false
        this.data = JSON.parse(JSON.stringify(this.closeData))
      }
    },
    opened () {
      this.openedFrame = true
    },
    openedEdit (obj) {
      this.editQuestionId = obj.id
      this.data = JSON.parse(JSON.stringify(obj.content))
      this.openedFrame = true
    },
    hanldeVerification () {
      this.errorVal = this.tabStatusVal
    },
  },
}
</script>

<style lang="less" >
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
</style>