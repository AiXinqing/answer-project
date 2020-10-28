<template>
  <div class="space_box">
    <!-- <space-item
      v-for="(item, index) in topicGroup"
      :key="index"
      :space-item="item"
      :edit-id="editId"
      @hanlde-status="hanldeStatus"
      @hanlde-add-group-question="hanldeAddGroupQuestion"
      @hanlde-del-group="hanldeDelGroup"
    /> -->
    <question-group
      v-for="(subTopic, index) in questionGroups"
      :key="index"
      :subTopic="subTopic"
      :edit-id="editId"
      @del-question-group="delQuestionGroup"
      @pre-edit-question-group="preEditQuestionGroup"
      @change-status="changeStatus"
    />
    <div class="add_question" @click="addsubTopicGroup">+ 分段添加小题</div>
    <div class="question-group">
      <el-collapse >
        <!-- <group-item
          v-for="(item, index) in groupItemData"
          :key="index"
          :small-topic="item"
          @hanlde-subtopic-del="hanldeSubtopicDel"
          @topic-detail-add="topicDetailAdd"
          @change-space-value="ChangeSpaceValue"
          @hanlde-last-topic-del="hanldeLastTopicDel"
          @change-last-sub-topic-score="changeLastSubTopicScore"
        /> -->
        <!-- <sub-topic-item/> -->
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import questionGroup from './group'
  // import subTopicItem from './item'
  export default {
    components: {
      questionGroup,
      // subTopicItem,
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
      name() {
        return this.data
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
      addsubTopicGroup() {

      },
      
      preEditQuestionGroup(){},

      delQuestionGroup(id){
        this.$emit('del-question-group',id)
      },

      changeStatus(val){
        this.$emit('change-status',val)
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