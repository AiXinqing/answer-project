<template>
  <section id="tinymce-editor" inline></section>
</template>

<script>
  import './tinymce.min.js'
  import './themes/silver/theme.min.js'
  import './langs/zh_CN.js'
  import './icons/default/icons.min.js'
  import './plugins/image/plugin.min.js'
  import './plugins/imagetools/plugin.min.js'

  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
    },

    mounted() {
      tinymce.init({
        selector:'#tinymce-editor',
        language:'zh_CN',
        menubar: false,
        inline:true, // 内联样式

        setup: (editor) =>{
          editor.on('init',()=>{
            editor.setContent(this.value)
          })
        },
        // 监听input 和 change 事件，实时更新 value
        init_instance_callback: (editor) => {
          editor.on('input',(e) => {
            this.$emit('input', e.target.innerHTML)
          }),
          editor.on('change', (e) => {
            this.$emit('input', e.level.content)
          })
        }
      })
    }
  }
</script>

<style lang="less" scoped>
@import url('./skins/ui/oxide/skin.min.css');
@import url('./skins/ui/oxide/content.min.css');
@import url('./skins/ui/oxide/content.inline.min.css');
</style>