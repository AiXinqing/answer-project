<template>
<!-- 题组小题 -->
  <el-collapse-item>
    <template slot="title">
      <div class="space_group_list">
        <span>题 1 共 </span>
        <el-input v-model.number="data.space" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span> 空 每空 </span>
        <el-input v-model.number="data.end" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
        <span> 分 共 4 分 </span>
        <span class="add_groupTopic">+ 添加小题</span>
        <i class="el-icon-delete" @click="hanldeDel" ></i>
      </div>
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
  methods: {
    hanldeDel () {

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
i.el-icon-delete {
  margin-left: 30px;
}
</style>