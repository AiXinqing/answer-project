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
import { mapState } from 'vuex'
export default {
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      studentTitle: []
    }
  },
  computed: {
    ...mapState('page', ['pageData']),
    ...mapState('page', ['pageLayout']),
  },
  methods: {

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
      const {column,size} = this.pageLayout
      let cur = this.pageData[0]
      let obj = {}
      if(column == 3 && size == "A3"){
        let long = this.studentTitle.filter(item => item.checked).length
            long = Math.ceil(long / 3)
        obj = {
          checkHeight:long * 40
        }
      }
      this.pageData.splice(0,1,{
        ...cur,
        ...obj,
        content:{
          ...cur.content,
          titleInfo:this.studentTitle
        }
      })
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
