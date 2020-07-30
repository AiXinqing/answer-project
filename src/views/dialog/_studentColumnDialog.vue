<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
export default {
  data() {
    return {
      openedFrame: false,
      isdisabledFn: false,
    }
  },
  methods: {
    closeFrame() {
      this.openedFrame = false
    },
    preCreateTitle() {},
  },
}
</script>

<style lang="scss" scoped></style>
