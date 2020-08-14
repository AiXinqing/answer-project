<template>
  <el-collapse-item>
      <template slot="title">
        <div class="Sub-question-group">
          <div class="sub-item-group">
            <span @click.stop="clickFun">({{number}}) 共</span>
            <el-input v-model.number="subData.space" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
            <span @click.stop="clickFun"> 空 每空 </span>
            <el-input v-model.number="subData.score" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
            <span @click.stop="clickFun"> 分 共 {{subData.sum}} 分 </span>
            <i class="el-icon-circle-clos" @click.stop="hanldeLastTopicDel(subData)" >删除</i>
          </div>
        </div>
      </template>
      <div class="space_group_item">
        <air-item
          v-for="(item, index) in GroupSmallTopic"
          :key="index"
          :group-small-topic="item"
          @change-last-sub-topic-score="changeLastSubTopicScore"
        />
      </div>
    </el-collapse-item>
</template>

<script>
import airItem from './_airItem'
export default {
  components: {
    airItem
  },
  props: {
    subItemInfo: {
      type: Object,
      default: () => { }
    },
    number: {
      type: Number,
      default: 1
    }
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
      console.log(arr)
      return arr
    },
  },
  watch: {
    subItemInfo: {
      immediate: true,
      handler () {
        this.subData = { ...this.subItemInfo }
      }
    }
  },
  methods: {
    clickFun () {

    },
    ChangeSpaceValue () { },
    hanldeLastTopicDel (obj) {
      this.$emit('hanlde-last-topic-del', obj)
    },
    changeLastSubTopicScore (obj) {
      // last-sub分值改变
      this.$emit('change-last-sub-topic-score', obj)
    }
  },
}
</script>

<style lang="less" scoped>
.el-collapse-item__header {
  height: auto;
  min-height: 48px;
}
.sub-item-group .el-input--mini {
  width: 48px;
}
.el-icon-circle-clos {
  position: absolute;
  right: 40px;
  top: 17px;
  font-size: 12px;
  cursor: pointer;
  color: #1ab394;
}
</style>