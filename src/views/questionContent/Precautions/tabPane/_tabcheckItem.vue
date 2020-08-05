<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model="data.start" size="mini" @blur="singleBoxHanlde" />
    <span>题到</span>
    <el-input v-model="data.end" size="mini" @blur="singleBoxHanlde"/>
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="singleBoxHanlde"/>
    <span>分,少选</span>
    <el-input v-model="data.lessScore" size="mini" />
    <span>得分,每题</span>
    <el-input v-model="data.select" size="mini" />
    <span>个选项</span>
    <i class="el-icon-delete"></i>
    <i class="el-icon-delete" @click="hanldeDel(itemData.id,activeNameItem)"></i>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
      data: {}
    }
  },
  computed: {
    ...mapState('questionType', [
      'endQuestion',
      'delTopics',
      'currentQuestion',
    ]),
    tabStatusVal () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 && itemEnd != null ? '结束题号必须大于0' :
          itemStart == 0 && itemEnd != null ? '开始题号不能大于结束题号' :
            itemStart > itemEnd && itemEnd != null ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != null && itemScore == 0 ? '分数不能为空' : ''
    },
    tabStatus () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      return itemStart == 0 && itemEnd != null ? true :
        itemEnd < itemStart && itemEnd != null ? true :
          itemEnd != null && itemScore == 0 ? true :
            itemStart != 0 && itemEnd != null && itemScore == 0 ? true : false;
    },
  },
  watch: {
    itemData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.itemData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.currentQuestion
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'set_endQuestion',
      'set_currentQuestion',
    ]),
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
        let itemEnd = this.data.end == null ? '' : parseInt(this.data.end)
        let itemScore = this.data.score == null ? '' : parseFloat(this.data.score)
        let lessScore = this.data.lessScore == '' || this.data.lessScore == null ? '' : parseFloat(this.data.lessScore)
        let itemSelect = this.data.select == null ? '' : parseFloat(this.data.select)
        if (itemEnd != null) {
          // 判断结束题是否有值
          this.set_endQuestion(itemEnd)
        }
        //
        for (let index = this.data.start; index <= this.data.end; index++) {
          let subtopic = {
            pid: this.data.id,
            id: 'check_' + index,
            score: itemScore,
            lessScore: lessScore,
            select: itemSelect,
            topic: index
          }
          subtopicArr.push(subtopic)
        }
        let itemObj = {
          type: 'checkbox',
          data: {
            start: parseInt(this.data.start),
            end: itemEnd,
            score: itemScore,
            lessScore: lessScore,
            select: itemSelect,
            id: this.data.id,
            childGroup: subtopicArr
          }
        }
        this.$emit('hanlde-add-group-question', itemObj)
        this.set_currentQuestion()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>