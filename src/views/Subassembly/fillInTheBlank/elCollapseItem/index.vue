<template>
  <el-collapse-item>
    <template slot="title">
      <div class="space_group_list" @click.stop="clickFun">
        <span class="space-em">题 {{data.topic}} 共 </span>
        <span v-if=" data.childGroup == undefined || data.childGroup.length <= 0">
          <el-input v-model.number="data.space" size="mini" @click.stop.native="clickFun" @blur="changeFirstlevelSpace"  oninput="value=value.replace(/[^\d]/g,'')" />
          <span> 空 每空 </span>
          <el-input v-model="data.score" size="mini" @click.stop.native="clickFun" @blur="changeFirstlevelSpace"  onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
          <span> 分 共 {{data.sum}} 分 </span>
        </span>
        <span v-else>{{data.sum}} 分</span>
        <span class="add_groupTopic" @click.stop="addSubtopicFirstlevel">+ 添加小题</span>
        <i class="el-icon-del" @click.stop="delSubTopicFirstlevel" >-</i>
      </div>
    </template>
    <component
      :is="isComponent"
      :sub-item-data="GroupSmallTopic"
      :sub-child-data="data.childGroup"
      :edit-id="editId"
      @hanlde-last-topic-del="hanldeLastTopicDel"
      @change-last-sub-topic-score="changeLastSubTopicScore"
    />
  </el-collapse-item>
</template>

<script>
  import firstlevelItem from './firstlevelItem' // 一级下来框
  import levelTwoItem from './levelTwoItem'
  export default {
    components: {
      firstlevelItem,
      levelTwoItem
    },
    props: {
      groupSubtopic: {
        type: Object,
        default: () => { }
      },
      editId:{
        type: String,
        default: ''
      },
    },

    data () {
      return {
        data: {}
      }
    },

    computed: {
      GroupSmallTopic () {
        let changeObj = JSON.parse(JSON.stringify(this.data))
        let {space} = changeObj
        let arr = []

        for (let i = 0; i < space; i++) {
          arr.push({ ...changeObj, smallTopic: i })
        }
        return arr
      },

      isComponent () {
        let {childGroup} = this.data
        return childGroup == undefined || childGroup.length <= 0 ? firstlevelItem : levelTwoItem
      }

    },

    watch: {
      groupSubtopic: {
        immediate: true,
        handler () {
          this.data = { ...this.groupSubtopic}
        }
      }
    },

    methods: {
      addSubtopicFirstlevel() {
        // 添加一级小题
        console.log(1)
        this.$emit('add-subtopic-firstlevel', {...this.data,score:Number(this.data.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      delSubTopicFirstlevel(){
        // 删除一级小题
        this.$emit('del-subtopic-firstlevel', {...this.data,score:Number(this.data.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      changeFirstlevelSpace(){
        this.$emit('change-firstlevel-space', this.data)
      },

      clickFun(){
        // 点击无操作
      },

      hanldeLastTopicDel (obj) {
        // 删除小题last题组item
        this.$emit('hanlde-last-topic-del', {...obj,score:Number(obj.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      changeLastSubTopicScore (obj, oldObj) {
      // last-sub分值改变
        this.$emit('change-last-sub-topic-score', {...obj,score:Number(obj.score.toString().match(/^\d+(?:\.\d{0,1})?/))}, oldObj)
      }
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.space_group_item {
  text-align: center;
  &:last-child {
    margin-bottom: 10px;
  }
}
.space_group_item .el-input--mini {
  width: 48px;
  margin: 0 10px;
}

.space_group_list .el-input--mini {
  width: 48px;
}
.add_groupTopic {
  font-size: 16px;
  color: @main;
  position: absolute;
  right: 60px;
  min-width: 90px;
}
i.el-icon-del {
  position: absolute;
  right: 30px;
  font-size: 18px;
  color: @main;
  height: 100%;
  width: 28px;
  text-align: center;
  line-height: 48px;
}
.el-collapse-item__content {
  padding-bottom: 0px !important;
}
.el-collapse-item__header {
  position: relative;
  min-height: 48px;
}
.space-em{
  margin-left: 1em;
}
</style>