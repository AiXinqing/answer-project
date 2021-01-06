<template>
  <section :id="'tinymce_'+ editorId"
  >
    <!-- <slot></slot> -->
  </section>
</template>

<script>
  import '../tinymce.min.js'
  import '../themes/silver/theme.min.js'
  import '../langs/zh_CN.js'
  import '../icons/default/icons.min.js'
  import '../plugins/image/plugin.min.js'
  import '../plugins/imagetools/plugin.min.js'
  import '../plugins/charmap/plugin.min.js'
  import '../plugins/code/plugin.min.js'
  import '../plugins/mathjax/plugin.min.js'
  import '../plugins/mathjax/config.js'


  export default {
    props: {
      maxHeight:{ type: Number,  default: 30 },
      html:{
        type: String,
        default: ''
      },
    },

    model: {
        prop : 'html',
        event: 'text-changed' // 编辑器的内容发生变化后触发, 参数为编辑的 HTML
    },

    data() {
      return {
        editor: null,
        toolbar:'fontsizeselect undo redo bold italic underline indent outdent superscript subscript  alignleft aligncenter alignright removeformat charmap code image  basicDateButton underscoreButton',
        uploadMode : 0,
        editorId:new Date().getTime()
      }
    },

    beforeDestroy() {
        // 销毁编辑器
        this.editor.remove();
    },

    watch: {
      html:{
        immediate: true,
        handler () {
          if(this.editor){
            this.editor.setContent(this.html)
          }
        }
      }
    },
    mounted() {
      this.initTiny()

    },
    methods: {
      initTiny(){
        const self = this
        tinymce.init({
          selector:`#tinymce_${this.editorId}`,
          // auto_focus: true,
          inline:true,
          toolbar: this.toolbar,
          fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
          plugins: 'advlist image code charmap',
          advlist_bullet_styles: "circle, square",
          content_style: "img {max-width:100%;}",
          autoresize_max_height: 20,
          // height:40 + this.maxHeight,
          language: 'zh_CN',
          menubar: false,
          paste_data_images: true,
          setup: function(editor) {
              // 创建工具栏按钮
              // 添加上传图片按钮
              editor.ui.registry.addButton('image', { icon: 'image', title: '插入图片', onclick: () => {
                  // this.uploadMode = 0;
                  console.log('上传测试')
              } });
              // 编辑器内容发生变化后更新 html 的内容
              editor.on('blur', (e) => {
                  let obj = {
                    val:editor.getContent(),
                    tinyHeight:document.getElementById(e.target.id).offsetHeight
                  }
                  self.$emit('tinymce-change', obj)
              })

              /* Basic button that just inserts the date  切换下划线 */
              editor.ui.registry.addButton('basicDateButton', {
                icon: 'break-line',
                tooltip: '切换下划线',
                onAction: () => {
                  editor.insertContent('<a>&#8203;</a>');
                }
              });

              /* underscore button that just inserts the date  自动添加下划线 */
              editor.ui.registry.addButton('underscoreButton', {
                icon: 'straight-line',
                tooltip: '自动添加下划线',
                onAction: () => {
                  editor.insertContent('<a class="subtopic_a">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</a>');
                }
              });
          },
          images_upload_handler: function (blobInfo, success, failure){
            let formData = new FormData()
            console.log(blobInfo.filename())

            formData.append('img',blobInfo.blob())
            self.$axios.post('http://127.0.0.1:8000/upload/',formData)
                .then(response =>{
                    console.log(response.data['url'])

                    if(response.data['code']==200){
                        success(response.data['url'])
                    }else{
                        failure('上传失败！')
                    }
                })

          }

        }).then(editors => {
            this.editor = editors[0];
            this.editor.setContent(this.html);
        })
      },

    },
  }
</script>

<style lang="less">
@import url('../skins/ui/oxide/skin.min.css');
@import url('../skins/ui/oxide/content.min.css');
@import url('../skins/ui/oxide/content.inline.min.css');

.tox {
  .tox-tbtn--bespoke{
    .tox-tbtn__select-label{
      width: 4em;
    }
  }
  .tox-tbtn{
    height: 30px;
  }
  .tox-toolbar__group{
    height: 30px;
    border-bottom: 1px solid #ddd;
  }
}
.rich-text {
    // 微调 Full featured 的编辑器阴影, 工具栏阴影
    .mce-tinymce {
        box-shadow: 0 0px 1px rgba(0, 0, 0, 0.25);

        .mce-top-part::before {
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        }
    }

    // inline 模式的边框和得到焦点的样式
    .mce-content-body {
        padding: 8px;
        border: 1px solid #DDD;
        border-radius: 3px;

        &.mce-edit-focus {
            outline: none;
            border-color: #47a4f5;
            box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1) inset;
        }
    }

    .mce-notification {
        display: none;
    }
}

// 工具栏样式: 缩小字体, 修改按钮的 hover 背景色等
.mce-panel {
    border: none !important;

    .mce-toolbar .mce-btn-group {
        padding: 0;

        &:not(:first-child) {
            margin-left: 0;
        }

        .mce-btn {
            margin-left: 0;

            &:hover {
                border-color: transparent;
                background: #808695;
                color: white;

                .mce-ico, button {
                    color: white;
                }
            }

            .mce-ico {
                font-size: 14px;
            }
        }
    }
}
</style>