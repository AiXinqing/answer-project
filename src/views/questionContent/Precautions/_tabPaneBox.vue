<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="hanldeClick" class="card_top">
    <el-tab-pane
      v-for="(item, i) in tabPaneData"
      :key="i"
      :label="item.label"
      :name="item.name"
      :disabled="isdisabled"
    >
      <div class="big-question-box">
        <template v-if="activeName == 'singleBox'">
          <tab-single-item
            v-for="row in data.singleBox"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
            @hanlde-status="hanldeStatus"
            @hanlde-add-group-question="hanldeAddGroupQuestion"
          />
        </template>
        <template v-if="activeName == 'checkbox'">
          <tab-check-item
            v-for="row in data.checkbox"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
            @hanlde-status="hanldeStatus"
            @hanlde-add-group-question="hanldeAddGroupQuestion"
          />
        </template>
        <template v-if="activeName == 'judgment'">
          <tab-judgment
            v-for="row in data.judgment"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
            @hanlde-status="hanldeStatus"
            @hanlde-add-group-question="hanldeAddGroupQuestion"
          />
        </template>
      </div>
      <div class="add_question" @click="hanldeAddSubtopic(activeName)">+ 分段添加小题</div>
      <div class="question-group">
        <template v-if="activeName == 'singleBox'">
          <template v-for="row in data.singleBox">
            <div :key="row.id" class="group_item">
              <single-topic
                v-for="item in row.childGroup"
                :key="item.id" :child-item="item"
                @edit-topic-func="editTopicFunc"
              />
            </div>
          </template>
        </template>
        <template v-if="activeName == 'checkbox'">
          <template v-for="row in data.checkbox">
            <div :key="row.id" class="group_item">
              <check-topic
                v-for="item in row.childGroup"
                :key="item.id" :child-item="item"
                @edit-topic-func="editTopicFunc"
              />
            </div>
          </template>
        </template>
        <template v-if="activeName == 'judgment'">
          <template v-for="row in data.judgment">
            <div :key="row.id" class="group_item">
              <judgment-topic
                v-for="item in row.childGroup"
                :key="item.id"
                :child-item="item"
              />
            </div>
          </template>
        </template>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import tabSingleItem from './tabPane/tabSingleItem'
import tabCheckItem from './tabPane/_tabCheckItem'
import tabJudgment from './tabPane/_tabJudgment'
import singleTopic from './tabPane/_singleTopic'
import checkTopic from './tabPane/_checkTopic'
import judgmentTopic from './tabPane/_judgmentTopic'
export default {
  components: {
    tabSingleItem,
    tabCheckItem,
    tabJudgment,
    singleTopic,
    checkTopic,
    judgmentTopic
  },
  props: {
    tabPaneData: {
      type: Array,
      default: () => [],
    },
    groupData: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      activeName: 'singleBox',
      input: '',
      isdisabled: false,
      data: {}
    }
  },
  watch: {
    groupData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.groupData
        }
      }
    }
  },
  methods: {
    hanldeClick () { },
    handldeDel (obj) {
      this.$emit('hanlde-dels', obj)
    },
    hanldeAddSubtopic (type) {
      this.$emit('hanlde-add-subtopic', type)
    },
    hanldeStatus (statusObj) {
      // 判断当前tab切换状态
      this.isdisabled = statusObj.status
      this.$emit('hanlde-status', statusObj)
    },
    hanldeAddGroupQuestion (itemObj) {
      //题组详情
      this.$emit('hanlde-add-group-question', itemObj)
    },
    editTopicFunc (data, type) {
      this.$emit('edit-topic-func', data, type)
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.add_question {
  color: @main;
  cursor: pointer;
  width: 100px;
}
.big-question-box {
  margin-bottom: 20px;
}
.question-group {
  width: 100%;
  height: 200px;
  overflow: auto;
  border: 1px solid #888;
  margin-top: 15px;
}
.big-item,
.group_item_right {
  position: relative;
  display: flex;
  input {
    width: 48px;
    height: 28px;
  }
  .el-input--mini {
    width: 48px;
  }
  span {
    position: relative;
    top: 5px;
    margin: 0 3px;
  }
  .el-icon-delete {
    position: absolute;
    right: 0;
    top: 5px;
    font-size: 18px;
    cursor: pointer;
  }
}
.group_item {
  width: 100%;
  height: 39px;
  line-height: 39px;
  border-bottom: 1px solid #888;
  display: contents;
}
.group_item:last-child {
  .el-row:last-child {
    border-bottom: none;
  }
}

.group_item_right {
  text-align: right;
  position: relative;
  span {
    top: 0px;
    margin: 0 5px;
  }
  > div {
    position: absolute;
    right: 0;
  }
}
.question_tabtitle {
  text-indent: 1em;
}
.big-item:nth-child(n + 2) {
  margin-top: 10px;
}
.el-tabs__header.is-top {
  .el-input--mini .el-input__inner {
    text-align: center;
  }
}
</style>
