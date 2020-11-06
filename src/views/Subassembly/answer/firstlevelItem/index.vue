<template>
<div class="answer_group">
  <div class="space_group_list">
      <span class="space_group_title">{{data.topic}}</span>
      <el-input
        v-model="data.score"
        :disabled="isDisable" size="mini"
        class="space_group_item"
        @blur="preEditFirstSubtopic"
        onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addSubAnswerItem">+ 添加小题</span>
      <i class="el-icon-del " @click.stop="delFirstSubtopic">-</i>
  </div>
  <div class="sub_item" v-show="childGroup.length > 0">
    <level-two-item
      v-for="(item,i) in childGroup"
      :key="i"
      :sub-child-data="item"
      @pre-edit-last-answer-item="preEditLastAnswerItem"
      @pre-edit-points-answer-group="preEditPointsAnswerGroup"
      @pre-edit-last-subtopic="preEditLastSubtopic"
      @pre-edit-two-subtopic="preEditTwoSubtopic"
    />
  </div>
</div>
</template>

<script>
import levelTwoItem from '../levelTwoItem'
import { mapMutations } from 'vuex'
function  reducer(obj, count = 0){
  if (obj.childGroup && obj.childGroup.length) {
    return obj.childGroup.reduce((acc, item) => {
        return reducer(item, acc);
    }, count);
  }
  return count + obj.score
}
export default {
  components: {
    levelTwoItem,
  },
  props: {
    childData: {
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
    childGroup () {
      return this.data.childGroup
    },

    isDisable(){
      let {childGroup} = this.childData
      return childGroup && childGroup.length ? true : false
    }
  },
  watch: {
    childData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.childData,
          score: reducer(this.childData,0)
        }
      }
    }
  },
  methods: {
    ...mapMutations('questionType', [
      'subTopic_number_calculate_already',
      'subTopic_already_del'
    ]),
    addSubAnswerItem () {
      let temporaryArr = JSON.parse(JSON.stringify(this.data.childGroup)) || []
      let {pid,id,topic} = this.data
      let long = temporaryArr.length + 1
      let subObj = {
        ...this.data,
        fid: pid,
        pid: id,
        id: `answerSub_${+new Date()}_${topic}_${long}`,
        topic: `${topic}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })


      this.$emit('pre-edit-sub-answer-item', { ...this.data, childGroup: temporaryArr })
      this.subTopic_number_calculate_already([{ ...this.data, childGroup: temporaryArr }]) // 更新此题数据
    },

    preEditFirstSubtopic(){
      let {score} = this.data
      let scoreVal = score ? score.toString().match(/^\d+(?:\.\d{0,1})?/) : score
      this.$emit('pre-edit-sub-answer-item', {
          ...this.data,
          score:Number(scoreVal)
        })
    },

    delFirstSubtopic(){
      this.$emit('pre-edit-sub-answer-item', this.data, true)
      this.subTopic_already_del([this.data])
    },

    preEditLastAnswerItem (obj, isDel) {
      // 新增小题下小题
      this.$emit('pre-edit-last-answer-item', obj, isDel)
    },

    delAnswerItem () {
      // 二级删除
      this.$emit('pre-edit-sub-answer-item', this.data, true)
      this.subTopic_already_del([this.data])
    },

    preEditTwoSubtopic(obj,isDel){
      //二级小题
      this.$emit('pre-edit-two-subtopic', obj,isDel)
    },

    preEditPointsAnswerGroup (obj, isDel = false) {
      // 三级小题
      this.$emit('pre-edit-points-answer-group', obj, isDel)
    },

    preEditLastSubtopic(subtopic){
      // 最后一级
      this.$emit('pre-edit-last-subtopic',subtopic)
    },


  },
}
</script>

<style lang="less">
  .question-group{
    .answer_group{
      align-items: center;
      line-height: 48px;
      background-color: #FFF;
      color: #303133;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: border-bottom-color .3s;
      outline: 0;
      .space_group_list{
        border-bottom: 1px solid #ddd;
        position: relative;
      }

      .points_list{
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>


<style lang="less" scoped>

.space_group_item {
  margin-left: 38%;
}
.el-collapse {
  border-bottom: none;
}

.sub_item{

  .answer-sub-group{
    text-indent:2%;
    background-color: #e4e5e7; // rgba(238, 238, 238, 0.8)
    .add_groupTopic{
      right: 50px;
    }
  }
}
</style>
