<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,每题</span>
    <el-input v-model.number="data.select" disabled size="mini" @blur="preQuestiongroup"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>个选项</span>
    <i class="el-icon-delete" @click="delSubtopicGroup" ></i>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    props: {
      group: {
        type: Object,
        default: () => { }
      },
      activeName:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        data: {
          editId:null
        }
      }
    },
    computed: {
      ...mapState('questionType', [
        'subTopic_number',
        'subTopic_number_already',
        'subTopic_number_determine',
        'letterList'
      ]),

      selectBox(){
        return this.activeName == 'judgmentChoice' ? ['T','F'] :
                this.letterList.slice(0,this.data.select)
      },

      selectWdith(){
        return 42 + this.data.select * 26
      },

      verify(){
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

      verifyStatus(){
        return this.verify && this.data.end  ? true : false
      },

      subTopicList(){
        const {start,end,score} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
        let group = []
        for (let index = start; index <= end; index++) {
          let subtopic = {
            ...this.data,
            score:Number(scoreVal),
            pid: this.data.id,
            id: 'judgment_' + index,
            topic: index,
            selectBox:this.selectBox,
            width:this.selectWdith,
          }
          group.push(subtopic)
        }
        return group
      }
    },

    watch: {
      group: {
        immediate: true,
        handler () {
          this.data = {
            ...this.group,
            score: this.group.score == 0 ? null:this.group.score
          }
        }
      }
    },

    methods: {
      ...mapMutations('questionType', [
        'subTopic_already_add',
        'already_pid_clean',
        'subTopic_number_calculate',
      ]),

      delSubtopicGroup() {
        this.$emit('del-subtopic-group',{type:this.activeName,subtopic:this.data})
      },

      preQuestiongroup(){
        const {score,select,pid} = this.data
        let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score

        this.$emit('group-verify-status', {
          str:this.verify,
          status:this.verifyStatus
        })

        if (!this.verifyStatus){

          let itemObj = {
            type: 'judgmentChoice',
            data: {
              ...this.data,
              score:Number(scoreVal),
              select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
              start: parseInt(this.data.start),
              childGroup: this.subTopicList
            }
          }
          this.$emit('update-group-subTopic',itemObj)
          // 先清除
          this.already_pid_clean(pid)
          // 后添加
          this.subTopic_already_add(this.subTopicList)
          this.subTopic_number_calculate()
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>