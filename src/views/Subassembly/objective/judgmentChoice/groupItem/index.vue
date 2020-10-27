<template>
  <el-row >
    <el-col :span="4" class="question_tabtitle" >{{data.topic}}</el-col>
    <el-col :span="20" class="group_item_right">
      <div>
        <el-input v-model="data.score" size="mini" @blur="preEditSubtopic" onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"/>
        <span>分</span>
        <el-input v-model.number="data.select" disabled size="mini" @blur="preEditSubtopic" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
        <span>个选项</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
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

  computed: {
    ...mapState('questionType', [
        'letterList'
    ]),

    selectBox(){
      return this.activeName == 'judgmentChoice' ? ['T','F'] :
              this.letterList.slice(0,this.data.select)
    },

    selectWdith(){
      return 40 + this.data.select * 23
    },
  },

  watch: {
    subtopic: {
      immediate: true,
      handler () {
        let {score,select} = this.subtopic
        this.data = {
          ...this.subtopic,
          score: score == 0 ? '' : score,
          select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
        }
      }
    }
  },

  methods: {
    preEditSubtopic () {
      const {score,select} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      if(scoreVal !='' && select !=''){
        console.log(this.data)
        this.$emit('pre-edit-subtopic', {
          type:'judgmentChoice',
          data:{
            ...this.data,
            select: typeof(select)=='string' ? 4 : select <= 0 ? 1: select,
            score:Number(scoreVal),
            selectBox:this.selectBox,
            width:this.selectWdith,
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
  .el-row:last-child {
    border-bottom: none;
  }
}
</style>
