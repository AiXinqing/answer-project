<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="preQuestiongroup"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>个选项</span>
    <i class="el-icon-delete" @click="subTopiceDel(data.id,activeNameItem)" ></i>
  </div>
</template>

<script>
  export default {
    props: {
      itemData: {
        type: Object,
        default: () => { }
      },
    },
    data() {
      return {
        data: {}
      }
    },
    watch: {
      itemData: {
        immediate: true,
        handler () {
          this.data = {
            ...this.itemData
          }
        }
      }
  },
    methods: {
      subTopiceDel() {

      },
      preQuestiongroup(){

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>