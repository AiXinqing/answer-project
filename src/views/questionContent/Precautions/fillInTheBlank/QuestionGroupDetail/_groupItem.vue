<template>
<!-- 题组小题 -->
  <el-collapse-item>
    <template slot="title">
      <div class="space_group_list">
        <span @click.stop="clickFun">题 {{data.topic}} 共 </span>
        <span v-if=" data.childGroup == undefined">
          <el-input v-model.number="data.space" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
          <span @click.stop="clickFun"> 空 每空 </span>
          <el-input v-model.number="data.score" size="mini" @click.stop.native="clickFun" @blur="ChangeSpaceValue"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
          <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
        </span>
        <span v-else>{{data.sum}} 分</span>
        <span class="add_groupTopic" @click.stop="topicDetailAdd(data)">+ 添加小题</span>
        <i class="el-icon-del" @click.stop="hanldeSubtopicDel(data)" ></i>
      </div>
    </template>
    <component
      :is="isComponent"
      :sub-item-data="GroupSmallTopic"
      :sub-child-data="data.childGroup"
    />
  </el-collapse-item>
</template>

<script>
import subItem from './_subItem' // 空
import lastGroupItem from './_lastGroupItem' // 小题详情下小题组
export default {
  components: {
    subItem,
    lastGroupItem,
  },
  props: {
    smallTopic: {
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
    GroupSmallTopic () {
      let changeObj = JSON.parse(JSON.stringify(this.smallTopic))
      let space = changeObj.space
      let arr = []

      for (let i = 0; i < space; i++) {
        arr.push({ ...changeObj, smallTopic: i })
      }
      return arr
    },
    isComponent () {
      return this.data.childGroup == undefined ? subItem : lastGroupItem
    }
  },
  watch: {
    smallTopic: {
      immediate: true,
      handler () {
        this.data = { ...this.smallTopic }
      }
    }
  },
  mounted () {
    this.data = JSON.parse(JSON.stringify(this.smallTopic))
  },
  methods: {
    hanldeSubtopicDel (obj) {
      // 删除小题号
      this.$emit('hanlde-subtopic-del', obj)
    },
    topicDetailAdd (obj) {
      // 添加小题空格数
      this.$emit('topic-detail-add', obj)
    },
    ChangeSpaceValue () {
      this.$emit('change-space-value', this.data)
    },
    clickFun () { }
  },

}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.space_group_item {
  text-align: center;
  &:last-child {
    margin-bottom: 10px;
  }
}
.space_group_item .el-input--mini {
  width: 48px;
  margin: 0 10px;
}
.space_group_list {
  padding-left: 1em;
}
.space_group_list .el-input--mini {
  width: 48px;
}
.add_groupTopic {
  font-size: 16px;
  margin-left: 50px;
  color: @main;
  position: absolute;
  right: 80px;
}
i.el-icon-del {
  margin-left: 30px;
  position: absolute;
  right: 50px;
  background-color: #1ab394;
  font-size: 12px;
  width: 12px;
  height: 1px;
  top: 6px;
  margin: 20px 0;
}
.el-collapse-item__content {
  padding-bottom: 0px !important;
}
.el-collapse-item__header {
  position: relative;
  min-height: 48px;
}
</style>