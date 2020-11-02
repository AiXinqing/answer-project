<template>
  <div>
    <air-item
      v-for="(item,index) in subtopicGroup"
      :key="index"
      :subtopic="item"
      :number="index + 1"
      @change-last-sub-topic-score="changeLastSubTopicScore"
    />
  </div>
</template>

<script>
import airItem from './item' // 空
export default {
  components: {
    airItem,
  },
  props: {
    subtopicGroup: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    changeLastSubTopicScore (obj, oldObj) {
      this.$emit('change-last-sub-topic-score', obj, oldObj)
    }
  },
}
</script>

