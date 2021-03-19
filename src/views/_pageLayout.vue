<template>
  <div>
    <div class="Guide_bar">
      <div class="allscore">
        当前总分：
        <span>{{scoreTotal}}</span> 分
      </div>
      <div class="layout-box">
        <div class="layout-top">
          <span>布局</span>
          <span class="layout-edit" @click="modifyLayoutFunc">修改</span>
        </div>
        <div class="layout-bottom">
          <div>{{size}}</div>
          <div>{{column}}</div>
        </div>
      </div>
    </div>

    <set-dialog ref="editorLayout" :prop-layout="pageLayout"/>

    <hj-dialog title="提示" :visible.sync="openedPrompt" :width="'400px'">
      <div class="Prompt_info">
        <i class="el-icon-question"></i>修改后将会清空所有手动修改的内容，确定修改吗？
      </div>
      <div class="dialog-footer">
        <hj-button type="cancel" @click="closePrompt">取 消</hj-button>
        <hj-button type="confirm" @click="PromptFunc">确 定</hj-button>
      </div>
    </hj-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations} from 'vuex'
import { LAYOUT_COLUMNS,LAYOUT_SIZE } from '@/models/base'

import setDialog from './dialog/_setDialog'
export default {
  components: {
    setDialog,
  },
  data () {
    return {
      openedPrompt: false,
      acid:''
    }
  },
  computed: {
    ...mapState('pageContent', ['scoreTotal']),
    ...mapState('page', ['pageLayout','pageData']),


    column(){
      let index = LAYOUT_COLUMNS.findIndex(obj => obj.id == this.pageLayout.column)
      if(index > -1){
        return LAYOUT_COLUMNS[index].content
      }return '两栏'
    },

    size() {
      let index = LAYOUT_SIZE.findIndex(obj => obj.id == this.pageLayout.size)
      if(index > -1){
        return LAYOUT_SIZE[index].content
      } return 'A3/B4/8K纸'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query.acid) {
          this.acid = query.acid
        }
      },
      immediate: true
    },
  },

  mounted () {
    if(this.acid == ''){
      this.$refs.editorLayout.openRForm(1)
    }else{
      this.editAnswerSheet()
    }
  },

  methods: {
    ...mapMutations('page', ['reset_pageData','change_isNew']),

    closePrompt () {
      this.openedPrompt = false
    },

    openPrompt () {
      this.openedPrompt = true
    },

    PromptFunc () {
      this.$refs.editorLayout.openRForm(2)
      this.closePrompt()
    },

    modifyLayoutFunc () {
      // 打开修改弹出框
      this.openPrompt()
    },

    editAnswerSheet() {
      // 编辑答题卡
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$http.get('Api/Assembly/QBAnswCardBLL/GetQBAnswCard', {params:{ 'acid': this.acid }}
      ).then((res) => {
        const {data} = res
        if(data.ResponseCode =='Success'){
          let obj = data.ResponseContent
          let content = JSON.parse(obj.content)
          console.log(content)
          let layout = content[0].content.pageLayout // 页面布局

          this.reset_pageData(content) // 重新赋值
          this.pageLayout_change(layout)
          this.change_isNew(obj.IsNew)

          loading.close()
        }
      }).catch(function () {
          loading.close()
      });
    }
  },
}
</script>

<style lang="less">
@import "~@/assets/css/variables.less";
.Guide_bar {
  position: fixed;
  left: 7px;
  z-index: 2;
  margin-top: 40px;
  .allscore {
    font-size: 14px;
  }
  .layout-box {
    border: 1px solid @main;
    min-width: 93px;
    background: @white;
    margin-top: 10px;
    font-size: 14px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-top {
    background-color: @font-f7f8;
    padding: 5px 8px;
  }
  .layout-edit {
    color: @mainFont !important;
    cursor: pointer;
    float: right;
  }
  .layout-bottom {
    background-color: @white;
    padding: 10px 8px;
    line-height: 22px;
  }
}
.Prompt_info {
  height: 50px;
  font-size: 14px;
  padding-top: 20px;
  i {
    font-size: 24px;
    color: @warning;
    position: relative;
    top: 3px;
    margin-right: 5px;
  }
}
</style>
