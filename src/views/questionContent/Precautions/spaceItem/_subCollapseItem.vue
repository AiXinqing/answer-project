<template>
  <el-collapse-item>
      <template slot="title">
        <div class="Sub-question-group">
          <div class="sub-item-group">
            <span @click.stop="clickFun">(1) 共</span>
            <el-input v-model.number="subData.space" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
            <span @click.stop="clickFun"> 空 每空 </span>
            <el-input v-model.number="subData.score" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
            <span @click.stop="clickFun"> 分 共 {{subData.sum}} 分 </span>
          </div>
        </div>
      </template>
      <div class="space_group_item">
        <group-item
          v-for="(item, index) in groupItemData"
          :key="index"
          :small-topic="item"
          @hanlde-subtopic-del="hanldeSubtopicDel"
          @topic-detail-add="topicDetailAdd"
          @change-space-value="ChangeSpaceValue"
        />
      </div>
    </el-collapse-item>
</template>

<script>
import groupItem from './_groupItem'
export default {
  components: {
    groupItem
  },
  props: {
    subItemInfo: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      subData: {}
    }
  },
  computed: {
    GroupSmallTopic () {
      let changeObj = JSON.parse(JSON.stringify(this.subItemInfo))
      let space = changeObj.space
      let arr = []

      for (let i = 0; i < space; i++) {
        arr.push({ ...changeObj, subItemInfo: i })
      }
      return arr
    },
  },
  watch: {
    smallTopic: {
      immediate: true,
      handler () {
        this.subData = { ...this.smallTopic }
      }
    }
  },
  methods: {
    clickFun () {

    },
    ChangeSpaceValue () { }
  },
}
</script>

<style lang="less" scoped>
</style>