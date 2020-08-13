<template>
<!-- 题组小题 -->
  <el-collapse-item>
    <template slot="title">
      <div class="space_group_list">
        <span @click.stop="clickFun">题 {{data.topic}} 共 </span>
        <el-input v-model.number="data.space" size="mini" @click.stop.native="clickFun"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span @click.stop="clickFun"> 空 每空 </span>
        <el-input v-model.number="data.score" size="mini" @click.stop.native="clickFun"  onkeyup.stop.native="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
        <span class="add_groupTopic" @click.stop="topicDetailAdd(data)">+ 添加小题空格</span>
        <i class="el-icon-delete" @click.stop="hanldeSubtopicDel(data)" ></i>
      </div>
    </template>
    <space-group-item
      v-for="(item,index) in GroupSmallTopic"
      :key="index"
      :group-small-topic="item"
      :number="index + 1"
    />
  </el-collapse-item>
</template>

<script>
import spaceGroupItem from './_spaceGroupItem'
export default {
  components: {
    spaceGroupItem,
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
      let space = this.data.space
      let arr = []

      for (let i = 0; i < space; i++) {
        arr.push({ ...this.data, smallTopic: i })
      }
      return arr
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
  methods: {
    hanldeSubtopicDel (obj) {
      // 删除小题号
      this.$emit('hanlde-subtopic-del', obj)
    },
    topicDetailAdd (obj) {
      // 添加小题空格数
      this.$emit('topic-detail-add', obj)
    },
    clickFun () { }
  },

}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.space_group_item {
  text-align: center;
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
}
i.el-icon-delete {
  margin-left: 30px;
}
.el-collapse-item__content {
  padding-bottom: 10px !important;
}
</style>