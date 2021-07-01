<template>
  <div class="binLine_td">
    <div>
      <el-input
        placeholder="请输入得分率名称"
        v-model="data.subname"
        @blur="preQuestiongroup">
      </el-input>
    </div>
    <div>
      <el-input
        type='number'
        placeholder="请输入最低分"
        v-model="data.substart"
        @blur="preQuestiongroup">
      </el-input>
    </div>
    <div>
      <el-input
        type='number'
        placeholder="请输入最高分"
        v-model="data.subend"
        @blur="preQuestiongroup">
      </el-input>
    </div>
    <div>
      <i class="el-icon-remove-outline" @click="removeOutline(data)"></i>
      <i class="el-icon-circle-plus-outline" @click="plusOutline"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      group: {
        type: Object,
        default: () => { }
      },
      itemIndex:{
        type:Number,
        default: 0
      }
    },

    data (){
      return{
        data:{}
      }
    },

    computed: {
      verify(){
        
        const {subname,subend,substart} = this.data
        let isV = false
        if(subname == '' || subname == undefined){
          isV = true
        }else{
          isV = false
        }

        if(subend == '' || subend == undefined){
          isV = true
        }else{
          isV = false
        }

        if(substart == '' || substart == undefined){
          isV = true
        }else{
          isV = false
        }

        return isV
      },
    },

    watch: {
      group: {
        immediate: true,
        handler () {
          this.data = this.group
        }
      }
    },

    methods: {
      removeOutline(data){
        this.$emit('remove-outline',{obj:data,index:this.itemIndex})
      },

      plusOutline(data){
        this.$emit('plus-outline',{
          subend:'',
          substart:'',
          subname:''
        })
      },
      preQuestiongroup(){
        this.$emit('verify-change',this.verify)
      }
    }
  }
</script>

<style lang="less" scoped>
@import '~@/assets/css/variables.less';
  .Bin_line_box .binLine_td>div .el-input--medium{
    width: 150px;
  }
  .binLine_td{
    &>div{
      i{
        font-size: 24px;
        margin-right: 10px;
        cursor: pointer;
      }
      i:last-child{
        margin-right: 0px;
      }
    }
  }
  .el-input__inner{
    padding-right: 0;
  }
</style>