<template>
  <div class="btn-content">
    <div class="basis-title">
      <span>设置答题卡基础信息</span>
    </div>
    <div class="basis_checkbox">
      <el-checkbox v-model="checked">分区答题卡</el-checkbox>
    </div>
    <div class="basis_checkbox basic_btn">
      <el-button>客观题</el-button>
      <el-button>填空题</el-button>
      <el-button>作文</el-button>
    </div>
    <div class="basis_checkbox basic_btn">
      <el-button type="primary">预览</el-button>
      <el-button type="primary">保存</el-button>
      <el-button type="primary">下载</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    }
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
</style>
