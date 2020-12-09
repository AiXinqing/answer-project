<template>
  <section id="tinymce-editor">tinymce-editor</section>
</template>

<script>
  import './tinymce.min.js'
  import './themes/silver/theme.min.js'
  import './langs/zh_CN.js'
  import './icons/default/icons.min.js'
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
        //菜单栏
        menubar:' ',
        // menubar:'bar1 ',
        // menu:{
        //   bar1:{title:'文本',items:'copy paste cut'},
        // }
        // 工具栏
        toolbar:'undo redo preview',
        plugins:'preview',
        setup: (editor) =>{
          editor.on('init',(e)=>{
            editor.setContent(this.value)
          })
        }
      })
    }
  }
</script>

<style lang="less" scoped>
@import url('./skins/ui/oxide/skin.min.css');
</style>