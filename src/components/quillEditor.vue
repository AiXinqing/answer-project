<template>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)" >
    </quill-editor>
</template>
<script>
    import { quillEditor } from 'vue-quill-editor'
    export default{
      components: {
        quillEditor,
      },
      props: {
        TopicContent: {
          type: String,
          default: ''
        },
      },
      data(){
          return {
              content:null,
              editorOption:{
                  modules:{
                      toolbar:[
                        [{ 'align': [] }],
                        ['bold', 'italic', 'underline', 'strike','image'],        // toggled buttons
                        // [ 'code-block'], // 'blockquote',
                        [{ 'script': 'sub'}, { 'script': 'super' }],  // 值sub，super
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'size': [] },],
                      ]
                  }
              }
          }
      },
      watch: {
        TopicContent: {
          immediate: true,
          handler () {
            this.content = this.TopicContent
          }
        }
      },
      methods:{
          onEditorBlur(){//失去焦点事件
            // console.log(this.content)
            this.$emit('hanlde-close-esitor',this.content)
          },
          onEditorFocus(){//获得焦点事件
          },
          onEditorChange(){//内容改变事件
          }
      }
    }
</script>