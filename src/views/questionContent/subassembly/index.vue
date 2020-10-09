<template>
  <div
    class="question-item"
    :style="{
      height: question.height + 'px'
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
        top: (height - 23) + 'px'
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
    }
  },

  data () {
    return {
      height: this.question.height,
      startPos: null,
      moved: false
    }
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
      console.log('dragstart')
      this.startPos = event.clientY

      document.body.addEventListener('mousemove', this.handleResizeFunc, false)
      document.body.addEventListener('mouseup', this.handleResizeEndFunc, false)
    },

    handleResize (event) {
      this.moved = true
      const deltaY = event.clientY - this.startPos
      // 最小高度为40，可以修改这个最小值
      this.height = Math.max(this.question.height + deltaY, 40)
    },

    handleResizeEnd (event) {
      document.body.removeEventListener('mouseup', this.handleResizeEndFunc, false)
      document.body.removeEventListener('mousemove', this.handleResizeFunc, false)
      this.startPos = null
      if (!this.moved) return
      this.moved = false
      this.$emit('height-resize', this.height)
    }
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

    svg{
      width: 120%;
      height: 120%;
    }
  }
}
</style>
