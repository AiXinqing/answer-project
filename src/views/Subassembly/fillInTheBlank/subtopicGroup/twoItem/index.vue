<template>

  <div class="sub-item-group" @click="clickFun">
    <span class="tig" @click.stop="clickFun">({{data.subTopic}}) 共 </span>
    <el-input v-model.number="data.space" size="mini" @blur="ChangeSpaceValue"  oninput="value=value.replace(/[^\d]/g,'')"/>
    <span @click.stop="clickFun"> 空 每空 </span>
    <el-input v-model="data.score" size="mini" @blur="ChangeSpaceValue"  onkeyup="this.value = this.value.replace(/(\.\d{1,1})(?:.*)|[^\d.]/g, ($0, $1) => {return $1 || '';})" />
    <span @click.stop="clickFun"> 分 共 {{data.sum}} 分 </span>
    <i class="el-icon-circle-clos" @click.stop="hanldeLastTopicDel" >删除</i>
    <span
      class="change-group"
      @click="expandCloseGroup"
    >
      <i :class="'el-icon-arrow-'+ switch_s"></i>
    </span>
    <last-item
      :class="switch_s"
      v-for="subtopic in data.childGroup"
      :key="subtopic.smallTopic"
      :subtopic="subtopic"
      @pre-edit-last-score="preEditLastScore"
    />
  </div>

</template>

<script>
  import lastItem from './item.vue'
  export default {
    components: {
      lastItem,
    },
    props: {
      subtopic: {
        type: Object,
        default: () => {}
      },
    },

    data() {
      return {
        data: {},
        switch_s:'right'
      }
    },

    watch: {
      subtopic: {
        immediate: true,
        handler () {
          this.data = { ...this.subtopic }
        }
      }
    },

    methods: {
      ChangeSpaceValue() {

      },

      hanldeLastTopicDel(){

      },

      clickFun(){},

      expandCloseGroup(){
        if(this.switch_s == 'right'){
          this.switch_s = 'down'
        }else{
          this.switch_s = 'right'
        }
      },

      preEditLastScore(obj) {
        // 编辑最后一级分数
        this.$emit('pre-edit-last-score',obj)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .sub-item-group{
    position: relative;

    .tig{margin-left: 20px;}
    i.el-icon-circle-clos {
      position: absolute;
      right: 40px;
      line-height: 40px;
      color: @main;
      cursor: pointer;
    }
    border-bottom: 1px solid #ddd;

    &:last-child{
      border-bottom: none
    }
  }
</style>