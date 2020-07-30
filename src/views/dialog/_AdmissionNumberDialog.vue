<template>
  <hj-dialog
    class="newAdd-content"
    title="编辑考号数"
    :visible.sync="openedFrame"
    :width="'360px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class="item-style ">
      <div class="demo-input-suffix">
        <label for="">考号位数</label>
        <el-input
          type="number"
          v-model="precautions.AdmissionTicket"
          placeholder="8"
          :max="maxAdmission"
          :min="minAdmission"
          @input="changeValueFunc"
        />
        <div class="label-Warning">{{ labelWarning }}</div>
      </div>
    </div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      openedFrame: false,
      isdisabledFn: false,
      minAdmission: 4, // 最小数
      labelWarning: ' ', // 请输入4~12之间的整数
    }
  },
  computed: {
    ...mapState('answerSheetTitle', ['GroupDataArr', 'precautions']),
    ...mapState('answerSheet', ['pageLayout']),
    maxAdmission() {
      // 最大数
      return this.pageLayout.column === 3 && this.pageLayout.pageSize == 'A3'
        ? 9
        : 12
    },
  },
  methods: {
    ...mapActions('answerSheetTitle', ['setAdmissionTicketFunc']),
    closeFrame() {
      this.openedFrame = false
    },
    openedFrameFunc() {
      this.openedFrame = true
    },
    preCreateTitle() {},
    changeValueFunc(e) {
      const val = parseInt(e)
      if (val < this.minAdmission || val > this.maxAdmission) {
        this.labelWarning = '请输入4~' + this.maxAdmission + '之间的整数'
      } else {
        this.labelWarning = ''
      }
      this.setAdmissionTicketFunc(val)
    },
  },
}
</script>

<style lang="less" scoped>
.item-style {
  padding: 10px 0;
}
.demo-input-suffix {
  display: flex;
  position: relative;
  label {
    width: 120px;
    line-height: 37px;
  }
  input {
    height: 30px !important;
    line-height: 30px !important;
    font-size: 14px !important;
    width: 80%;
    display: inline-table;
  }
  .label-Warning {
    color: red;
    position: absolute;
    top: 40px;
    font-size: 12px;
    left: 88px;
  }
}
</style>
