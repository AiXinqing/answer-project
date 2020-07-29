<template>
  <div>
    <div class="Guide_bar">
      <div class="allscore">
        当前总分：
        <span>0</span> 分
      </div>
      <div class="layout-box">
        <div class="layout-top">
          <span>布局</span>
          <span class="layout-edit">修改</span>
        </div>
        <div class="layout-bottom">
          <div>A3/B4/8K纸</div>
          <div>两栏</div>
          <div>线上阅卷</div>
        </div>
      </div>
    </div>
    <set-dialog ref="editorLayout" />
  </div>
</template>

<script>
import setDialog from './dialog/_setDialog'
export default {
  components: {
    setDialog,
  },
  mounted() {
    this.$refs.editorLayout.openRForm()
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
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
</style>
