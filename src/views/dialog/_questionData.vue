<template>
  <hj-dialog
    class="newAdd-content"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="quesctionObj.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="quesctionObj.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每组题数:</div>
          <el-input v-model="quesctionObj.rows" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <tab-pane-box
        :tab-pane-data="tabData"
        :group-data="quesctionObj.group"
        @hanlde-dels="hanldeDel"
        @hanlde-add-subtopic="hanldeAddSubtopic"
      />
    </div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import tabPaneBox from '../questionContent/Precautions/_tabPaneBox'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    tabPaneBox,
  },
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增客观题',
      quesctionObj: {
        number: 1,
        topic: '选择题',
        rows: 5,
        group: {
          singleBox: [
            {
              start: 1,
              end: null,
              score: null,
              select: 4,
              id: 'singleBox0',
              child: [],
            },
          ],
          checkbox: [
            {
              start: 1,
              end: null,
              score: null,
              lessScore: null,
              select: 4,
              id: 'checkbox0',
              child: [],
            },
          ],
          judgment: [
            {
              start: 1,
              end: null,
              score: null,
              select: 2,
              id: 'judgment0',
              child: [],
            },
          ],
        },
      },
      tabData: [
        { label: '单选框', name: 'singleBox' },
        { label: '多选框', name: 'checkbox' },
        { label: '判断题', name: 'judgment' },
      ],
    }
  },
  computed: {
    ...mapState('questionType', ['options']),
    ...mapGetters('questionType', ['currentQuestion']),
    // currentQuestion () {// 分段题组
    //   return this.endQuestion == null ? this.startQuestion : 1
    // }
  },
  methods: {
    closeFrame () {
      this.openedFrame = false
    },
    opened () {
      this.openedFrame = true
    },
    preCreateQuestion () { },
    hanldeSelect (e) {
      // 选择答题号
      window.console.log(e)
    },
    hanldeDel (obj) {
      // 删除分段-小题组
      const group = this.quesctionObj.group
      const groupItem =
        obj.type == 'singleBox'
          ? group.singleBox
          : obj.type == 'checkbox'
            ? group.checkbox
            : group.judgment
      const index = groupItem.findIndex((item) => item.id == obj.id)
      if (index > -1) {
        groupItem.splice(index, 1)
      }
    },
    hanldeAddSubtopic (type) {
      // 新增小题组-分段添加小题
      const group = this.quesctionObj.group
      const groupItem =
        type == 'singleBox'
          ? group.singleBox
          : type == 'checkbox'
            ? group.checkbox
            : group.judgment
      const long = +new Date() // 时间戳
      const itemObj = {
        start: this.currentQuestion,
        end: null,
        score: null,
        select: 4,
        id: type + long,
        child: [],
      }
      groupItem.push(itemObj)
      console.log(groupItem)
    },
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.select-item {
  display: flex;
  .label {
    width: 70px;
    position: relative;
    top: 4px;
  }
}
.select-item:last-child {
  margin-top: 20px;
  .el-input.el-input--mini {
    width: 130px;
  }
}
.hj-select {
  width: 130px;
}
.card_top {
  margin-top: 20px;
}
.el-tabs--border-card {
  box-shadow: none !important;
  border: none;
}
</style>

<style lang="less">
.el-tabs__nav-wrap {
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #1ab394 !important;
}
</style>
