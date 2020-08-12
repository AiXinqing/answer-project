<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="objectiveData.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="objectiveData.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每行展示</div>
          <el-input v-model.number="objectiveData.rows" size="mini" placeholder="请输入内容" />
            <div class="label m-5" style="padding-left:5px"> 空 </div>
        </el-col>
      </el-row>
      <space-question :group-data="spaceTopic.group"/>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import spaceQuestion from '../questionContent/Precautions/_spaceQuestion'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    spaceQuestion,
  },
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增填空题',
      spaceTopic: {
        number: 1,
        topic: '填空题',
        rows: 5,
        startQuestion: 1,
        group: [{
          start: 1,
          end: null,
          score: null,
          space: 1,
          id: 'spaceTopic',
          childGroup: [],
        },]
      },
      closeData: {},
      errorVal: '',
      objectiveData: {},
      topicList: [],
      editQuestionId: null,
      ContentHeight: 0, // 内容高度
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'AlreadyTopics',
      'currentQuestion',
      'letterArr'
    ]),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    pageWidth () {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
  },
  watch: {
    quesctionObj: {
      immediate: true,
      handler () {
        this.objectiveData = {
          ...this.spaceTopic
        }

      }
    }
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.quesctionObj))
  },
  methods: {
    ...mapMutations('questionType', [
      'set_SubtitleNumber',
      'delete_SubtitleNumber',
      'set_currentQuestion',
      'set_closeFrame',
      'Add_AlreadyTopics', // 小题数组
      'del_AlreadyTopics', // 删除题组-小题
    ]),
    ...mapMutations('pageContent', ['initPageData', 'amendPageData']),
    closeFrame () {
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame(this.quesctionObj.startQuestion)
      this.openedFrame = false
    },
    opened () {
      this.openedFrame = true
      this.set_currentQuestion()
    },
    openedEdit (id) {
      let current = this.pageData.filter(item => item.id === id)
      this.quesctionObj = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.openedFrame = true
      this.title = '编辑填空题'
      this.set_currentQuestion()
    },
    preCreateQuestion () { // 数据编辑完成添加至全局数组中---------------
      //------------------------------------
      this.openedFrame = false // 关闭弹窗
    },
    hanldeSelect (e) {
      // 选择答题号
      window.console.log(e)
    },
    traverse (Arr, letterArr) {
      if (Arr.length > 0) {
        let data = []
        Arr.forEach(item => {
          item.childGroup.forEach(row => {
            let obj = {
              ...row,
              selectBox: row.select == 2 && row.id.indexOf('judgment') != -1 ? ['T', 'F'] : letterArr.slice(0, row.select),
              width: row.select * 26 + 42
            }
            data.push(obj)
          })
        })

        return data
      } else {
        return []
      }
    },
    HeightCalculation (maxWidth, result) { // 计算题型内容所占高度
      // 计算宽度所占数组长度
      let widths = []
      let sum = 0
      let i
      let a = 0
      for (i = 0; i < maxWidth.length; i++) {
        sum = sum + maxWidth[i]
        a += 1
        if (sum >= this.pageWidth) {
          widths.push(a - 1)
          sum = 0
          a = 1
          sum = sum + maxWidth[i]
        }
      }
      if (maxWidth.length > 0) {
        let long = 0
        if (widths.length > 0) {
          long = maxWidth.length - widths.reduce((accumulator, currentValue) => accumulator + currentValue)
        } else {
          long = maxWidth.length - 0
        }
        widths.push(long)
      }
      console.log(widths)
      // let widthsLong = widths.length
      // 计算高度所占数组长度
      let heights = result.map(item => item.length * 22)

      // 根据宽度数组 和 高度数组合成高度二维数组
      let twoDimensional = []
      let num = 0
      for (let i = 0; i < widths.length; i++) {
        num += widths[i]
        twoDimensional.push(heights.slice(num - widths[i], num))
      }
      let heightList = twoDimensional.map(item => {
        return Math.max.apply(null, item)
      })
      if (heightList.length > 0) {
        return heightList.reduce((accumulator, currentValue) => accumulator + currentValue) + heightList.length * 10
      } else {
        return 0
      }
    }
  },
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/variables.less';
.select-item {
  display: flex;
  .label {
    width: 70px;
    position: relative;
    top: 4px;
  }
}
.select-item:last-child {
  margin-top: 20px;
  .el-input.el-input--mini {
    width: 130px;
  }
}
.hj-select {
  width: 130px;
}
.card_top {
  margin-top: 20px;
}
.el-tabs--border-card {
  box-shadow: none !important;
  border: none;
}
.error-message {
  color: red;
  font-size: 14px;
  text-indent: 1em;
}
.m-5 {
  margin-right: 5px;
}
</style>

<style lang="less">
.el-tabs__nav-wrap {
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #1ab394 !important;
}
</style>
