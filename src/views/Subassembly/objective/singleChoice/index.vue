<template>
  <el-tab-pane>
    <div class="big-question-box">
      <choice-tabs/>
    </div>
    <div class="add_question" @click="hanldeAddSubtopic(activeName)">+ 分段添加小题</div>
    <div class="question-group">
      <choice-group/>
    </div>

  </el-tab-pane>
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
      tabPaneData: {
        type: Array,
        default: () => [],
      },
      groupData: {
        type: Object,
        default: () => { },
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
      hanldeAddSubtopic(){}
    },
  }
</script>

<style lang="less" scoped>

</style>