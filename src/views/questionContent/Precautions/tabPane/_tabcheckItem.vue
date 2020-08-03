<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model="itemStart" size="mini" @blur="singleBoxHanlde" />
    <span>题到</span>
    <el-input v-model="itemEnd" size="mini" @blur="singleBoxHanlde"/>
    <span>题,每题</span>
    <el-input v-model="itemScore" size="mini" @blur="singleBoxHanlde"/>
    <span>分,少选</span>
    <el-input v-model="itemLessScore" size="mini" />
    <span>得分,每题</span>
    <el-input v-model="itemSelect" size="mini" />
    <span>个选项</span>
    <i class="el-icon-delete"></i>
    <i class="el-icon-delete" @click="hanldeDel(itemData.id,activeNameItem)"></i>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => { }
    },
    activeNameItem: {
      type: String,
      default: 'singleBox'
    }
  },
  data () {
    return {
      itemStart: this.itemData.start,
      itemEnd: this.itemData.end,
      itemScore: this.itemData.score,
      itemLessScore: this.itemData.lessScore,
      itemSelect: this.itemData.select,
    }
  },
  computed: {
    tabStatusVal () {
      let itemStart = this.itemStart || 0
      let itemEnd = this.itemEnd || 0
      let itemScore = this.itemScore || 0
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 ? '结束题号必须大于0' :
          itemStart == 0 && itemEnd != 0 ? '开始题号不能大于结束题号' :
            itemStart > itemEnd ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != 0 && itemScore == 0 ? '分数不能为空' : ''
    },
    tabStatus () {
      let itemStart = this.itemStart || 0
      let itemEnd = this.itemEnd || 0
      let itemScore = this.itemScore || 0
      return itemStart == 0 && itemEnd != 0 ? true :
        itemEnd < itemStart ? true :
          itemEnd != 0 && itemScore == 0 ? true :
            itemStart != 0 && itemEnd != 0 && itemScore == 0 ? true : false;
    }
  },
  methods: {
    hanldeDel (id, type) {
      // 删除分段题组
      const obj = { id: id, type: type }
      this.$emit('hanlde-del', obj)
    },
    singleBoxHanlde () {
      // 新增题组-小题详情
      if (this.tabStatus) {
        console.log(this.tabStatusVal)
      } else {
        console.log(this.tabStatusVal)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>