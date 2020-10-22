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
        v-for="(item, i) in studentTitle"
        :key="i"
        v-model="item.checked"
        @change="changeCheckFunc"
      >{{ item.name }}</el-checkbox>
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
      studentTitle: []
    }
  },
  computed: {
    ...mapState('pageContent', ['pageData']),
  },
  methods: {
    ...mapMutations('titleSet', ['editTitleInfo']),
    ...mapMutations('pageContent', ['amendPageData']),
    closeFrame () {
      this.openedFrame = false
    },
    openedFrameFunc (obj) {
      this.studentTitle = obj
      this.openedFrame = true
    },
    changeCheckFunc () {

    },
    preCreateTitle () {
      let answerTitle = this.pageData[0]
      this.amendPageData({
        ...answerTitle,
        content:{
          ...answerTitle.content,
          titleInfo:this.studentTitle}
      })
      this.editTitleInfo(this.studentTitle)
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
