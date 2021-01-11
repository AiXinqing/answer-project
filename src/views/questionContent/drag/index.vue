<template>
  <div
    class="question-item"
    :style="{
      height: contentHeight - 2 + 'px'
    }"
  >
    <div class="question-container">
      <slot></slot>
    </div>
    <div
      v-if="moved"
      class="question-resize-mask"
      :style="{
        height: height + 'px'
      }"
    />
    <div
      class="question-handler"
      :style="{
        top: contentHeight - 23 + 'px'
      }"
      ref="resizeHandler"
      @mousedown="handleResizeStart"
    >
      <svg t="1602238763767" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1305" width="32" height="32"><path d="M192 368h416v32H192zM192 496h416v32H192zM192 624h416v32H192z" fill="#1ab394" p-id="1306"></path><path d="M736 320h96L704 192 576 320h96v384h-96l128 128 128-128h-96z" fill="#1ab394" p-id="1307"></path></svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
  },

  data () {
    return {
      height: this.question.height,
      iconHeight: 23,
      startPos: null,
      moved: false,
      data: JSON.parse(JSON.stringify(this.question))
    }
  },

  computed: {
    contentHeight() {
      const {first,castHeight,heightTitle} = this.question
      return first ? castHeight - heightTitle : castHeight
    },

    minHeight() {
      const {editorContent,rowHeight,MarginHeight,rows} = this.question
      let curHright = rowHeight * rows + MarginHeight
      let long = 0
      let strHeight = 0
      if(editorContent && editorContent.length) {
        editorContent.forEach(element => {
          let objArr = this.convertArray(element)
          long += objArr.length
        })
        strHeight = long * rowHeight + MarginHeight
      }

      return  !strHeight ? curHright : strHeight
    },

  },

  watch: {
    'question.height': {
      handler () {
        this.height = this.question.height
      }
    }
  },

  created () {
    this.handleResizeFunc = this.handleResize.bind(this)
    this.handleResizeEndFunc = this.handleResizeEnd.bind(this)
  },

  methods: {
    handleResizeStart (event) {
      this.startPos = event.clientY

      document.body.addEventListener('mousemove', this.handleResizeFunc, false)
      document.body.addEventListener('mouseup', this.handleResizeEndFunc, false)
    },

    handleResize (event) {
      this.moved = true
      const deltaY = event.clientY - this.startPos
      console.log(deltaY)

      // 最小高度为40，可以修改这个最小值
      console.log(this.minHeight)
      this.height = Math.max(this.question.height + deltaY, this.minHeight)
    },

    handleResizeEnd () {
      document.body.removeEventListener('mouseup', this.handleResizeEndFunc, false)
      document.body.removeEventListener('mousemove', this.handleResizeFunc, false)
      this.startPos = null
      if (!this.moved) return
      this.moved = false

      this.$emit('height-resize', this.height)

    },

    //转换富文本编辑的内容为数组
    convertArray(oldStr) {
      if(oldStr != undefined){
        let arr = oldStr.split(/[(\r\n)\r\n]+/) // 回车换行
            arr = arr.map(item => item == '' || item == 'undefined' ? '' : item + '\n')
                      .filter(item => item !='')
        return arr
      }
    },
  }
}
</script>

<style lang="less" scoped>
.question-item {
  position: relative;
  border: 1px solid gray;
  user-select: none;

  .question-resize-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    background-color: rgba(210, 249, 241, 0.5);
  }

  // 控制块，可以自行定义其样式(主要定制其高宽，颜色，及其里面的元素)
  .question-handler {
    position: absolute;
    top: 0;
    right: 5px;
    width: 18px;
    height: 18px;
    background-color: transparent;
    cursor: move;

    svg{
      width: 120%;
      height: 120%;
    }
  }
}
</style>
