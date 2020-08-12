<template>
  <div class="big-item">
    <span>从</span>
    <!-- @keyup.native.stop="isVerifi" -->
    <el-input v-model.number="data.start" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每题</span>
    <el-input v-model.number="data.score" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="singleBoxHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>空</span>
    <i class="el-icon-delete" @click="hanldeDel" ></i>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {}
      }
    },
    methods: {
      singleBoxHanlde() {

      },
      hanldeDel(){

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>