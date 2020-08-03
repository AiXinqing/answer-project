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
            v-for="row in groupData.singleBox"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
          />
        </template>
        <template v-if="activeName == 'checkbox'">
          <tab-item
            v-for="row in groupData.checkbox"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
          />
        </template>
        <template v-if="activeName == 'judgment'">
          <tab-item
            v-for="row in groupData.judgment"
            :key="row.id"
            :item-data="row"
            :active-name-item="activeName"
            @hanlde-del="handldeDel"
          />
        </template>
      </div>
      <div class="add_question" @click="hanldeAddSubtopic(activeName)">+ 分段添加小题</div>
      <div class="question-group">
        <template v-if="activeName == 'singleBox'">
          <template v-for="row in groupData.singleBox">
            <i :key="row.id"></i>
            <group-item v-for="item in row.childGroup" :key="item.id" :child-group-data="item" />
          </template>
        </template>
        <template v-if="activeName == 'checkbox'">
          <template v-for="row in groupData.checkbox">
            <i :key="row.id"></i>
            <group-item v-for="item in row.checkbox" :key="item.id" :child-group-data="item" />
          </template>
        </template>
        <template v-if="activeName == 'judgment'">
          <template v-for="row in groupData.judgment">
            <i :key="row.id"></i>
            <group-item v-for="item in row.judgment" :key="item.id" :child-group-data="item" />
          </template>
        </template>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import tabSingleItem from './tabPane/_tabSingleItem'
import groupItem from './tabPane/_groupItem.vue'
export default {
  components: {
    tabSingleItem,
    groupItem,
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
      isdisabled: false
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
  },
}
</script>

<style lang="less">
@import "~@/assets/css/variables.less";
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
  height: 39px;
  line-height: 39px;
  border-bottom: 1px solid #888;
}
.group_item:last-child {
  border-bottom: none;
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
</style>
