<template>
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
    <div class="add_question" @click="addsubTopicGroup">+ 分段添加小题</div>
    <div class="question-group">
      <el-collapse >
        <sub-topic-item
          v-for="(subtopic, index) in groupChild"
          :key="index"
          :group-subtopic="subtopic"
          @hanlde-subtopic-del="delSubTopicFirstlevel"
          @add-subtopic-firstlevel="addSubtopicFirstlevel"

          @change-firstlevel-space="changeFirstlevelSpace"
          @hanlde-last-topic-del="hanldeLastTopicDel"
          @change-last-sub-topic-score="changeLastSubTopicScore"
        />
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import questionGroup from '../fillInTheBlank/group'
  import subTopicItem from '../fillInTheBlank/elCollapseItem'
  export default {
    components: {
      questionGroup,
      subTopicItem,
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

      groupChild () {
        return this.groupData.map(question => question.childGroup).flat()
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

      preEditQuestionGroup(obj){
        console.log(obj)
        this.$emit('pre-edit-question-group',obj)
      },

      delQuestionGroup(id){
        this.$emit('del-question-group',id)
      },

      changeStatus(val){
        this.$emit('change-status',val)
      },

      delSubTopicFirstlevel (obj) {
        // 删除小题号
        this.$emit('del-subtopic-firstlevel', obj)
      },
      addSubtopicFirstlevel (obj) {
        // 添加小题空格数
        console.log(obj)
        this.$emit('add-subtopic-firstlevel', obj)
      },
      changeFirstlevelSpace (obj) {
        // 分值分数修改
        this.$emit('change-firstlevel-space', obj)
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
    height: 200px;
    overflow: auto;
    border: 1px solid #888;
    margin-top: 15px;
  }
</style>