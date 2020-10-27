<template>
  <el-row >
    <el-col :span="4" class="question_tabtitle">{{data.topic}}</el-col>
    <el-col :span="20" class="group_item_right">
      <div>
        <el-input v-model="data.score" size="mini" @blur="preEditSubtopic" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
        <span>分,少选得</span>
        <el-input v-model="data.lessScore" size="mini" @blur="preEditSubtopic" :max="data.score" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
        <span>分</span>
        <el-input v-model="data.select" size="mini" @blur="preEditSubtopic" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span>个选项</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    subtopic: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      data: {}
    }
  },
  watch: {
    subtopic: {
      immediate: true,
      handler () {
        this.data = {
          ...this.subtopic,
          score: this.subtopic.score == 0 ? '':this.subtopic.score,
          lessScore: this.subtopic.lessScore == 0 ? null:this.subtopic.lessScore,
        }
      }
    }
  },
  methods: {
    preEditSubtopic () {
      const {score,select,lessScore} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      let lessScoreVal = lessScore ? lessScore.toString().match(/^\d+(?:\.\d{0,1})?/) : lessScore

      if(scoreVal !='' && select !=''){
        console.log(this.data)
        this.$emit('pre-edit-subtopic', {
          type:'checkChoice',
          data:{
            ...this.data,
            select: typeof(select)=='string' ? 4 : select,
            score:Number(scoreVal),
            lessScore:Number(lessScoreVal),
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.group_item {
  .el-row {
    border-bottom: 1px solid #888;
  }
}
</style>
