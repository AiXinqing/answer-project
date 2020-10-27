<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="hanldeClick" class="card_top">
    <template  v-for="(item, i) in tabPaneData">
      <el-tab-pane
        :key="i"
        :label="item.label"
        :name="item.name"
        :disabled="isdisabled"
      >
        <component
          :is="item.name"
          :active-name="item.name"
          :group-data="grouptopic[item.name]"
          @group-verify-status="groupVerifyStatus"
          @update-group-subTopic="updateGroupSubTopic"
          @pre-edit-subtopic="preEditSubtopic"
          @add-group-question="addGroupQuestion"
          @del-subtopic-group="delSubtopicGroup"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
  import singleChoice from '../objective/singleChoice'
  import checkChoice from '../objective/checkChoice'
  import judgmentChoice from '../objective/judgmentChoice'
  import {mapState} from 'vuex'
  export default {
    components: {
      singleChoice,
      checkChoice,
      judgmentChoice
    },
    props: {
      questionGroup: {
        type: Object,
        default: () => { },
      }
    },
    data() {
      return {
        activeName: 'singleChoice',
        isdisabled: false,
        grouptopic:{}
      }
    },
    computed: {
      ...mapState('questionType',['tabPaneData']),
    },
    watch: {
      questionGroup: {
        immediate: true,
        handler () {
          this.grouptopic = {
            ...this.questionGroup
          }
          console.log(this.grouptopic)
        }
      }
    },
    methods: {
      hanldeClick(tab) {
        this.activeName = tab.name
      },

      groupVerifyStatus(verify){
        this.isdisabled = verify.status
        this.$emit('group-verify-status', verify)
      },

      updateGroupSubTopic(group){
        this.$emit('update-group-subTopic',group)
      },

      preEditSubtopic(subtopic){
        this.$emit('pre-edit-subtopic',subtopic)
      },

      addGroupQuestion(group){
        this.$emit('add-group-question',group)
      },

      delSubtopicGroup(subtopic) {
        this.$emit('del-subtopic-group',subtopic)
      },
    },
  }
</script>

<style lang="less" scoped>

</style>