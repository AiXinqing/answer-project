<template>
<!-- 填空题题组 -->
  <div class="space_box">
    <space-item
      v-for="(item, index) in topicGroup"
      :key="index"
      :space-item="item"
      @hanlde-status="hanldeStatus"
      @hanlde-add-group-question="hanldeAddGroupQuestion"
      @hanlde-del-group="hanldeDelGroup"
    />
    <div class="add_question" @click="hanldeAddSubtopic">+ 分段添加小题</div>
    <div class="question-group">
      <el-collapse >
        <group-item
          v-for="(item, index) in groupItemData"
          :key="index"
          :small-topic="item"
          @hanlde-subtopic-del="hanldeSubtopicDel"
          @topic-detail-add="topicDetailAdd"
          @change-space-value="ChangeSpaceValue"
        />
      </el-collapse>
    </div>
  </div>
</template>

<script>
import spaceItem from './fillInTheBlank/_item'
import groupItem from './fillInTheBlank/QuestionGroupDetail/_groupItem'
export default {
  components: {
    spaceItem,
    groupItem
  },
  props: {
    groupData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      activeNames: [],
      topicGroup: []
    }
  },
  computed: {
    groupItemData () {
      let arr = []
      this.topicGroup.map(item => {
        arr.push(...item.childGroup.map(row => row))
      })
      return arr
    }
  },
  watch: {
    groupData: {
      immediate: true,
      handler () {
        this.topicGroup = [...this.groupData]
      }
    }
  },
  methods: {
    hanldeAddSubtopic () {
      this.$emit('hanlde-add-sub-topic')
    },
    handleChange () { },
    hanldeStatus (val) {
      this.$emit('hanlde-status', val)
    },
    hanldeAddGroupQuestion (obj) {
      //添加题组
      this.$emit('hanlde-add-group-question', obj)
    },
    hanldeDelGroup (id) {
      //删除题组
      this.$emit('hanlde-del-group', id)
    },
    hanldeSubtopicDel (obj) {
      // 删除小题号
      this.$emit('hanlde-subtopic-del', obj)
    },
    topicDetailAdd (obj) {
      // 添加小题空格数
      this.$emit('topic-detail-add', obj)
    },
    ChangeSpaceValue (obj) {
      // 分值分数修改
      this.$emit('change-space-value', obj)
    },
  },
}
</script>

<style lang="less">
.space_box,
.add_question {
  margin-top: 20px;
}
.question-group {
  width: 100%;
  height: 200px;
  overflow: auto;
  border: 1px solid #888;
  margin-top: 15px;
}
</style>