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
export default {
  components: {
    tabPaneBox,
  },
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增客观题',
      options: [
        {
          value: 1,
          label: '一',
        },
        {
          value: 2,
          label: '二',
        },
        {
          value: 3,
          label: '三',
        },
        {
          value: 4,
          label: '四',
        },
        {
          value: 5,
          label: '五',
        },
        {
          value: 6,
          label: '六',
        },
        {
          value: 7,
          label: '七',
        },
        {
          value: 8,
          label: '八',
        },
        {
          value: 9,
          label: '九',
        },
        {
          value: 10,
          label: '十',
        },
        {
          value: 11,
          label: '十一',
        },
        {
          value: 12,
          label: '十二',
        },
        {
          value: 13,
          label: '十三',
        },
        {
          value: 14,
          label: '十四',
        },
        {
          value: 15,
          label: '十五',
        },
        {
          value: 16,
          label: '十六',
        },
        {
          value: 17,
          label: '十七',
        },
        {
          value: 18,
          label: '十八',
        },
        {
          value: 19,
          label: '十九',
        },
        {
          value: 20,
          label: '二十',
        },
        {
          value: 21,
          label: '二十一',
        },
        {
          value: 22,
          label: '二十二',
        },
      ],
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
              id: 'singleBox' + 1,
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
              id: 'checkbox' + 1,
              child: [],
            },
          ],
          judgment: [
            {
              start: 1,
              end: null,
              score: null,
              select: 2,
              id: 'judgment' + 1,
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
  methods: {
    closeFrame () {
      this.openedFrame = false
    },
    opened () {
      this.openedFrame = true
    },
    preCreateQuestion () { },
    hanldeSelect (e) {
      window.console.log(e)
    },
    hanldeDel (obj) {
      console.log(obj)
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
