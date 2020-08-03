<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model="itemStart" size="mini" @blur="singleBoxHanlde" />
    <span>题到</span>
    <el-input v-model="itemEnd" size="mini" @blur="singleBoxHanlde" />
    <span>题,每题</span>
    <el-input v-model="itemScore" size="mini" @blur="singleBoxHanlde" />
    <span>分,每题</span>
    <el-input v-model="itemSelect" size="mini" />
    <span>个选项</span>
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
            itemStart > itemEnd && itemEnd != 0 ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != 0 && itemScore == 0 ? '分数不能为空' : ''
    },
    tabStatus () {
      let itemStart = this.itemStart || 0
      let itemEnd = this.itemEnd || 0
      let itemScore = this.itemScore || 0
      return itemStart == 0 && itemEnd != 0 ? true :
        itemEnd < itemStart && itemEnd != 0 ? true :
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
      const StatusObj = {
        val: this.tabStatusVal,
        status: this.tabStatus
      }
      this.$emit('hanlde-status', StatusObj)
      if (!this.tabStatus) {
        let subtopicArr = []
        for (let index = this.itemStart; index <= this.itemEnd; index++) {
          let subtopic = {
            pid: this.itemData.id,
            id: 'single_' + index,
            score: parseFloat(this.itemScore),
            select: parseInt(this.itemSelect),
            topic: index
          }
          subtopicArr.push(subtopic)
        }
        let itemObj = {
          type: 'singleBox',
          data: {
            start: parseInt(this.itemStart),
            end: parseInt(this.itemEnd),
            score: parseFloat(this.itemScore),
            select: parseInt(this.itemSelect),
            id: this.itemData.id,
            child: subtopicArr
          }
        }
        this.$emit('hanlde-add-group-question', itemObj)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>