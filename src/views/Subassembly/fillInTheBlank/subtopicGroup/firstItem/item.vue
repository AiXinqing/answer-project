<template>
  <div class="last-topic_box">
    <span>第</span>
    <span> {{ data.smallTopic }} </span>
    <span> 空 </span>
    <el-input v-model="data.score" size="mini" @blur="preEditLastSubtopic"
      onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
    />
    <span> 分</span>
  </div>
</template>

<script>
  export default {
    props: {
      subtopic: {
        type: Object,
        default: ()=>{}
      },
    },

    data() {
      return {
        data: {}
      }
    },

    watch: {
      subtopic: {
        immediate: true,
        handler () {
          this.data = { ...this.subtopic }
        }
      }
    },

    methods: {
      preEditLastSubtopic() {
        
      }
    },
  }
</script>

<style lang="less">
  .last-topic_box{
    margin-left: 50px;
    span,
    .el-input--mini{
      margin-left: 10px;
    }
  }
</style>