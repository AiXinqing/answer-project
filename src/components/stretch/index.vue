<template>
  <section>
    <div
      :class="['fold_list',{'stretch':stretch}]">
        <div class="fold_name">{{data.subject}}：</div>
        <div class="fold_box">
          <!-- 单选题 -->
          <template v-if="data.type == 'single'">
            <div class="change_menu"
              v-for="(item,a) in data.subjectList"
              :key="a"
              :class="{'is_active':item.check}"
              @click="singleChange(a)"
            >{{item.name}}</div>
          </template>
          <!-- 单选题 -->
          <!-- 多选题 -->
          <template v-if="data.type == 'multiple'">
            <hj-checkbox
              v-for="(item,a) in data.subjectList"
              :key="a"
              :title="item.name"
              v-model="item.check"
              @change="handleCheckAllChange(item)"
            ></hj-checkbox>
          </template>
          <!-- 多选题 -->
        </div>
        <div class="fold_stretch" @click="handleStretch()">
          <template v-if="!stretch">
            <span>收起</span>
            <i class="el-icon-arrow-up"></i>
          </template>
          <template v-else>
            <span>展开</span>
            <i class="el-icon-arrow-down"></i>
          </template>
        </div>
      </div>
  </section>
</template>

<script>
  export default {
    props: {
      chooseList: {
        type: Object,
        default:() => {}
      },
    },
    data() {
      return {
        data: {},
        stretch:true
      }
    },
    watch: {
      chooseList: {
        immediate: true,
        handler () {
            this.data = this.chooseList
            this.stretch = this.chooseList.stretch
        },
      },
    },
    methods: {
      handleStretch() {
        this.stretch = !this.stretch
        this.$emit('handle-stretch')
      },
      singleChange(index){

        this.data.subjectList = this.data.subjectList.map((item,i) => {
          return i == index ? {...item,check:!item.check} : {...item,check:false}
        })
        let selected
        this.data.subjectList.forEach((ele,i) => {
          if(index == i){
            selected = ele.tsid
            return false
          }
        })

        this.$emit('single-change',selected)

      },

      handleCheckAllChange(item){
        if(item.cid == 'all'){
          this.data.subjectList = this.data.subjectList.map(ele => {
            return {...ele,check:item.check}
          })
        }
        let Arr = this.data.subjectList.filter(item => item.check)
                    .map(ele => ele.cid)

        this.$emit('handle-checkAll-change',Arr)
      }
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.fold_list{
    display: flex;
    font-size: 14px;
    min-height: 40px;
    line-height: 40px;
    overflow: hidden;
    width: calc(100% - 30px);
    margin-left: 15px;
    border-bottom: 1px dotted @font-909;
    margin-top: 10px;

    &.stretch{
      height: 40px;
    }

    .fold_name{
      flex-shrink:0;
      width: 50px;
    }

    .fold_box{
      flex-shrink:1;
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .change_menu {
        padding: 0 15px;
        height: 28px;
        line-height: 28px;
        margin-top: 6px;
        border-radius: 4px;
        margin: 6px 10px;
        cursor: pointer;

        &.is_active{
          background-color: @main;
          color: @white
        }

        &:hover{
          background-color: @main;
          color: @white
        }
      }
    }
    .fold_stretch{
      color: @mainFont;
      width: 60px;
      flex-shrink:0;
      cursor: pointer;

      i{
        margin-left: 5px;
      }
    }
  }
  .el-checkbox__input.is_focus
  .el-checkbox__inner{
    border-color: @main
  }
</style>