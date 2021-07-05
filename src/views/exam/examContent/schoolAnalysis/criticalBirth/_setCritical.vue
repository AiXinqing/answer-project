<template>
  <hj-dialog
    class="newAdd-content"
    title="设置临界值"
    :visible.sync="openedFrame"
    :width="'360px'"
    :before-close="closeFrame"
    :show-close="false"
    :append-to-body="true"
  >
    <div class="demo-input-suffix critical_score">
      <span>临界分：</span>
      <el-input
        type="number"
        placeholder="请输入临界分"
        v-model="criticalScale">
      </el-input>
      <span class="unit">%</span>
    </div>
    <div class="demo-input-suffix critical_score">
      <span>浮动分：</span>
      <el-input
        type="number"
        placeholder="请输入浮动分"
        v-model="floatScale">
      </el-input>
      <span class="unit">%</span>
    </div>

    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="handelDetermine">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        criticalScale:60,
        floatScale:5,
      }
    },

    methods: {
      openFrame(){
        this.openedFrame = true
      },
      closeFrame() {
        this.openedFrame = false
      },
      handelDetermine(){
        this.openedFrame = false
        this.$emit('change-set-critical',{
          criticalScale:this.criticalScale,
          floatScale:this.floatScale
        })
      }
    },
  }
</script>

<style lang="less" >
  .demo-input-suffix.critical_score{
    margin-bottom: 20px;
    position: relative;

    span {
      display: inline-block;
      margin-right: 10px;
      height: 28px;
      margin-top: 5px;
      line-height: 28px;
    }

    span.unit {
      position: relative;
      right: 32px;
      top: 4px;
    }

    .el-input.el-input--medium{
      width: 210px;
      input{
        width: 100%;
        text-indent:0.5em !important
      }
    }
  }
</style>