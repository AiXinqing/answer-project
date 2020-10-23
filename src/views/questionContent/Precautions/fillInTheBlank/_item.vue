<template>
  <div class="big-item">
    <span>从</span>
    <!-- @keyup.native.stop="isVerifi" -->
    <el-input v-model.number="data.start" size="mini" @blur="groupTopicHanlde"   onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每空</span>
    <el-input v-model="data.score" size="mini" @blur="groupTopicHanlde"  onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
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
    editId: {
      tyoe: Number,
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
      'subTopic_number',
      'subTopic_number_already',
      'subTopic_number_determine', // 确定小题数值
    ]),
    tabStatusVal () {
      let {start,end,score} = this.data
      let itemStart = start || 0
      let itemEnd = end || null
      let itemScore = score || 0
      let subTopic_number_determine = this.subTopic_number_determine
      let strStart = ''
      let strEnd = ''

      let subTopic_number_already = this.subTopic_number_already


      if (subTopic_number_determine.length > 0 || subTopic_number_already.length > 0) {
        let numStart = subTopic_number_determine.findIndex(item => item.topic == itemStart)
        let index = subTopic_number_already.findIndex(item => item.topic == itemStart)
        let numEnd = subTopic_number_determine.findIndex(item => item.topic == itemEnd)
        let endIndex = subTopic_number_already.findIndex(item => item.topic == itemStart)
        if (this.editId != null) { // 编辑
          if (index > -1) {
            if (subTopic_number_already[index].pid != this.data.id) {
              strStart = `${itemStart}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numStart > -1 || index > -1) {
            if (index > -1) {
              if (subTopic_number_already[index].pid != this.data.id) {
                strStart = `${itemStart}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strStart = `${itemStart}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
        if (this.editId != null) { // 编辑
          if (endIndex > -1) {
            if (subTopic_number_already[endIndex].pid != this.data.id) {
              strEnd = `${itemEnd}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numEnd > -1 || endIndex > -1) {
            if (endIndex > -1) {
              if (subTopic_number_already[endIndex].pid != this.data.id) {
                strEnd = `${itemEnd}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strEnd = `${itemEnd}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
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
      let {start,end,score} = this.data
      let itemStart = start || 0
      let itemEnd = end || null
      let itemScore = score || 0
      let subTopic_number_determine = this.subTopic_number_determine
      let subTopic_number_already = this.subTopic_number_already
      let strStart = ''
      let strEnd = ''
      if (subTopic_number_determine.length > 0 || subTopic_number_already.length > 0) {
        let numStart = subTopic_number_determine.findIndex(item => item.topic == itemStart)
        let index = subTopic_number_already.findIndex(item => item.topic == itemStart)
        let numEnd = subTopic_number_determine.findIndex(item => item.topic == itemEnd)
        let endIndex = subTopic_number_already.findIndex(item => item.topic == itemStart)

        if (this.editId != null) { // 编辑
          if (index > -1) {
            if (subTopic_number_already[index].pid != this.data.id) {
              strStart = `${itemStart}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numStart > -1 || index > -1) {
            if (index > -1) {
              if (subTopic_number_already[index].pid != this.data.id) {
                strStart = `${itemStart}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strStart = `${itemStart}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        }
        if (this.editId != null) { // 编辑
          if (endIndex > -1) {
            if (subTopic_number_already[endIndex].pid != this.data.id) {
              strEnd = `${itemEnd}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
        } else {
          if (numEnd > -1 || endIndex > -1) {
            if (endIndex > -1) {
              if (subTopic_number_already[endIndex].pid != this.data.id) {
                strEnd = `${itemEnd}题已经存在，请勿重复添加`
              } else { strStart = '' }
            } else {
              strEnd = `${itemEnd}题已经存在，请勿重复添加`
            }
          } else { strStart = '' }
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
          this.data.start = this.subTopic_number
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'subTopic_number_calculate',
      'subTopic_already_add',
    ]),
    groupTopicHanlde () {
      this.$emit('hanlde-status', this.tabStatusVal)
      if (!this.tabStatus) {
        let subtopicArr = []
        const {score,end,space,start,id} = this.data
        for (let index = this.data.start; index <= this.data.end; index++) {
          subtopicArr.push({
            score: score,
            end: end,
            space: space,
            start: start,
            pid: id,
            id: `${id}_${+new Date()}_${index}`,
            topic: index,
            sum: score * space,
          })
        }
        let obj = {
          ...this.data,
          childGroup: subtopicArr
        }
        // 弹框临时小题数
        const temporaryArr = subtopicArr.map(item => ({ ...item, subtopic: 1 }))
        this.subTopic_already_add(temporaryArr)
        // temporaryArr
        this.$emit('hanlde-add-group-question', obj)
        this.subTopic_number_calculate()
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

<style lang="less">
  .el-input--mini .el-input__inner{
    padding: 0 0;
    text-align: center;
  }
</style>