<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'500px'"
    :before-close="closeFrame"
    :show-close="false"
  >
    <div class>
      <el-row>
        <el-col :span="6">纸张大小</el-col>
        <el-col :span="18">
          <div
            v-for="item in sizeArr"
            :key="item.id"
            :class="['paper', { active: item.id === size }]"
            @click="hanldeTab(item.id)"
          >
            <span class="paper-size">{{ item.id }}</span>
            <div class="title">{{ item.content }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="el_row_layout">
        <el-col :span="6">答题卡布局</el-col>
        <el-col :span="18">
          <div
            v-for="row in layoutArr"
            :key="row.id"
            :class="['paper', { active: row.id == layout }]"
            v-show="row.pid === size"
            @click="hanldeColumns(row)"
          >
            <span class="paper-size"></span>
            <div class="title">{{ row.content }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dialog-footer createLayout" v-if="createLayout">
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle">创建</hj-button>
    </div>
    <div class="dialog-footer" v-else>
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateTitle(1)">确 定</hj-button>
    </div>
    <question-dialog ref="questionDialogs" />
  </hj-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import questionDialog from '../dialog/_questionData'
export default {
  components: {
    questionDialog,
  },
  props: {
    propLayout: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      openedFrame: false,
      title: '创建答题卡',
      isdisabledFn: false,
      createLayout: true,
      sizeArr: [
        { id: 'A3', content: 'A3/B4/8K纸' },
        { id: 'A4', content: 'A4/B5纸' },
      ],
      layoutArr: [
        { id: 1, content: '一栏', pid: 'A4' },
        { id: 2, content: '两栏', pid: 'A3' },
        { id: 3, content: '三栏', pid: 'A3' },
      ],
      size: this.propLayout.size || 'A3',
      layout: this.propLayout.column || 2,
    }
  },
  computed: {
    ...mapState('titleSet', ['textVal', 'titleInfo', 'titleRows']),
    ...mapState('pageContent', ['questionOrder','pageLayout','pageData']),
  },
  methods: {
    ...mapMutations('pageContent', [
      'pageLayout_change',
      'pageData_add',
      'pageData_edit',
      'pageLayout_launch_page',
      'questionOrder_add']),
    openRForm (type) {
      if (type === 1) {
        this.createLayout = true
      } else {
        this.createLayout = false
      }
      this.openedFrame = true
    },
    closeFrame () {
      this.openedFrame = false
    },
    preCreateTitle (change) {
      const obj = {
        size: this.size,
        column: this.layout,
      }
      this.pageLayout_change(obj)

      const TestData = {
        id: 1,
        height: 380,
        questionType: 'AnswerSheetTitle',
        MarginHeight: 0,
        heightTitle: 0,
        content: {
          textVal: this.textVal,
          titleInfo: this.titleInfo,
          titleRows: this.titleRows,
          pageLayout:this.pageLayout
        },
        order: this.questionOrder,
        first: true
      }
      //
      if (change == 1) {
        this.openedFrame = false
        this.pageData_edit(TestData)

        this.pageData.filter(obj => obj.questionType == 'ObjectiveQuestion').forEach(element => {
          this.$refs.questionDialogs.layoutEdit(element)
        })
        setTimeout(function() { this.pageLayout_launch_page(this.pageLayout) }, 500)
      } else {
        // 新增值
        this.pageData_add(TestData)
      }
      // order排序
      this.questionOrder_add()
      this.openedFrame = false
    },
    hanldeTab (item) {
      this.size = item
      this.layout =
        this.size === 'A4' ? 1 : this.size === 'A3' ? 2 : this.layout
    },
    hanldeColumns (item) {
      this.layout = item.id
    },
  },
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/variables.less';
.createLayout {
  text-align: center;
}
.paper {
  display: inline-block;
  width: 90px;
  text-align: center;
  cursor: pointer;
  .title {
    margin-top: 5px;
  }
  &.active {
    color: @main;
  }
}
.paper-size {
  display: inline-block;
  width: 50px;
  height: 40px;
  border: 2px solid;
  border-radius: 3px;
  line-height: 50px;
  cursor: pointer;
}
.el_row_layout {
  margin-top: 20px;
}
</style>
