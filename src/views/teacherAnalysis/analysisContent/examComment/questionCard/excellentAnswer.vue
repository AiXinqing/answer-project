<template>
  <hj-dialog
    class="newAdd-content"
    :title="'查看优秀答案'"
    :visible.sync="openedFrame"
    :before-close="closeFrame"
    :show-close="true"
    :append-to-body="true"
    width="60%"
  >
    <div class="card-xb">
      <span class="low">1-3</span>
      <span>优秀答案</span>
      <span class="score_style">(得分：10/满分：10)</span>
    </div>
    <div class="card_img"></div>
    <div class="dialog-footer" style="text-align: center;">
      <hj-button
        type="confirm"
        class="excellentAnswers"
        :disabled="isdisabledFn"
        @click="handelDetermine"
        v-loading.fullscreen.lock="fullscreenLoading"
      >换一个查看</hj-button>
    </div>
  </hj-dialog>
</template>

<script>

  import { mapState} from 'vuex'

  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:[],
        fullscreenLoading:false,
        subject:'',
        parameter:{},
        tid:''
      }
    },

    computed: {
      ...mapState('parameterSet', ['tableLoading','TableList']),
    },

    watch: {
      TableList:{
        immediate: true,
        handler () {
          this.data = this.TableList
        },
      },
    },

    methods: {
      openFrame(){
        this.openedFrame = true
      },

      closeFrame() {
        this.openedFrame = false
      },

      handelDetermine(){
        // 保存
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .card-xb{
    font-size: 14px;
    .low{
      color: @ffb
    }
    .high{
      color: @f46
    }
    .main{
      color: @main
    }
    .score_style{
      color: @f46;
    }
  }
  .card_img{
    width: 100%;

    img{
      width: 100%;
    }
  }
  .hj-button.excellentAnswers{
    .el-button--confirm{
      width: 86px;
    }
  }
  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{
    color: @main !important
  }
</style>
