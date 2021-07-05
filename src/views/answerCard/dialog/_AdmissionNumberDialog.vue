<template>
  <hj-dialog
    class="newAdd-content"
    title="编辑考号数"
    :visible.sync="openedFrame"
    :width="'360px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class="item-style">
      <div class="demo-input-suffix critical_score">
        <label for>考号位数</label>
        <el-input
          type="number"
          v-model="AdmissionTicket"
          placeholder="请输入考号,如:8"
          :max="maxAdmission"
          :min="minAdmission"
          @input="changeValueFunc"
          class="padding__inner"
        />
        <div class="label-Warning">{{ labelWarning }}</div>
      </div>
    </div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      minAdmission: 4, // 最小数
      labelWarning: ' ', // 请输入4~12之间的整数,
      AdmissionTicket: 8
    }
  },
  computed: {
    ...mapState('titleSet', ['titleRows']),
    ...mapState('page', ['pageLayout','pageData']),

    maxAdmission () {
      // 最大数
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 9
        : 12
    },
  },
  watch: {
    titleRows (val) {
      this.AdmissionTicket = parseInt(val)
    }
  },
  mounted () {
    this.AdmissionTicket = parseInt(this.titleRows)
  },
  methods: {
    ...mapMutations('titleSet', ['editTitleRows']),
    ...mapMutations('pageContent', ['pageData_edit']),
    closeFrame () {
      this.AdmissionTicket = this.AdmissionTicket == '' ? 8 : this.AdmissionTicket
      this.openedFrame = false
    },
    openedFrameFunc () {
      this.openedFrame = true
    },
    preCreateTitle () {
      let answerTitle = this.pageData[0]
      this.editTitleRows(parseInt(this.AdmissionTicket))
      this.pageData.splice(0,1,{
        ...answerTitle,
        content:{
          ...answerTitle.content,
          titleRows:parseInt(this.AdmissionTicket)}
      })
      this.closeFrame()
    },
    changeValueFunc (e) {
      const val = parseInt(e)
      if (val < this.minAdmission || val > this.maxAdmission || e == '') {
        this.labelWarning = '请输入4~' + this.maxAdmission + '之间的整数'
        this.isdisabledFn = true
      } else {
        this.labelWarning = ''
        this.isdisabledFn = false
      }
    },
  },
}
</script>

<style lang="less">
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
.padding__inner{
  input.el-input__inner{
    padding: 16px 0;
    font-size: 20px !important;
  }
}
</style>
