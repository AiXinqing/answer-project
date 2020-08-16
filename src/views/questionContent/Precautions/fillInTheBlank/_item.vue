<template>
  <div class="big-item">
    <span>从</span>
    <!-- @keyup.native.stop="isVerifi" -->
    <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde"   onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每空</span>
    <el-input v-model.number="data.score" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>分,每题</span>
    <el-input v-model.number="data.space" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>空</span>
    <i class="el-icon-delete" @click="hanldeDel(data.id)" ></i>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    spaceItem: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapState('questionType', [
      'currentQuestion',
      'AlreadyTopics'
    ]),
    tabStatusVal () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      let AlreadyTopics = this.AlreadyTopics
      let strStart = ''
      let strEnd = ''
      if (AlreadyTopics.length > 0) {
        let numStart = AlreadyTopics.findIndex(item => item.topic == itemStart)
        let numEnd = AlreadyTopics.findIndex(item => item.topic == itemEnd)
        if (numStart > -1) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 && itemEnd != null ? '结束题号必须大于0' :
          itemStart == 0 && itemEnd != null ? '开始题号不能大于结束题号' :
            itemStart > itemEnd && itemEnd != null ? '开始题号不能大于结束题号' :
              itemStart != 0 && itemEnd != null && itemScore == 0 ? '分数不能为空' :
                strStart != '' ? strStart :
                  strEnd != '' ? strStart : ''
    },
    tabStatus () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end || null
      let itemScore = this.data.score || 0
      let AlreadyTopics = this.AlreadyTopics
      let strStart = ''
      let strEnd = ''
      if (AlreadyTopics.length > 0) {
        let numStart = AlreadyTopics.findIndex(item => item.topic == itemStart)
        let numEnd = AlreadyTopics.findIndex(item => item.topic == itemEnd)
        if (numStart > -1) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 && itemEnd != null ? true :
        itemEnd < itemStart && itemEnd != null ? true :
          itemEnd != null && itemScore == 0 ? true :
            itemStart != 0 && itemEnd != null && itemScore == 0 ? true :
              strStart != '' ? true :
                strEnd != '' ? true : false;
    },
    name () {
      return this.data
    }
  },
  watch: {
    spaceItem: {
      immediate: true,
      handler () {
        this.data = {
          ...this.spaceItem
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.currentQuestion
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Add_AlreadyTopics',
    ]),
    groupTopicHanlde () {
      this.$emit('hanlde-status', this.tabStatusVal)
      if (!this.tabStatus) {

        let subtopicArr = []
        for (let index = this.data.start; index <= this.data.end; index++) {
          subtopicArr.push({
            score: this.data.score,
            end: this.data.end,
            space: this.data.space,
            start: this.data.start,
            pid: this.data.id,
            id: `${this.data.id}_${+new Date()}_${index}`,
            topic: index,
            sum: this.data.score * this.data.space,
          })
        }
        let obj = {
          ...this.data,
          childGroup: subtopicArr
        }
        // 弹框临时小题数
        const temporaryArr = subtopicArr.map(item => ({ ...item, subtopic: 1 }))
        this.Add_AlreadyTopics(temporaryArr)
        // temporaryArr
        this.$emit('hanlde-add-group-question', obj)
      }
    },
    hanldeDel (id) {
      // 题组删除
      this.$emit('hanlde-del-group', id)
    },
    clickFun () { }
  },
}
</script>

<style lang="scss" scoped>
</style>