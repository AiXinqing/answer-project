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
          :group-data="groupData[item.name]"
          @group-verify-status="groupVerifyStatus"
          @update-group-subTopic="updateGroupSubTopic"
          @pre-edit-subtopic="preEditSubtopic"
        />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
  import singleChoice from '../objective/singleChoice'
  export default {
    components: {
      singleChoice,
    },
    props: {
      tabPaneData: {
        type: Array,
        default: () => [],
      },
      groupData: {
        type: Object,
        default: () => { },
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

      groupVerifyStatus(verify){
        this.isdisabled = verify.status
        this.$emit('group-verify-status', verify)
      },

      updateGroupSubTopic(group){
        this.$emit('update-group-subTopic',group)
      },

      preEditSubtopic(subtopic){
        this.$emit('pre-edit-subtopic',subtopic)
      }
    },
  }
</script>

<style lang="less" scoped>

</style>