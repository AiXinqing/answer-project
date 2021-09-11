<template>
  <div class="binLine_td lvle_tdBox">
    <div>
      <el-input
        v-model="data.subname"
        @blur="preQuestiongroup">
      </el-input>
			<span class="td_span">:</span>
    </div>
    <div>
      <el-input
        type='number'
        v-model="data.substart"
        @blur="preQuestiongroup">
      </el-input>
			<span class="span_line"></span>
    </div>
		<div class="lvle_text">{{data.subend}}%</div>
    <div>
      <i class="el-icon-delete" @click="removeOutline(data)"></i>
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
        const {subname,substart} = this.data
        let isV = false
        if(subname == '' || subname == undefined){
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

      preQuestiongroup(){
        this.$emit('verify-change',this.verify)
      }
    }
  }
</script>

<style lang="less" >
@import '~@/assets/css/variables.less';
  .lvle_tdBox>div .el-input--medium{
    width: 100px;
  }

	.lvle_tdBox{
		margin-bottom: 15px;
		.el-input--medium .el-input__inner{
			height: 35px;
			line-height: 35px;
			width: 80px;
			text-align: center;
			font-size: 14px;
			color: @font-666;
		}

		.td_span{
			display:inline-block;
			width:20px;
		}

		.span_line{
			display: inline-block;
			width: 20px;
			height: 1.5px;
			background: @font-999;
			position: relative;
			top: -4px;
		}
	}

  .lvle_tdBox{
		display: flex;
    &>div{
			line-height: 35px;
      i:last-child{
        margin-right: 0px;
      }
    }
		i.el-icon-delete{
			font-size: 16px;
			position: relative;
    	top: 1px;
			cursor: pointer;
		}
  }
  .el-input__inner{
    padding-right: 0;
  }
	.lvle_text{
		height: 39px;
    line-height: 39px;
    width: 80px;
    text-indent: 1em;
	}
</style>