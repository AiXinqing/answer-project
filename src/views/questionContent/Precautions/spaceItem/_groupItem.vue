<template>
<!-- 题组小题 -->
  <el-collapse-item>
    <template slot="title">
      <space-group-list/>
    </template>
    <space-group-item />
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
  data () {
    return {
      data: {}
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