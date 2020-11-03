<template>
  <div class="last-topic">
    <subtopic-item
      v-for="subtopic in subtopicGroup"
      :key="subtopic.smallTopic"
      :subtopic="subtopic"
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
  }
</script>

<style lang="less">

</style>