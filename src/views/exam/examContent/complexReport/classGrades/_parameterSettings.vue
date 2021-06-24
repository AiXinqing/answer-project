<template>
  <hj-dialog
    class="newAdd-content"
    :title="'设置'+ subject +'得分率'"
    :visible.sync="openedFrame"
    :width="'820px'"
    :before-close="closeFrame"
    :show-close="false"
    :append-to-body="true"
  >
    <div class="Bin_line_box">
      <div class="binLine_th">
        <div>名称</div>
        <div>最低分</div>
        <div>最高分</div>
        <div>操作</div>
      </div>
      <div
        class="binLine_td"
        v-for="(item,i) in  data"
        :key="i"
      >
        <div>
          <el-input
            placeholder="请输入得分率名称"
            v-model="item.name">
          </el-input>
        </div>
        <div>
          <el-input
            placeholder="请输入最低分"
            v-model="item.score">
          </el-input>
        </div>
        <div>
          <el-input
            placeholder="请输入最高分"
            v-model="item.score">
          </el-input>
        </div>
        <div>
          <i class="el-icon-remove-outline"></i>
          <i class="el-icon-circle-plus-outline"></i>
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
  import qs from 'qs'
  import { mapState} from 'vuex'
  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:[],
        fullscreenLoading:false,
        subject:'',
        parameter:{
          tid:'',
          tsid:'',
          type:'',
          url:this.URL.GetASAnalyseSettingList
        }
      }
    },

    computed: {
      ...mapState('parameterSet', ['tableLoading','TableList']),
    },

    methods: {
      openFrame(obj){
        // let binning = JSON.parse(JSON.stringify(binningData))
        // this.data = binning

        this.subject = obj.subject
        this.parameter = {
          ...obj
        }
        this.$nextTick(()=>{
          this.getTable()
        })
        this.openedFrame = true
      },
      closeFrame() {
        this.openedFrame = false
      },
      handelDetermine(){

        let params = {
          prmASAnalyseScoreLine:JSON.stringify(this.data)
        }

        this.$http.post(this.URL.SaveASAnalyseSetting, qs.stringify(params) ).then(res => {

          if(res.data.ResponseCode == 'Success'){
            this.openedFrame = false
            this.$emit('change-set-binning-bullet')
          }

        }).catch(error => {
          this.fullscreenLoading = false
        })
      },

       getTable() {
        this.$store.dispatch('parameterSet/GetStuResults', this.parameter)
      },
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