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
        grouptopic:{},
        errorStr:'',
        verifyStatus:false
      }
    },
    computed: {
      ...mapState('questionType',['tabPaneData']),

      isdisabled(){
        return this.errorStr != '' && this.verifyStatus ? true : false
      },
    },
    watch: {
      questionGroup: {
        immediate: true,
        handler () {
          this.grouptopic = {
            ...this.questionGroup
          }
        }
      }
    },
    methods: {
      hanldeClick(tab) {
        this.activeName = tab.name
      },

      groupVerifyStatus(verify){
        this.verifyStatus = verify.status
        this.errorStr = verify.str
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
        this.errorStr = ''
      },
    },
  }
</script>

<style lang="less" scoped>

</style>