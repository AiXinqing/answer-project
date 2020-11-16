<template>
  <div class="btn-content">
    <div class="basis-title">
      <span>设置答题卡基础信息</span>
    </div>
    <div class="basis_checkbox">
      <el-checkbox v-model="checked">分区答题卡</el-checkbox>
    </div>
    <div class="basis_checkbox basic_btn" style="padding-left:5px">
      <el-button @click="questionDialog">客观题</el-button>
      <el-button @click="fillInTheBlank">填空题</el-button>
      <el-button @click="answerQuestion">解答题</el-button>
      <el-button @click="optionalQuestion">选做题</el-button>
      <el-button @click="compositionEnglish">作文(英)</el-button>
      <el-button @click="compositionLanguage">作文(语)</el-button>
      <el-button @click="NonRresponseArea">非作答</el-button>
    </div>
    <div class="basis_checkbox basic_btn save-btn">
      <el-button type="primary" @click="previewLinkFunc">预览</el-button>
      <!-- <el-button type="primary">
        <router-link to="/preview">预览</router-link>
      </el-button> -->
      <el-button type="primary">保存</el-button>
      <el-button type="primary">下载</el-button>
    </div>
    <public-dialog ref="publicDialog" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import publicDialog from './dialog/_publicDialog'
export default {
  components: {
    publicDialog,
  },
  data() {
    return {
      checked: false,
      openedFrame: true,
    }
  },
  computed: {
    ...mapState('page', ['pageLayout', 'pageData']),
    pageWidth() {
      const {column,size} = this.pageLayout
      return column === 3 && size == 'A3'
        ? 520
        : 785
    },
    pageNum() {
      const {column,size} = this.pageLayout
      return column === 3 && size == 'A3' ? 3 :
      column === 1 && size == 'A4' ? 1 :2
    },
  },

  methods: {
    questionDialog() {
      this.$refs.publicDialog.opened('questionDialogs')
    },
    fillInTheBlank() {
      this.$refs.publicDialog.opened('fillInTheBlanks')
    },
    answerQuestion() {
      this.$refs.publicDialog.opened('answerQuestion')
    },
    optionalQuestion() {
      this.$refs.publicDialog.opened('optionalQuestion')
    },
    compositionEnglish() {
      this.$refs.publicDialog.opened('compositionEnglish')
    },
    compositionLanguage() {
      this.$refs.publicDialog.opened('compositionLanguage')
    },
    NonRresponseArea() {
      this.$refs.publicDialog.opened('NonRresponseArea')
    },
    previewLinkFunc() {
      // 跳转至预览页面
      let routeTwo = this.$router.resolve(
        {
          name: 'preview',
          query: {pageWidth: this.pageWidth,pageNum:this.pageNum}
        }
      )
      window.open(routeTwo.href, '_blank')
    },
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.btn-content {
  width: 320px;
  float: right;
  border-left: 1px solid @shadow;
  height: 100%;
  background: @white;
}
.basis-title {
  border-left: none;
  border-right: none;
  background-color: @bf-f7;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  padding: 0 30px;
  border-bottom: 1px solid @bs-e3;
}
.basis_checkbox {
  padding: 20px 0;
  border-bottom: 1px solid @shadow;
  padding-left: 15px;
}
.el-button--medium {
  padding: 0 0;
  width: 90px;
  padding: 0;
  height: 38px;
  line-height: 36px;
}
.basis_checkbox.basic_btn {
  padding: 15px 0;
  padding-left: 15px;
}
.el-button--primary {
  background-color: @main !important;
  border-color: @main !important;
}
.el-button:focus,
.el-button:hover {
  color: @main !important;
  border-color: @bc_hover !important;
  background-color: @mainHover !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @main !important;
  border-color: @main !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: @main !important;
}
.el-button + .el-button {
  margin-left: 0;
}
button.el-button.el-button--default.el-button--medium {
  margin-top: 10px;
  margin-left: 10px;
}
.basis_checkbox.basic_btn.save-btn {
  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
