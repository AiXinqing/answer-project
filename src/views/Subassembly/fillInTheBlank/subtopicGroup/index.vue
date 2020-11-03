<template>
  <div class="subtopic_group_list">
    <span class="space-em"> 题 {{data.topic}} 共 </span>

    <span v-if="isComponent == 'firstlevelItem'">
      <el-input v-model.number="data.space"
        size="mini" @click.stop.native="clickFun"
        @blur="changeFirstlevelSpace"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
      <span> 空 每空 </span>
      <el-input v-model="data.score"
        size="mini" @click.stop.native="clickFun"
        @blur="changeFirstlevelSpace"
        onkeyup.stop.native="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})"
      />
      <span> 分 共 {{data.sum}} 分 </span>
    </span>

    <span v-else> {{data.sum}} 分</span>

    <span class="add_groupTopic" @click.stop="addSubtopicCollection">+ 添加小题</span>
    <i class="el-icon-del" @click.stop="delSubTopicFirstlevel" >-</i>
    <span
      class="change-group"
      @click="expandCloseGroup"
    >
      <i :class="'el-icon-arrow-'+ switch_s"></i>
    </span>

    <div
      :class="['subTopic_list',switch_s]"
      v-for="subtopic in data.childGroup"
      :key="isComponent == 'firstlevelItem' ? subtopic.pid :subtopic.id"
    >
      <component
        :is="isComponent"
        :subtopic-group="subtopic.childGroup"
        :subtopic="subtopic"
        :edit-id="editId"
      />

    </div>
  </div>
</template>

<script>
  import firstlevelItem from './firstItem'
  import towlevelItem from './twoItem'

  export default {
    components: {
      firstlevelItem,
      towlevelItem
    },

    props: {
      groupSubtopic: {
        type: Object,
        default: ()=>{}
      },

      editId:{
        type:String,
        default:''
      }
    },

    data() {
      return {
        data: {},
        switch_s:'right'
      }
    },

    computed: {
      isComponent() {
        let {childGroup,level} = this.groupSubtopic
        return childGroup.length <= 1 && !level ? 'firstlevelItem' : 'towlevelItem'
      }
    },

    watch: {
      groupSubtopic: {
        immediate: true,
        handler () {
          this.data = { ...this.groupSubtopic}
          this.switch_s = this.data.level ? 'down':'right'
        }
      }
    },

    methods: {
      changeFirstlevelSpace(){

      },

      addSubtopicCollection(){
        let {childGroup,id,pid,level} = this.data
        if(!level){
          this.switch_s = 'down'
          this.$emit('change-level',this.data)
        }else{
          let childObj = {
            ...this.data,
            id: `sid_${+new Date()}_${childGroup.length + 1}`,
            pid: id,
            sid:pid,
            score: 1,
            subTopic:`${childGroup.length + 1}`,
            childGroup:[{
              id: `last_${+new Date()}_${childGroup.length + 1}`,
              pid:`sid_${+new Date()}_${childGroup.length + 1}`,
              sid:pid,
              lid:id,
              score: 1,
              smallTopic:1,
            }]
          }
          this.$emit('add-subTopic-collection',{obj:this.data,data:childObj})

        }
      },

      delSubTopicFirstlevel(){},

      expandCloseGroup(){
        // 展开关闭小题层级
        if(this.switch_s == 'right'){
          this.switch_s = 'down'
        }else{
          this.switch_s = 'right'
        }
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

  .subtopic_group_list{
    width: 100%;
    position: relative;
    min-height: 40px;
    line-height: 40px;
    border-bottom:1px solid #ddd;

    .space-em{
      margin-left: 1em;
    }

    .subTopic_list{
      border-top: 1px solid #ddd;
      width: 98%;
      margin-left: 1%;
      display: none;
    }

    .subTopic_list.down{
      display: block;
    }

    .add_groupTopic {
      font-size: 16px;
      color: @main;
      position: absolute;
      right: 60px;
      min-width: 90px;
      cursor: pointer;
    }

    i.el-icon-del {
      position: absolute;
      right: 30px;
      font-size: 18px;
      color: @main;
      width: 28px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }

    .change-group {
        display: inline-block;
        position: absolute;
        right: 10px;
        line-height: 40px;
        font-size: 18px;
        cursor: pointer;
    }

    &:last-child{
      border-bottom:none
    }

    .el-input--mini {
      width: 48px;
    }
  }
</style>