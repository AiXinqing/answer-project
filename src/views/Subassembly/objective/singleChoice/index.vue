<template>
  <div>
    <div class="big-question-box">
      <choice-tabs
        v-for="group in groupData"
        :key="group.id"
        :group="group"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
      />
    </div>
    <div class="add_question" @click="addGroupQuestion(activeName)">+ 分段添加小题</div>
    <div class="question-group">
      <template v-for="group in groupData">
        <div :key="group.id" class="group_item">
          <choice-group
            v-for="item in group.childGroup"
            :key="item.topice"
            :child-item="item"
            @edit-topic-func="editTopicFunc"
          />
        </div>
      </template>
    </div>

  </div>
</template>

<script>
  import choiceTabs from '../singleChoice/tabs'
  import choiceGroup from '../singleChoice/groupItem'
  export default {
    components: {
      choiceTabs,
      choiceGroup
    },
    props: {
      groupData: {
        type: Array,
        default: () => [],
      },
      editId: {
        teyp: Number,
        default: null
      }
    },
    data() {
      return {
        activeName: 'singleChoice',
        input: '',
        isdisabled: false,
        data:{}
      }
    },
    computed: {
      choice() {
        return ''
      }
    },
    watch: {
      groupData: {
        immediate: true,
        handler () {
          this.data = {
            ...this.groupData
          }
        }
      }
    },
    methods: {
      hanldeClick() {

      },
      addGroupQuestion(){},
      editTopicFunc(){},
      groupVerifyStatus(verify){
        this.$emit('group-verify-status', verify)
      },
      updateGroupSubTopic(group){
        this.$emit('update-group-subTopic',group)
      }
    },
  }
</script>

<style lang="less" scoped>

</style>