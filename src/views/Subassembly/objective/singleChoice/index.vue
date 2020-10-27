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
    <div class="add_question" @click="addGroupQuestion()">+ 分段添加小题</div>
    <div class="question-group">
      <template v-for="group in groupData">
        <div :key="group.id" class="group_item">
          <choice-group
            v-for="item in group.childGroup"
            :key="item.topice"
            :subtopic="item"
            @pre-edit-subtopic="preEditSubtopic"
          />
        </div>
      </template>
    </div>

  </div>
</template>

<script>
  import choiceTabs from './tabs'
  import choiceGroup from './groupItem'
  export default {
    components: {
      choiceTabs,
      choiceGroup
    },

    props: {
      groupData: {
        type: Array,
        default: () => [],
      }
    },

    data() {
      return {
      }
    },

    computed: {

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

      preEditSubtopic(subtopic){
        this.$emit('pre-edit-subtopic',subtopic)
      },

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