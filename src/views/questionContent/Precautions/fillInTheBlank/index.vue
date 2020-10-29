<template>
<!-- 填空题题组 -->
  <div class="space_box">
    <question-group
      v-for="(subTopic, index) in questionGroups"
      :key="index"
      :subTopic="subTopic"
      :edit-id="editId"
      @del-question-group="delQuestionGroup"
      @pre-edit-question-group="preEditQuestionGroup"
      @change-status="changeStatus"
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
          @hanlde-last-topic-del="hanldeLastTopicDel"
          @change-last-sub-topic-score="changeLastSubTopicScore"
        />
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import questionGroup from './_item'
import groupItem from './QuestionGroupDetail/_groupItem' //'./fillInTheBlank/QuestionGroupDetail/_groupItem'
export default {
  components: {
    questionGroup,
    groupItem
  },
  props: {
    groupData: {
      type: Array,
      default: () => []
    },
    editId: {
      tyoe: Number,
      default: null
    }
  },
  data () {
    return {
      activeNames: [],
      questionGroups: []
    }
  },
  computed: {
    ...mapState('questionType', [
      'subTopic_number',
    ]),
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
        this.questionGroups = [...this.groupData]
      }
    }
  },
  methods: {
    hanldeAddSubtopic () {
      this.$emit('hanlde-add-sub-topic')
    },
    handleChange () { },

    delQuestionGroup(id){
      this.$emit('del-question-group',id)
    },

    changeStatus(val){
      this.$emit('change-status',val)
    },

    addsubTopicGroup() {
      let group = {
        start: this.subTopic_number,
        end: null,
        score: null,
        space: 1,
        id: `spaceTopic_${+new Date()}`,
        childGroup: [],
      }

      this.$emit('add-subTopic-group',group)
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
    hanldeLastTopicDel (obj) {
      // 删除小题last题组item
      this.$emit('hanlde-last-topic-del', obj)
    },
    changeLastSubTopicScore (obj, oldObj) {
      // last-sub分值改变
      this.$emit('change-last-sub-topic-score', obj, oldObj)
    }
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
  height: 260px;
  overflow: auto;
  border: 1px solid #888;
  margin-top: 15px;
}
</style>