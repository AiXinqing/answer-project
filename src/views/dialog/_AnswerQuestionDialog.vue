<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box answer_box">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="dataTopic.number"

          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="dataTopic.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
        <!-- <el-col :span="24" class="select-item">
          <div class="label">每行展示</div>
          <el-input v-model.number="dataTopic.rows" size="mini" placeholder="请输入内容" />
            <div class="label m-5" style="padding-left:5px"> 空 </div>
        </el-col> -->
      </el-row>
      <div class="big-item">
        <span>从</span>
        <el-input v-model.number="dataTopic.start" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span class="p-5"> 题到 </span>
        <el-input v-model.number="dataTopic.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span class="p-5"> 题 </span>
      </div>
      <div class="question-group"></div>
      <div class="condition_box">
        <el-checkbox v-model="ShowScore">小题显示分数</el-checkbox>
        <el-checkbox v-model="HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="ShowScore">
          <span>行数：</span>
          <el-input v-model.number="dataTopic.rows" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
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
// import spaceQuestion from '../questionContent/Precautions/_spaceQuestion'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dataTopic: {},
      closeData: {},
      title: '新增解答题',
      openedFrame: false,
      isdisabledFn: false,
      errorVal: '',
      HorizontalLine: false, // 横行
      ShowScore: false, // 显示分数
      questionData: {
        number: 1,
        topic: '解答题',
        rows: 6,
        startQuestion: 1,
        group: [{
          start: 1,
          end: null,
          score: null,
          space: 1,
          id: 'answerTopic',
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
    name () {
      return this.data
    },
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
  },
  mounted () {
    this.closeData = []
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.dataTopic = {
          ...this.questionData
        }
      }
    }
  },
  methods: {
    opened () {
      // 开打弹框
      this.openedFrame = true
    },
    openedEdit (id) {
      //编辑弹框
      this.openedFrame = true
      console.log(id)
    },
    closeFrame () {
      // 关闭弹窗
      this.openedFrame = false
    },
    preCreateQuestion () {
      //确定信息
    }
  },
}
</script>

<style lang="less" >
.answer_box {
  .select-item:last-child {
    margin-top: 0;
  }
  .big-item .el-input--mini {
    width: 68px;
  }
  .big-item input {
    width: 68px;
    margin-top: 10px;
  }
  .condition_box {
    margin-top: 15px;
  }
  .big-item {
    span {
      top: 15px;
    }
  }
  .p-5 {
    padding: 0 5px;
  }
  .answer_rows {
    display: inline-block;
    width: 140px;
    position: absolute;
    margin-top: -3px;
    margin-left: 40px;
    .el-input,
    input {
      width: 48px;
    }
  }
}
</style>


