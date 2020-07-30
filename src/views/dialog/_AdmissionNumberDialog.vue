<template>
  <hj-dialog
    class="newAdd-content"
    title="编辑考号数"
    :visible.sync="openedFrame"
    :width="'300px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class="item-style"></div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      openedFrame: false,
      isdisabledFn: false,
      studentInfo: [],
    }
  },
  methods: {
    ...mapActions('answerSheetTitle', ['setStudentInfoFunc']),
    closeFrame() {
      this.openedFrame = false
    },
    openedFrameFunc(Arr) {
      this.studentInfo = Arr
      this.openedFrame = true
    },
    preCreateTitle() {
      this.setStudentInfoFunc(this.studentInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.item-style {
  padding: 10px 0;
}
</style>
