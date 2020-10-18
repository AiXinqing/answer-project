<template>
  <div>
    <div class="Guide_bar">
      <div class="allscore">
        当前总分：
        <span>{{paperTotalScore}}</span> 分
      </div>
      <div class="layout-box">
        <div class="layout-top">
          <span>布局</span>
          <span class="layout-edit" @click="modifyLayoutFunc">修改</span>
        </div>
        <div class="layout-bottom">
          <div>{{size}}</div>
          <div>{{column}}</div>
          <!-- <div>线上阅卷</div> -->
        </div>
      </div>
    </div>
    <!-- tanchu -->
    <set-dialog ref="editorLayout" :prop-layout="pageLayout" />
    <!-- tanchu -->
    <hj-dialog title="提示" :visible.sync="openedPrompt" :width="'400px'">
      <div class="Prompt_info">
        <i class="el-icon-question"></i>修改后将会清空所有手动修改的内容，确定修改吗？
      </div>
      <div class="dialog-footer">
        <hj-button type="cancel" @click="closePrompt">取 消</hj-button>
        <hj-button type="confirm" @click="PromptFunc">确 定</hj-button>
      </div>
    </hj-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import setDialog from './dialog/_setDialog'
export default {
  components: {
    setDialog,
  },
  data () {
    return {
      openedPrompt: false,
    }
  },
  computed: {
    ...mapState('pageContent', ['pageLayout','page_size','paperTotalScore']),
    testPaper() {
      return 'A3/B4/8K纸'
    },
    column(){
      return this.pageLayout.column == 3 ? '三栏' : this.pageLayout.column == 1 ? '一栏' :  '两栏'
    },
    size() {

      return this.pageLayout.column == 1 ? 'A4/B5纸': 'A3/B4/8K纸'
    }
  },
  mounted () {
    this.$refs.editorLayout.openRForm(1)
  },
  methods: {
    closePrompt () {
      this.openedPrompt = false
    },
    openPrompt () {
      this.openedPrompt = true
    },
    PromptFunc () {
      this.$refs.editorLayout.openRForm(2)
      this.closePrompt()
    },
    modifyLayoutFunc () {
      // 打开修改弹出框
      this.openPrompt()
    },
  },
}
</script>

<style lang="less">
@import "~@/assets/css/variables.less";
.Guide_bar {
  position: fixed;
  left: 7px;
  z-index: 2;
  margin-top: 40px;
  .allscore {
    font-size: 14px;
  }
  .layout-box {
    border: 1px solid @main;
    min-width: 93px;
    background: @white;
    margin-top: 10px;
    font-size: 14px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-edit {
    color: @mainFont !important;
    cursor: pointer;
    float: right;
  }
  .layout-bottom {
    background-color: @white;
    padding: 10px 8px;
    line-height: 22px;
  }
}
.Prompt_info {
  height: 50px;
  font-size: 14px;
  padding-top: 20px;
  i {
    font-size: 24px;
    color: @warning;
    position: relative;
    top: 3px;
    margin-right: 5px;
  }
}
</style>
