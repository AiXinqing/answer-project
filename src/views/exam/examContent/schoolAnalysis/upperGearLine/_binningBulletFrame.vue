<template>
  <hj-dialog
    class="newAdd-content"
    title="设置分档线"
    :visible.sync="openedFrame"
    :width="'820px'"
    :before-close="closeFrame"
    :show-close="false"
    :append-to-body="true"
  >
    <div class="Bin_line_box">
      <div class="binLine_th">
        <div
          v-for="(item,i) in  data"
          :key="i"
        >分档线 : {{item.name}} <span>(分)</span></div>
      </div>
      <div class="binLine_td">
        <div
          v-for="(item,i) in  data"
          :key="i"
        >
          <el-input
            placeholder="请输入分档分值"
            v-model="item.score">
          </el-input>
        </div>
      </div>
    </div>

    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="handelDetermine"
        v-loading.fullscreen.lock="fullscreenLoading"
      >确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
  import Qs from 'qs'
  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:[],
        fullscreenLoading:false,
      }
    },

    methods: {
      openFrame(binningData){
        let binning = JSON.parse(JSON.stringify(binningData))
        this.data = binning
        this.openedFrame = true
      },
      closeFrame() {
        this.openedFrame = false
      },
      handelDetermine(){
        console.log(this.data)
        // this.fullscreenLoading = true
        let params = JSON.stringify({
          prmASAnalyseScoreLine:this.data
        })
        this.$http.post(this.URL.SaveASAnalyseSetting,params ).then(res => {
          console.log(res)

        }).catch(error => {
          this.fullscreenLoading = false
        })

        // this.openedFrame = false
        // this.$emit('change-set-binning-bullet',{
        //   firstGear:this.criticalScale,
        //   secondGear:this.floatScale,
        //   thirdGear:this.thirdGear
        // })
      }
    },
  }
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.Bin_line_box{
  width:calc(100% - 30px);
  margin-left:15px;
  .binLine_th,
  .binLine_td {
    display: flex;
    justify-content:space-between;
    align-items:center;
    width: 100%;
    text-align: center;
    border: 1px solid @font-dcd;
    height: 50px;
    line-height: 50px;
    >div{
      width:100%;
      border-right:1px solid @font-dcd;
      &:last-child{
        border-right:none;
      }
    }
    
  }

  .binLine_td{
    border-top:none;
    >div{
      .el-input--medium{
        width: 70px;
        margin-top:-3px;
        .el-input__inner{
          font-size:14px;
        }
      }
    }
  }

}
  
</style>