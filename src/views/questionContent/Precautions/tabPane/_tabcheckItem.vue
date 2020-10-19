<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
    <span>分,少选</span>
    <el-input v-model="data.lessScore" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
    <span>得分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="singleBoxHanlde" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
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
    },
    editIds: {
      teyp: Number,
      default: null
    }
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
      'determineTopic'
    ]),
    tabStatusVal () {
      let {start,end,score} = this.data
      let itemScore = parseFloat(score) || null

      let AlreadyTopics = this.AlreadyTopics
      let determineTopic = this.determineTopic
      let strStart = ''
      let strEnd = ''

      if (determineTopic.length > 0 || AlreadyTopics.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == start)
        let index = AlreadyTopics.findIndex(item => item.topic == start)
        let numEnd = determineTopic.findIndex(item => item.topic == end)
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
        end == 0 && end != null ? '结束题号必须大于0' :
          start == 0 && end != null ? '开始题号不能大于结束题号' :
            start > end && end != null ? '开始题号不能大于结束题号' :
              start != 0 && end != null && itemScore == 0 ? '分数不能为空' :
                strStart != '' ? strStart :
                  strEnd != '' ? strStart : ''
    },
    tabStatus () {
      let start = this.data.start || 0
      let end = this.data.end || null
      let itemScore = this.data.score || 0
      let AlreadyTopics = this.AlreadyTopics
      let determineTopic = this.determineTopic
      let strStart = ''
      let strEnd = ''

      if (determineTopic.length > 0 || AlreadyTopics.length > 0) {
        let numStart = determineTopic.findIndex(item => item.topic == start)
        let index = AlreadyTopics.findIndex(item => item.topic == start)
        let numEnd = determineTopic.findIndex(item => item.topic == end)
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
      return start == 0 && end != null ? true :
        end < start && end != null ? true :
          end != null && itemScore == 0 ? true :
            start != 0 && end != null && itemScore == 0 ? true :
              strStart != '' ? true :
                strEnd != '' ? true : false;
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
      'set_currentQuestion'
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
        let {end,score,lessScore,select} = this.data
        lessScore = lessScore == null ? '' : lessScore
        let itemSelect = typeof(select)=='string' ? 4 : select

        //
        for (let index = this.data.start; index <= this.data.end; index++) {
          let subtopic = {
            pid: this.data.id,
            id: 'check_' + index,
            score:Number(score.toString().match(/^\d+(?:\.\d{0,1})?/)),
            lessScore: lessScore != null ? Number(lessScore.toString().match(/^\d+(?:\.\d{0,1})?/)) : null,
            select: itemSelect,
            topic: index
          }
          subtopicArr.push(subtopic)
        }
        let itemObj = {
          type: 'checkbox',
          data: {
            start: parseInt(this.data.start),
            end: end,
            score:Number(score.toString().match(/^\d+(?:\.\d{0,1})?/)),
            lessScore:lessScore != null ? Number(lessScore.toString().match(/^\d+(?:\.\d{0,1})?/)) : null,
            select: itemSelect,
            id: this.data.id,
            childGroup: subtopicArr
          }
        }
        // temporaryArr
        this.$emit('hanlde-add-group-question', itemObj)
        this.set_currentQuestion()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>