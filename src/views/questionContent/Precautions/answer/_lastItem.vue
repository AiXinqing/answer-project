<template>
<el-collapse-item>
  <template slot="title">
  <div class="space_group_list">
      <span class="space_group_title">{{lastData.topic}}</span>
      <el-input v-model.number="lastData.score" size="mini" class="space_group_items"   onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
      <span> 分</span>
      <span class="add_groupTopic" @click="pointsAnswerGroup">+ 添加小题</span>
      <i class="el-icon-del " >-</i>
  </div>
  </template>
  <el-collapse v-show="pointsData.length > 0">
    <points-item
      v-for="(item,i) in pointsData"
      :key="i"
      :points-item-data="item"
    />
  </el-collapse>
</el-collapse-item>
</template>

<script>
import pointsItem from './_pointsItem'
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
        // if (this.lastData.childGroup.length > 0) {
        //   let sum = 0
        //   this.lastData.childGroup.forEach(item => {
        //     sum += item.score
        //   })
        //   this.lastData.score = sum
        // }
      }
    }
  },
  methods: {
    pointsAnswerGroup () {
      let temporaryArr = JSON.parse(JSON.stringify(this.lastData.childGroup)) || []
      let datas = this.lastData
      let long = temporaryArr.length + 1
      console.log(datas)
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

      this.$emit('add-points-answer-group', { ...datas, childGroup: temporaryArr })
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
}
</style>
<style lang="less" scoped>
.space_group_items {
  margin-left: 36%;
}
</style>