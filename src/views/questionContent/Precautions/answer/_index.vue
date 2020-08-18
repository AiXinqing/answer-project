<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span class="p-5"> 题到 </span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span class="p-5"> 题 </span>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    formData: {
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
      'AlreadyTopics',
      'determineTopic', // 确定小题数值
    ]),
    tabStatusVal () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end

      let determineTopic = this.determineTopic
      let strStart = ''
      let strEnd = ''

      if (determineTopic.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == itemStart)
        let numEnd = determineTopic.findIndex(item => item.topic == itemEnd)
        if (numStart > -1) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 ? '开始题号必须大于0' :
        itemEnd == 0 ? '开始题号必须大于0' :
          itemStart == 0 && itemEnd != null ? '开始题号不能大于结束题号' :
            itemStart > itemEnd && itemEnd != null ? '开始题号不能大于结束题号' :
              strStart != '' ? strStart :
                strEnd != '' ? strStart : ''
    },
    tabStatus () {
      let itemStart = this.data.start || 0
      let itemEnd = this.data.end

      let determineTopic = this.determineTopic
      let strStart = ''
      let strEnd = ''
      if (determineTopic.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == itemStart)
        let numEnd = determineTopic.findIndex(item => item.topic == itemEnd)
        if (numStart > -1) {
          strStart = `${itemStart}题已经存在，请勿重复添加`
        }
        if (numEnd > -1) {
          strEnd = `${itemEnd}题已经存在，请勿重复添加`
        }
      }
      return itemStart == 0 ? true :
        itemEnd == 0 ? true :
          itemStart == 0 && itemEnd != null ? true :
            itemStart > itemEnd && itemEnd != null ? true :
              strStart != '' ? true :
                strEnd != '' ? true : false
    },
  },
  watch: {
    formData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.formData
        }
        if (this.data.end == '' || this.data.end == null) {
          this.data.start = this.currentQuestion
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'Add_AlreadyTopics', // 删除题组-小题
    ]),
    groupTopicHanlde () {
      this.$emit('hanlde-status', this.tabStatusVal)
      if (!this.tabStatus) {

        let datas = this.data
        let start = datas.start
        let end = datas.end
        let topicList = []
        for (let i = start; i <= end; i++) {
          let obj = {
            ...datas,
            pid: datas.id,
            id: `answer_${+new Date()}_${i}`,
            topic: i
          }
          topicList.push(obj)
        }

        //追加近临时题组
        this.Add_AlreadyTopics(topicList)
        // 抛向父级追加近数组
        this.$emit('add-answer-topic-group', { ...datas, childGroup: topicList })
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>