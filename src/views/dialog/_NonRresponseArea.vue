<template>
<!-- 非作答区 -->
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
  >
    <div class="non_box">
      <div  class="non_box_item">
        <div class="label_item">位置:</div>
        <div class="label_right">
          <hj-select
            :items="options"
            size="mini"
            :value="data.number" />
          <div class="Comment">注：非作答区将加在选中的大框后</div>
        </div>
      </div>
      <div class="non_box_item">
        <div class="label_item">高度:</div>
        <div class="label_right">
          <el-input v-model="data.number" size="mini" placeholder="请输入内容" />
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      title: '设置',
      openedFrame: false,
      isdisabledFn: false,
      data: {
        name: '',
        number: 1
      }
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
    ]),
  },
  methods: {
    closeFrame () {
      this.openedFrame = false
    },
    preCreateQuestion () {

    },
    opened () {
      this.openedFrame = true
    },
    openedEdit () {
      this.openedFrame = true
    }
  },
}
</script>

<style lang="less" >
.non_box {
  border-bottom: 1px solid #eee;
  padding-bottom: 40px;
  position: relative;
  left: -20px;
  width: 500px;
}
.non_box_item {
  margin-top: 10px;
  .label_item {
    width: 60px;
    height: 34px;
    line-height: 34px;
  }
  .label_right {
    width: calc(100% - 60px);
  }
  .el-input.el-input--mini {
    height: 34px;
    line-height: 34px;
  }
  .el-input--mini .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .hj-select {
    width: 100%;
    .el-input.el-input--mini.el-input--suffix {
      width: 120%;
    }
  }
  width: 60%;
  margin-left: 20%;
  display: inline-flex;
}
.non_box_item:nth-child(n + 2) {
  margin-top: 34px;
}
.Comment {
  position: absolute;
  color: #999;
  margin-top: 2px;
}
</style>