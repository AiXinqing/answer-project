<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedRoom"
    :width="'500px'"
    :before-close="closeRoom"
    :show-close="false"
  >
    <div class="">
      <el-row>
        <el-col :span="6">纸张大小</el-col>
        <el-col :span="18">
          <div class="paper">
            <span class="paper-size">A3</span>
            <span>A3/B4/8K纸</span>
          </div>
          <div class="paper">
            <span class="paper-size">A4</span>
            <span>A4/B5纸</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">答题卡布局</el-col>
        <el-col :span="18"></el-col>
      </el-row>
    </div>
    <div class="dialog-footer createLayout" v-if="createLayout">
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="preCreateEditRomm"
        >创建</hj-button
      >
    </div>
    <div class="dialog-footer" v-else>
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
      createLayout: true,
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

<style lang="less" scoped>
.createLayout {
  text-align: center;
}
.paper {
  display: inline-block;
  width: 80px;
  text-align: center;
}
.paper-size {
  display: inline-block;
  width: 50px;
  height: 40px;
  border: 2px solid;
  border-radius: 3px;
  line-height: 50px;
}
</style>
