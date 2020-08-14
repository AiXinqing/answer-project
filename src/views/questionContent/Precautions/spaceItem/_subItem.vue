<template>
  <div class="sub-item-group">
    <span @click.stop="clickFun">(1) 共</span>
    <el-input v-model.number="data.space" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span @click.stop="clickFun"> 空 每空 </span>
    <el-input v-model.number="data.score" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  methods: {
    clickFun () {

    },
    ChangeSpaceValue () { }
  },
}
</script>

<style lang="less" scoped>
</style>