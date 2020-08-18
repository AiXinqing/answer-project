<template>
<!-- 分值item -->
  <div class="points_list">
    <span >1.1.1.1 </span>
    <el-input v-model.number="data.score" size="mini" class="points_list_input"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span > 分  </span>
    <i class="el-icon-del list-del" >-</i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
}
</script>

<style lang="less" >
.points_list {
  width: 94%;
  margin-left: 3%;
  padding: 8px 0;
  .el-input--mini {
    width: 48px;
    margin: 0 10px;
  }
  .points_list_input {
    margin-left: 64%;
  }
}
.el-icon-del.list-del {
  margin-top: 0px;
  right: 80px !important;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.el-collapse {
  border-bottom: none;
}
</style>