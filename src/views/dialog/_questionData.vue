<template>
  <!-- 选择题 -->
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
            :value="objectiveData.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="objectiveData.topic"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每组题数:</div>
          <el-input
            v-model.number="objectiveData.rows"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
      </el-row>
      <tab-pane-box
        :tab-pane-data="tabData"
        :group-data="objectiveData.group"
        :edit-id="editQuestionId"
        @hanlde-dels="hanldeDel"
        @hanlde-add-subtopic="hanldeAddSubtopic"
        @hanlde-status="hanldeStatus"
        @hanlde-add-group-question="hanldeAddGroupQuestion"
        @edit-topic-func="editTopicFunc"
      />
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
        <el-checkbox v-model="objectiveData.InsertTitle"
          >插入添加题目</el-checkbox
        >
        <div
          :class="[
            'existBigQuestion_style',
            { Fade: !objectiveData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="existBigQuestion"
            size="mini"
            :value="existNumber"
            @change="hanldeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !objectiveData.InsertTitle }]"
          v-model="objectiveData.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!objectiveData.InsertTitle"></div>
      </div>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="preCreateQuestion"
        >确 定</hj-button
      >
    </div>
  </hj-dialog>
</template>

<script>
import tabPaneBox from '../questionContent/Precautions/_tabPaneBox'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    tabPaneBox,
  },
  data() {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增客观题',
      existNumber: null,
      quesctionObj: {
        number: 1,
        topic: '选择题',
        rows: 5,
        startQuestion: 1,
        InsertTitle: false,
        Postpone: false,
        group: {
          singleBox: [
            {
              start: 1,
              end: null,
              score: null,
              select: 4,
              id: 'singleBox0',
              childGroup: [],
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
              childGroup: [],
            },
          ],
          judgment: [
            {
              start: 1,
              end: null,
              score: null,
              select: 2,
              id: 'judgment0',
              childGroup: [],
            },
          ],
        },
      },
      tabData: [
        { label: '单选框', name: 'singleBox' },
        { label: '多选框', name: 'checkbox' },
        { label: '判断题', name: 'judgment' },
      ],
      closeData: {},
      errorVal: '',
      objectiveData: {},
      topicList: [],
      editQuestionId: null,
      ContentHeight: 0, // 内容高度
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'currentQuestion',
      'letterArr',
      'AlreadyTopics',
      'determineTopic',
      'existBigQuestion',
    ]),
    ...mapState('pageContent', [
      'pageLayout',
      'BigQuestion',
      'pageData',
      'orderSort',
    ]),
    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    capitalTopicNum() {
      let index = this.options.findIndex(
        (item) => this.objectiveData.number == item.value
      )
      if (index > -1) {
        return this.options[index].label
      } else {
        return '一'
      }
    },
  },
  watch: {
    quesctionObj: {
      immediate: true,
      handler() {
        this.objectiveData = {
          ...this.quesctionObj,
        }
        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.objectiveData = {
              ...this.objectiveData,
              number: this.BigQuestion,
            }
          })
          // 小题号改变更换小题号
          const { group } = this.objectiveData
          group.singleBox.map((item) => {
            return {
              ...item,
              start: item.end == null ? this.currentQuestion : item.start,
            }
          })
          group.checkbox.map((item) => {
            return {
              ...item,
              start: item.end == null ? this.currentQuestion : item.start,
            }
          })
          group.judgment.map((item) => {
            return {
              ...item,
              start: item.end == null ? this.currentQuestion : item.start,
            }
          })
          this.existNumber =
            this.existBigQuestion.length > 0
              ? this.existBigQuestion[0].value
              : null
        }
      },
    },
  },
  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.quesctionObj))
  },
  methods: {
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Add_AlreadyTopics', // 小题数组
      'del_AlreadyTopics', // 删除题组-小题
      'set_determineTopic', // 储存确定题型
      'Empty_AlreadyTopics', // 清空
      'set_existBigQuestion', //存大题号信息
      'insert_existBigQuestion',
    ]),
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'insert_pageData',
      'set_objectiveData',
      'set_orderSort',
    ]),
    closeFrame() {
      // 取消弹框
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false

      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    opened() {
      this.quesctionObj = JSON.parse(
        JSON.stringify({ ...this.quesctionObj, number: this.BigQuestion })
      )

      this.openedFrame = true
      this.set_currentQuestion()
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    change(id, num) {
      let current = this.pageData.filter((item) => item.id === id)
      this.quesctionObj = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id

      let rows = this.quesctionObj.rows
      if (num == 1) {
        // 1减法 2加法

        if (rows > 1) {
          rows -= 1
        } else {
          rows = 1
        }
      } else {
        if (rows < 10) {
          rows += 1
        } else {
          rows = 10
        }
      }
      this.quesctionObj.rows = rows
      this.objectiveData.rows = rows
      this.$nextTick(() => {
        this.preCreateQuestion()
      })
    },

    openedEdit(id) {
      let current = this.pageData.filter((item) => item.id === id)
      this.quesctionObj = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.openedFrame = true
      this.title = '编辑客观题'
      this.set_currentQuestion()
    },
    preCreateQuestion() {
      // 数据编辑完成添加至全局数组中---------------
      const {
        group,
        rows,
        topic,
        number,
        InsertTitle,
        Postpone,
      } = this.objectiveData
      const singleBox = group.singleBox
      //------------------------------------小题计算
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkbox = group.checkbox
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgment = group.judgment
      const judgmentArr = this.traverse(judgment, this.letterArr)
      //------------------xiao题号数组-------------------------
      this.topicList = [...singleArr, ...checkArr, ...judgmentArr]
      this.set_determineTopic(this.topicList) // 储存确实题型

      //-------------------------------------------
      let result = []
      for (var i = 0; i < this.topicList.length; i += rows) {
        result.push(this.topicList.slice(i, i + rows))
      }
      const maxWidth = []
      result.filter((item) => {
        let widthS = item.map((row) => row.width)
        maxWidth.push(Math.max.apply(null, widthS))
      })

      // 计算出的内容高度值
      let heights = this.HeightCalculation(maxWidth, result)
      this.ContentHeight = heights // 内容高度
      // 计算出的内容高度值

      let totalScore = 0

      this.topicList.map((item) => {
        totalScore += item.score
      })
      this.objectiveData = {
        ...this.objectiveData,
        totalScore: totalScore,
      }
      let objId = `objective_${+new Date()}`
      var obj = {
        id: objId,
        height: heights + 32, // 32标题高度
        rowHeight: 35,
        questionType: 'ObjectiveQuestion',
        content: this.objectiveData,
        order: this.orderSort,
      }

      let existBigQuestionObj = {
        id: objId,
        label: `${this.capitalTopicNum}.${topic}`,
        value: number,
        order: this.orderSort,
      }

      if (this.editQuestionId == null) {
        if (InsertTitle && this.existBigQuestion.length > 0) {
          let index = this.existBigQuestion.findIndex(
            (item) => item.value === this.existNumber
          )
          if (index > -1) {
            let objIndex = this.pageData.findIndex(
              (item) => item.id == this.existBigQuestion[index].id
            )
            if (objIndex > -1) {
              //-------------------------------------------------插入数组对象
              let data = {
                obj: {
                  ...obj,
                  order: this.pageData[index].order + 1,
                },
                num: this.existNumber + 1,
                order: this.pageData[index].order + 1,
                SelfO0rder: Postpone || false,
              }
              this.insert_pageData(data)
              //-------------------------------------------------已选大题数组
              this.insert_existBigQuestion({
                obj: {
                  ...existBigQuestionObj,
                  order: this.existBigQuestion[index].order + 1,
                },
                num: this.existNumber,
                order: this.existBigQuestion[index].order,
                SelfO0rder: Postpone || false,
              })
            }
          }
        } else {
          this.initPageData(obj)
          this.set_existBigQuestion(existBigQuestionObj)
        }

        this.set_orderSort()
      } else {
        obj.id = this.editQuestionId
        this.amendPageData(obj)
        this.set_existBigQuestion({ ...existBigQuestionObj, id: obj.id })
      }

      this.set_objectiveData() // 大题号增加
      // 小题数组追加数据
      this.Add_AlreadyTopics(this.topicList)
      this.set_determineTopic(this.topicList)
      // guan bi - 清楚数据
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))

      //------------------------------------
      this.openedFrame = false // 关闭弹窗
    },
    hanldeSelect(e) {
      // 选择答题号
      this.quesctionObj.number = e
      this.objectiveData.number = e
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
    hanldeDel(obj) {
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
        let itemTopic = groupItem[index]
        // 更改题型状态值

        this.del_AlreadyTopics(itemTopic.childGroup) // 删除弹框内临时数组
        groupItem.splice(index, 1)

        this.$nextTick(() => {
          this.set_currentQuestion()
        })
      }
    },
    hanldeAddSubtopic(type) {
      // 新增小题组-分段添加小题
      const group = this.quesctionObj.group
      const groupItem =
        type == 'singleBox'
          ? group.singleBox
          : type == 'checkbox'
          ? group.checkbox
          : group.judgment
      const long = +new Date() // 时间戳
      let itemObj = {
        start: this.currentQuestion,
        end: null,
        score: null,
        select: 4,
        id: type + long,
        childGroup: [],
      }
      if (type == 'checkbox') {
        itemObj = {
          ...itemObj,
          lessScore: null,
        }
      }
      groupItem.push(itemObj)
    },
    hanldeStatus(statusObj) {
      this.errorVal = statusObj.val
      // 分段题组增加小题详情状态
    },
    hanldeAddGroupQuestion(itemObj) {
      //题组详情
      const group = this.quesctionObj.group
      const groupItem =
        itemObj.type == 'singleBox'
          ? group.singleBox
          : itemObj.type == 'checkbox'
          ? group.checkbox
          : group.judgment
      const index = groupItem.findIndex((item) => item.id === itemObj.data.id)

      if (index > -1) {
        groupItem.splice(index, 1, itemObj.data) // 替换
      }
    },
    editTopicFunc(dataItem, type) {
      // 编辑小题详情
      const group = this.quesctionObj.group
      const groupItem =
        type == 'singleBox'
          ? group.singleBox
          : type == 'checkbox'
          ? group.checkbox
          : group.judgment
      const index = groupItem.findIndex((item) => item.id === dataItem.pid)
      if (index > -1) {
        let currentGroup = groupItem[index]
        let currentIndex = currentGroup.childGroup.findIndex(
          (item) => item.id === dataItem.id
        )
        if (currentIndex > -1) {
          currentGroup.childGroup.splice(currentIndex, 1, dataItem) // 替换
        }
      }
    },
    traverse(Arr, letterArr) {
      if (Arr.length > 0) {
        let data = []
        Arr.forEach((item) => {
          item.childGroup.forEach((row) => {
            let obj = {
              ...row,
              selectBox:
                row.select == 2 && row.id.indexOf('judgment') != -1
                  ? ['T', 'F']
                  : letterArr.slice(0, row.select),
              width: row.select * 26 + 42,
            }
            data.push(obj)
          })
        })

        return data
      } else {
        return []
      }
    },
    HeightCalculation(maxWidth, result) {
      // 计算题型内容所占高度
      // 计算宽度所占数组长度
      let widths = []
      let sum = 0
      let i
      let a = 0
      for (i = 0; i < maxWidth.length; i++) {
        sum = sum + maxWidth[i]
        a += 1
        if (sum >= this.pageWidth) {
          widths.push(a - 1)
          sum = 0
          a = 1
          sum = sum + maxWidth[i]
        }
      }
      if (maxWidth.length > 0) {
        let long = 0
        if (widths.length > 0) {
          long =
            maxWidth.length -
            widths.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )
        } else {
          long = maxWidth.length - 0
        }
        widths.push(long)
      }
      // let widthsLong = widths.length
      // 计算高度所占数组长度
      let heights = result.map((item) => item.length * 22)

      // 根据宽度数组 和 高度数组合成高度二维数组
      let twoDimensional = []
      let num = 0
      for (let i = 0; i < widths.length; i++) {
        num += widths[i]
        twoDimensional.push(heights.slice(num - widths[i], num))
      }
      let heightList = twoDimensional.map((item) => {
        return Math.max.apply(null, item)
      })
      if (heightList.length > 0) {
        return (
          heightList.reduce(
            (accumulator, currentValue) => accumulator + currentValue
          ) +
          heightList.length * 10
        )
      } else {
        return 0
      }
    },
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
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
.error-message {
  color: red;
  font-size: 14px;
}
.question-group {
  .group_item:last-child {
    .el-row:last-child {
      border-bottom: none;
    }
  }
}

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
.Insert_box {
  margin-top: 10px;
  position: relative;
  .Insert_Mask {
    position: absolute;
    width: 80%;
    height: 28px;
    right: 0;
    top: 0;
  }
}
.existBigQuestion_style {
  display: inline-block;
  .hj-select {
    display: inline-block;
    margin: 0 5px;
  }
}
.Postpone {
  margin-left: 20px;
}
.existBigQuestion_style.Fade,
.Postpone.Fade {
  color: #999;
}
</style>
