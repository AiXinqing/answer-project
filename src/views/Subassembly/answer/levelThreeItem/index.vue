<template>
<div class="answer-last-group">
  <div class="space_group_list">
      <span class="space_group_title">{{lastData.topic}}</span>
      <el-input v-model.number="lastData.score" size="mini" class="space_group_items"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click="pointsAnswerGroup">+ 添加小题</span>
      <i class="el-icon-del " @click="delLastItem">-</i>
  </div>
  <div class="points-item">
    <points-item
      v-for="(item,i) in pointsData"
      :key="i"
      :points-item-data="item"
      @pre-edit-last-subtopic="preEditLastSubtopic"
    />
    <!-- @pre-edit-points-item="preEditPointsItem" -->
  </div>
</div>
</template>

<script>
import pointsItem from '../item'
export default {
  props: {
    lastItemData: {
      type: Object,
      default: () => { }
    },
  },
  components: {
    pointsItem,
  },
  data () {
    return {
      lastData: {}
    }
  },
  computed: {
    pointsData () {
      return this.lastData.childGroup
    }
  },
  watch: {
    lastItemData: {
      immediate: true,
      handler () {
        this.lastData = {
          ...this.lastItemData
        }
        if (this.lastData.childGroup.length > 0) {
          let sum = 0
          this.lastData.childGroup.forEach(item => {
            sum += item.score
          })
          this.lastData.score = sum
        }
      }
    }
  },
  methods: {
    pointsAnswerGroup () {
      let temporaryArr = JSON.parse(JSON.stringify(this.lastData.childGroup)) || []
      let datas = this.lastData
      let long = temporaryArr.length + 1

      let subObj = {
        ...datas,
        spId: datas.sid,
        sid: datas.fid,
        fid: datas.pid,
        pid: datas.id,
        id: `answerPoints_${+new Date()}_${datas.topic}_${long}`,
        topic: `${datas.topic}.${long}`,
        score: 1
      }
      temporaryArr.push({ ...subObj, childGroup: [] })

      this.$emit('pre-edit-points-answer-group', { ...datas, childGroup: temporaryArr })
    },
    delLastItem () {
      this.$emit('pre-edit-points-answer-group', this.lastData, true)
    },
    // preEditPointsItem (obj, isDel = false) {
    //   // 末尾题
    //   this.$emit('pre-edit-points-item', obj, isDel)
    // }
    preEditLastSubtopic(subtopic){
      this.$emit('pre-edit-last-subtopic',subtopic)
    }
  },
}
</script>

<style lang="less" >
.el-collapse {
  border-bottom: none !important;
}
.space_group_title {
  position: relative;
  width: 100px;
  display: inline-block;
  text-indent: 1em;
}
</style>
<style lang="less" scoped>
.space_group_items {
  margin-left: 36%;
}
.answer-last-group{
  width:100%;
}
.space_group_title{
  position: relative;
  left: 1em;
}
</style>