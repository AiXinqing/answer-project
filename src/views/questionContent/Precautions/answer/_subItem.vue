<template>
<div class="answer-sub-group">
  <div class="space_group_list">
      <span class="space_group_title">{{data.topic}}</span>
      <el-input v-model.number="data.score" size="mini" class="space_group_items"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click.stop="addLastAnswerItem">+ 添加小题</span>
      <i class="el-icon-del " @click.stop="delSubItem" >-</i>
  </div>
  <div class="last-group">
    <answer-last-item
      v-for="(item,i) in childGroup"
      :key="i"
      :last-item-data="item"
      @pre-edit-points-answer-group="preEditPointsAnswerGroup"
      @pre-edit-points-item="preEditPointsItem"
    />
  </div>
</div>
</template>

<script>
import answerLastItem from './_lastItem'
export default {
  props: {
    subChildData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    answerLastItem,
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    childGroup () {
      return this.data.childGroup
    }
  },
  watch: {
    subChildData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.subChildData
        }
        // if (this.data.childGroup.length > 0) {
        //   let sum = 0
        //   this.data.childGroup.forEach(item => {
        //     sum += item.score
        //   })
        //   this.data.score = sum
        // }
      }
    }
  },
  methods: {
    addLastAnswerItem () {
      let temporaryArr = JSON.parse(JSON.stringify(this.data.childGroup)) || []
      let datas = this.data
      let long = temporaryArr.length + 1
      let subObj = {
        ...datas,
        fid: datas.pid,
        sid: datas.fid,
        pid: datas.id,
        id: `answerLast_${+new Date()}_${datas.topic}_${long}`,
        topic: `${datas.topic}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })

      this.$emit('pre-edit-last-answer-item', { ...datas, childGroup: temporaryArr })
      // this.subTopic_number_calculate_already([{ ...datas, childGroup: temporaryArr }]) // 更新此题数据
    },
    preEditPointsAnswerGroup (obj, isDel = false) {
      // 添加小题下的小题
      this.$emit('pre-edit-points-answer-group', obj, isDel)
    },
    delSubItem () {
      this.$emit('pre-edit-last-answer-item', this.data, true)
    },
    preEditPointsItem (obj, isDel = false) {
      // 末尾题
      this.$emit('pre-edit-points-item', obj, isDel)
    }
  },
}
</script>

<style lang="less">
.space_group_items {
  margin-left: 36%;
}
.space_group_list {
  width: 100%;
}
.el-collapse {
  border-bottom: none;
}
.last-group{
  .answer-last-group{
    background-color:#f2f2f3;
  }
}
.answer-sub-group{
  .points-item{
    background-color: #fcfcfc;
  }
}
</style>





