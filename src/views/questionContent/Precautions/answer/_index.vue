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
      let {start,end} = this.data

      let determineTopic = this.determineTopic
      let AlreadyTopics = this.AlreadyTopics

      let strStart = ''
      let strEnd = ''

      if (determineTopic.length > 0 || AlreadyTopics.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == start)
        let numEnd = determineTopic.findIndex(item => item.topic == end)
        let index = AlreadyTopics.findIndex(item => item.topic == start)
        let endIndex = AlreadyTopics.findIndex(item => item.topic == start)
        if (this.editId != null) { // 编辑
          if (index > -1) {
            if (AlreadyTopics[index].pid != this.data.id) {
              strStart = `${start}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numStart > -1 || index > -1) {
            if (index > -1) {
              if (AlreadyTopics[index].pid != this.data.id) {
                strStart = `${start}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strStart = `${start}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
        if (this.editId != null) { // 编辑
          if (endIndex > -1) {
            if (AlreadyTopics[endIndex].pid != this.data.id) {
              strEnd = `${end}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numEnd > -1 || endIndex > -1) {
            if (endIndex > -1) {
              if (AlreadyTopics[endIndex].pid != this.data.id) {
                strEnd = `${end}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strEnd = `${end}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
      }
      return start == 0 ? '开始题号必须大于0' :
        end == 0 ? '开始题号必须大于0' :
          start == 0 && end != null ? '开始题号不能大于结束题号' :
            start > end && end != null ? '开始题号不能大于结束题号' :
              strStart != '' ? strStart :
                strEnd != '' ? strStart : ''
    },
    tabStatus () {
      let {start,end} = this.data

      let determineTopic = this.determineTopic
      let AlreadyTopics = this.AlreadyTopics

      let strStart = ''
      let strEnd = ''

      if (determineTopic.length > 0 || AlreadyTopics.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == start)
        let numEnd = determineTopic.findIndex(item => item.topic == end)
        let index = AlreadyTopics.findIndex(item => item.topic == start)
        let endIndex = AlreadyTopics.findIndex(item => item.topic == start)
        if (this.editId != null) { // 编辑
          if (index > -1) {
            if (AlreadyTopics[index].pid != this.data.id) {
              strStart = `${start}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numStart > -1 || index > -1) {
            if (index > -1) {
              if (AlreadyTopics[index].pid != this.data.id) {
                strStart = `${start}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strStart = `${start}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
        if (this.editId != null) { // 编辑
          if (endIndex > -1) {
            if (AlreadyTopics[endIndex].pid != this.data.id) {
              strEnd = `${end}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numEnd > -1 || endIndex > -1) {
            if (endIndex > -1) {
              if (AlreadyTopics[endIndex].pid != this.data.id) {
                strEnd = `${end}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strEnd = `${end}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
      }
      return start == 0 ? true :
        end == 0 ? true :
          start == 0 && end != null ? true :
            start > end && end != null ? true :
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
            topic: i,
            childGroup: [],
            score: 1,
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