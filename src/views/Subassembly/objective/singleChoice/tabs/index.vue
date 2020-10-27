<template>
  <div class="big-item">
    <span>从</span>
    <el-input v-model.number="data.start" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题到</span>
    <el-input v-model.number="data.end" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
    <span>题,每题</span>
    <el-input v-model="data.score" size="mini" @blur="preQuestiongroup" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span>分,每题</span>
    <el-input v-model.number="data.select" size="mini" @blur="preQuestiongroup"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
    <span>个选项</span>
    <i class="el-icon-delete" @click="subTopiceDel(data.id,activeNameItem)" ></i>
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
        'subTopic_number_determine'
      ]),
      
      verify(){
        const {start,end,score,id} = this.data
        let scoreVal = score ? parseFloat(score) : score
        let determine = this.subTopic_number_determine // 存在
        let already = this.subTopic_number_already // 临
        let startStr = ''
        let endStr = ''

        if(determine.length > 0 || already.length > 0){
          let M_startIndex = determine.findIndex(subTopic => subTopic.topice == start)
          let M_endindex = determine.findIndex(subTopic => subTopic.topice == end)
          let A_startIndex = already.findIndex(subTopic => subTopic.topice == start)
          let A_endindex = already.findIndex(subTopic => subTopic.topice == end)

          if(!this.editId){
            if (A_startIndex > -1) {
              if (already[A_startIndex].pid != id) {
                startStr = `${start}题已经存在，请勿重复添加`
              }
            } else { startStr = '' }

            if (A_endindex > -1) {
              if (already[A_endindex].pid != id) {
                endStr = `${end}题已经存在，请勿重复添加`
              }
            } else { endStr = '' }
          }else{

            if(M_startIndex > -1 || A_startIndex > -1){
              startStr = `${start}题已经存在，请勿重复添加`
              if (A_startIndex > -1) {
                if (determine[A_startIndex].pid != id) {
                  startStr = `${start}题已经存在，请勿重复添加`
                } else { startStr = '' }
              } else {
                startStr = `${start}题已经存在，请勿重复添加`
              }
            }else { startStr = '' }


            if(M_endindex > -1 || A_endindex > -1){
              endStr = `${end}题已经存在，请勿重复添加`

              if (A_endindex > -1) {
                if (already[A_endindex].pid != id) {
                  endStr = `${end}题已经存在，请勿重复添加`
                } else { endStr = '' }
              } else {
                endStr = `${end}题已经存在，请勿重复添加`
              }
            }else{endStr = ''}
          }

        }
        return start == 0 ? '开始题号必须大于0':
              end == 0 ? '结束题号必须大于0' :
              start == 0 && end ? '开始题号不能大于结束题号' :
                start != 0 && end && !scoreVal ? '分数不能为空' :
                  startStr.length > 0 ? startStr :
                  endStr.length > 0 ? endStr : ''
      },

      verifyStatus(){
        return !this.verify ? false : true
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
            id: 'single_' + index,
            topic: index
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
            ...this.group
          }
        }
      }
    },

    methods: {
    ...mapMutations('questionType', [
      'subTopic_already_add',
      'already_pid_clean',
    ]),
      subTopiceDel() {

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
            type: 'singleChoice',
            data: {
              ...this.data,
              score:Number(scoreVal),
              select: typeof(select)=='string' ? 4 :select,
              start: parseInt(this.data.start),
              childGroup: this.subTopicList
            }
          }
          this.$emit('update-group-subTopic',itemObj)
          // 先清除
          this.already_pid_clean(pid)
          // 后添加
          this.subTopic_already_add(this.subTopicList)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>