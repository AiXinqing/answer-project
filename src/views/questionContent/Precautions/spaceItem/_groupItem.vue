<template>
<!-- 题组小题 -->
  <el-collapse-item>
    <template slot="title">
      <space-group-list />
    </template>
    <space-group-item
      v-for="item in GroupSmallTopic"
      :key="item.id"
      :group-small-topic="item"
    />
  </el-collapse-item>
</template>

<script>
import spaceGroupItem from './_spaceGroupItem'
import spaceGroupList from './_spaceGroupList'
export default {
  components: {
    spaceGroupItem,
    spaceGroupList
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
      let i = 1
      while (i < space) {
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
</style>