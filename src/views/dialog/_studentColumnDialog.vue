<template>
  <hj-dialog
    class="newAdd-content"
    title="编辑试卷标题"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class="item-style">
      <el-checkbox
        v-for="(item, i) in studentInfoArr"
        :key="i"
        v-model="item.checked"
        >{{ item.name }}</el-checkbox
      >
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
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      openedFrame: false,
      isdisabledFn: false,
      //studentInfo: this.studentInfoArr,
    }
  },
  computed: {
    ...mapGetters('answerSheetTitle', ['studentInfoArr']),
  },
  methods: {
    ...mapActions('answerSheetTitle', ['setStudentInfoFunc']),

    closeFrame() {
      this.openedFrame = false
    },
    openedFrameFunc() {
      this.openedFrame = true
    },
    preCreateTitle() {
      this.setStudentInfoFunc(this.studentInfo)
      this.closeFrame()
    },
  },
}
</script>

<style lang="less" scoped>
.item-style {
  padding: 10px 0;
}
</style>
