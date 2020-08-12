<template>
<!-- 填空题题组 -->
  <div class="space_box">
    <space-item
      v-for="(item, index) in groupData"
      :key="index"
      :space-item="item"
    />
    <div class="add_question" @click="hanldeAddSubtopic">+ 分段添加小题</div>
    <div class="question-group">
      <el-collapse accordion>
        <!-- v-model="activeNames" @change="handleChange" -->
        <group-item v-for="(item, index) in groupItemData" :key="index"/>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import spaceItem from './spaceItem/_item'
import groupItem from './spaceItem/_groupItem.vue'
export default {
  components: {
    spaceItem,
    groupItem
  },
  props: {
    groupData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      activeNames: []
    }
  },
  computed: {
    groupItemData () {
      return [1]
    }
  },
  methods: {
    hanldeAddSubtopic () {

    },
    handleChange () { }
  },
}
</script>

<style lang="less">
.space_box,
.add_question {
  margin-top: 20px;
}
.question-group {
  width: 100%;
  height: 200px;
  overflow: auto;
  border: 1px solid #888;
  margin-top: 15px;
}
</style>