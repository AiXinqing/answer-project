<template>
  <el-collapse-item>
    <template slot="title">
      <div class="space_group_list">
        <span class="space-em" @click.stop="clickFun">题 {{data.topic}} 共 </span>
        <span v-if=" data.childGroup == undefined || data.childGroup.length <= 0">
          <el-input v-model.number="data.space" size="mini" @click.stop.native="clickFun" @blur="changeFirstlevelSpace"  oninput="value=value.replace(/[^\d]/g,'')" />
          <span @click.stop="clickFun"> 空 每空 </span>
          <el-input v-model="data.score" size="mini" @click.stop.native="clickFun" @blur="changeFirstlevelSpace"  onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
          <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
        </span>
        <span v-else>{{data.sum}} 分</span>
        <span class="add_groupTopic" @click.stop="addSubtopicFirstlevel">+ 添加小题</span>
        <i class="el-icon-del" @click.stop="delSubTopicFirstlevel" >-</i>
      </div>
    </template>
  </el-collapse-item>
</template>

<script>
  export default {
    props: {
      groupSubtopic: {
        type: Object,
        default: () => { }
      },
    },

    data () {
      return {
        data: {}
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
        this.$emit('add-subtopic-firstlevel', {...this.data,score:Number(this.data.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      delSubTopicFirstlevel(){
        // 删除一级小题
        this.$emit('del-subtopic-firstlevel', {...this.data,score:Number(this.data.score.toString().match(/^\d+(?:\.\d{0,1})?/))})
      },

      changeFirstlevelSpace(){
        this.$emit('change-firstlevel-space', this.data)
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