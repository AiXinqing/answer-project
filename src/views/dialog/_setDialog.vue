<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedRoom"
    :width="'500px'"
    :before-close="closeRoom"
    :show-close="false"
  >
    <div>ces</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeRoom">取 消</hj-button>
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="preCreateEditRomm"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
export default {
  data() {
    return {
      openedRoom: false,
      title: '创建答题卡',
      isdisabledFn: false,
    }
  },
  methods: {
    openRForm() {
      this.openedRoom = true
    },
    closeRoom() {
      this.openedRoom = false
    },
    preCreateEditRomm() {
      this.openedRoom = false
    },
  },
}
</script>

<style lang="less" scoped></style>
