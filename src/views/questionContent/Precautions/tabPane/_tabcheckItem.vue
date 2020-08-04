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
import { mapState } from 'vuex'
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
    ...mapState('questionType', [
      'endQuestion',
      'delTopics',
    ]),
    tabStatusVal () {
      let itemStart = this.itemStart || 0
      let itemEnd = this.itemEnd || null
      let itemScore = this.itemScore || 0
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 && itemEnd != null ? '结束题号必须大于0' :
          itemStart == 0 && itemEnd != null ? '开始题号不能大于结束题号' :
            itemStart > itemEnd && itemEnd != null ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != null && itemScore == 0 ? '分数不能为空' : ''
    },
    tabStatus () {
      let itemStart = this.itemStart || 0
      let itemEnd = this.itemEnd || null
      let itemScore = this.itemScore || 0
      return itemStart == 0 && itemEnd != null ? true :
        itemEnd < itemStart && itemEnd != null ? true :
          itemEnd != null && itemScore == 0 ? true :
            itemStart != 0 && itemEnd != null && itemScore == 0 ? true : false;
    },
    currentQuestion: { // 分段题组
      get: () => {
        let end = this.endQuestion
        let delTopics = this.delTopics
        let minTopic = ''
        if (delTopics.length > 0) {
          minTopic = Math.min(...delTopics)
        }
        let minVal = end != null && minTopic == '' ? end + 1 :
          minTopic != '' ? minTopic : 1
        if (this.itemEnd != '') {
          return minVal
        } else {
          return this.itemData.start
        }
      },
      set: function (val) {
        this.itemStart = val
      }
    },
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
        let itemEnd = this.itemEnd == null ? '' : parseInt(this.itemEnd)
        let itemScore = this.itemScore == null ? '' : parseFloat(this.itemScore)
        let lessScore = this.itemLessScore == '' || this.itemLessScore == null ? '' : parseFloat(this.itemLessScore)
        //
        for (let index = this.itemStart; index <= this.itemEnd; index++) {
          let subtopic = {
            pid: this.itemData.id,
            id: 'check_' + index,
            score: parseFloat(this.itemScore),
            lessScore: lessScore,
            select: parseInt(this.itemSelect),
            topic: index
          }
          subtopicArr.push(subtopic)
        }
        let itemObj = {
          type: 'checkbox',
          data: {
            start: parseInt(this.itemStart),
            end: itemEnd,
            score: itemScore,
            lessScore: lessScore,
            select: parseInt(this.itemSelect),
            id: this.itemData.id,
            childGroup: subtopicArr
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