<template>
  <div class="big-item">
    <span>从</span>
    <!-- @keyup.native.stop="isVerifi" -->
    <el-input v-model.number="data.start" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>题,每空</span>
    <el-input v-model="data.score" size="mini" @blur="preEditQuestionGroup"  onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,每题</span>
    <el-input v-model.number="data.space" size="mini" @blur="preEditQuestionGroup" oninput="value=value.replace(/[^\d]/g,'')"/>
    <span>空</span>
    <i class="el-icon-delete" @click="delQuestionGroup" ></i>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    subTopic: {
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
      const {start,end,score} = this.data
        let scoreVal = score ? parseFloat(score) : score
        let determine = this.subTopic_number_determine
        let already = this.subTopic_number_already
        let strStart = ''
        let strEnd = ''
        if (determine.length > 0 || already.length > 0) {
          let d_s_index = determine.findIndex(item => item.topic == start)
          let a_s_index = already.findIndex(item => item.topic == start)

          let d_e_index = determine.findIndex(item => item.topic == end)
          let a_e_index = already.findIndex(item => item.topic == end)

          if (this.editId != null) { // 编辑
            if (a_s_index > -1) {
              if (already[a_s_index].pid != this.data.id) {
                strStart = `${start}题已经存在，请勿重复添加`
              }
            } else { strStart = '' }

            if (a_e_index > -1) {
              if (already[a_e_index].pid != this.data.id) {
                strEnd = `${end}题已经存在，请勿重复添加`
              }
            } else { strStart = '' }
          } else {
            if (d_s_index > -1 || a_s_index > -1) {
              if (a_s_index > -1) {
                if (already[a_s_index].pid != this.data.id) {
                  strStart = `${start}题已经存在，请勿重复添加`
                } else { strStart = '' }
              } else {
                strStart = `${start}题已经存在，请勿重复添加`
              }
            } else { strStart = '' }

            if (d_e_index > -1 || a_e_index > -1) {
              if (a_e_index > -1) {
                if (already[a_e_index].pid != this.data.id) {
                  strEnd = `${end}题已经存在，请勿重复添加`
                } else { strStart = '' }
              } else {
                strEnd = `${end}题已经存在，请勿重复添加`
              }
            } else { strStart = '' }
          }

        }

        return start == 0 ? '开始题号必须大于0' :
          end == 0 ? '结束题号必须大于0' :
            start == 0 && end != null ? '开始题号不能大于结束题号' :
              start > end && end != null ? '开始题号不能大于结束题号' :
                start != 0 && end != null && scoreVal == null ? '分数不能为空' :
                  strStart.length > 0 ? strStart :
                    strEnd.length > 0 ? strEnd : ''
    },

    tabStatus () {
      return this.verify && this.data.end  ? true : false
    },

    subTopicList(){
      const {score,end,space,start,id} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      let group = []
      for (let index = start; index <= end; index++) {
        let subtopic = {
          score: Number(scoreVal),
          end: end,
          space: space,
          start: start,
          pid: id,
          id: `${id}_${+new Date()}_${index}`,
          topic: index,
          sum: score * space,
        }
        group.push(subtopic)
      }
      return group
    }
  },

  watch: {
    subTopic: {
      immediate: true,
      handler () {
        this.data = {
          ...this.subTopic
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

    preEditQuestionGroup () {
      this.$emit('change-status', this.tabStatusVal)
      console.log(this.subTopicList)
      if (!this.tabStatus) {
        let obj = {
          ...this.data,
          childGroup: this.subTopicList
        }
        // 弹框临时小题数
        const temporaryArr = this.subTopicList.map(item => ({ ...item, subtopic: 1 }))
        this.subTopic_already_add(temporaryArr)
        // temporaryArr
        this.$emit('pre-edit-question-group', obj)
        this.subTopic_number_calculate()
      }
    },

    delQuestionGroup () {
      // 题组删除
      this.$emit('del-question-group', this.data.id)
    },

  },
}
</script>

<style lang="less">
  .el-input--mini .el-input__inner{
    padding: 0 0;
    text-align: center;
  }
</style>