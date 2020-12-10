<template>
  <section class="tinymce-editor" inline></section>
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

    data() {
      return {
        editor: null,
        toolbar:[`undo redo | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough `,
            ` image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link  `],
        plugins:['image']
      }
    },
    watch: {
        // 外部修改 v-model 绑定的 html 的值时更新编辑器的内容
        value(newValue, oldValue) {
            if (newValue != this.editor.getContent()) {
                this.editor.setContent(newValue || oldValue);
            }
        }
    },
    mounted() {
      this.initEditor()
    },
    methods: {
      initEditor(){
        const self = this
        tinymce.init({
          selector:'.tinymce-editor',
          inline: true,
          toolbar: this.toolbar,
          language: 'zh_CN',
          branding: false,
          elementpath: false,
          statusbar:false,
          relative_urls: false, // 不把绝对路径转换为相对路径
          menubar: false,
          setup: function(editor) {
              // 创建工具栏按钮
              // // 添加填空按钮
              // editor.addButton('fitb', { icon: 'code', title: '插入填空', onclick: () => {
              //     editor.insertContent('<abbr class="fitb"> (________) </abbr>');
              // } });

              // // 添加上传图片按钮
              // editor.addButton('image', { icon: 'image', title: '插入图片', onclick: () => {
              //     this.uploadMode = 0;
              //     // show uploader
              // } });

              // // 添加上传 MP3, MP4 按钮
              // editor.addButton('media', { icon: 'media', title: '插入 MP3 或 MP4', onclick: () => {
              //     this.uploadMode = 1;
              //     // show uploader
              // } });

              // // 添加上传附件按钮
              // editor.addButton('attachment', { icon: 'upload', title: '上传附件', onclick: () => {
              //     this.uploadMode = 2;
              //     // show uploader
              // } });

              // 编辑器内容发生变化后更新 html 的内容
              editor.on('blur', () => {
                  self.$emit('input', editor.getContent());
              })
          }
        }).then(editors => {
            this.editor = editors[0];
            this.editor.setContent(this.value);

        })
      },

    },
  }
</script>

<style lang="less" scoped>
@import url('./skins/ui/oxide/skin.min.css');
@import url('./skins/ui/oxide/content.min.css');
@import url('./skins/ui/oxide/content.inline.min.css');
.tox .tox-tbtn--bespoke .tox-tbtn__select-label{
  width: 4em;
}
</style>