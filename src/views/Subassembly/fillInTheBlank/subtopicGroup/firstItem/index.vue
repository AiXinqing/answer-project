<template>
  <div class="last-topic">
    <subtopic-item
      v-for="subtopic in subtopicGroup"
      :key="subtopic.smallTopic"
      :subtopic="subtopic"
      @pre-edit-last-score="preEditLastScore"
    />
  </div>
</template>

<script>
  import subtopicItem from './item.vue'
  export default {
    components: {
      subtopicItem,
    },
    props: {
      subtopicGroup: {
        type: Array,
        default: () => []
      },
    },

    methods: {
      preEditLastScore(obj) {
        // 编辑最后一级分数
        this.$emit('pre-edit-last-score',obj)
      }
    },
  }
</script>

<style lang="less">

</style>