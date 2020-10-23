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
            'existquestionNumber_big_style',
            { Fade: !objectiveData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="existquestionNumber_big"
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
      // isdisabledFn: true,
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
      editQuestionId: null,
      ContentHeight: 0, // 内容高度
      options:[],
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'currentQuestion',
      'letterArr',
      'AlreadyTopics',
      'determineTopic',
      'existquestionNumber_big',
    ]),
    ...mapState('pageContent', [
      'pageLayout',
      'questionNumber_big',
      'pageData',
      'questionOrder',
    ]),
    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },
    errorMessage() {
      return this.errorVal != '' ? true : false
    },
    title(){
      return  !this.editQuestionId ? '新增客观题' : '编辑客观题'
    },
    topicList(){
      const {group} = this.objectiveData
      const{singleBox,checkbox,judgment} = group
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgmentArr = this.traverse(judgment, this.letterArr)
      return [...singleArr, ...checkArr, ...judgmentArr]
    },

    groupData () {
      let result = [];
      for (var i = 0; i < this.topicList.length; i += this.quesctionObj.rows) {
        result.push(this.topicList.slice(i, i + this.quesctionObj.rows));
      }
      return result
    },

    topicGroupData(){
      let RowArr = []
      let columnArr = []
      let widthSum = 0
      this.groupData.forEach(item => {
        let maxWidth = Math.max.apply(Math, item.map(function(o) {return o.width}))
        widthSum += maxWidth

        if(widthSum < 745 ){
          columnArr.push(item)
        }else{
          RowArr.push(columnArr)
          widthSum = maxWidth
          columnArr = []
          columnArr.push(item)
        }

      })

      if(columnArr.length > 0){
        RowArr.push(columnArr)
      }
      return RowArr
    },

    isdisabledFn(){
      return this.topicList.length > 0 && !this.errorMessage ? false :true
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
              number: this.questionNumber_big,
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
            this.existquestionNumber_big.length > 0
              ? this.existquestionNumber_big[0].value
              : null
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      },
    },
    topicList:{
      immediate: true,
      handler(){
        this.Empty_AlreadyTopics()
        if(this.topicList.length > 0){
          this.Add_AlreadyTopics(this.topicList)
        }else{
          this.Add_AlreadyTopics(this.determineTopic)
        }
        this.set_currentQuestion()
      }
    }
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
      'set_existquestionNumber_big', //存大题号信息
      'insert_existquestionNumber_big',
      'delOnce_determineTopic',
    ]),
    ...mapMutations('pageContent', [
      'pageData_add',
      'pageData_edit',
      'pageData_insert',
      'questionNumber_big_add',
      'questionOrder_add',
    ]),
    closeFrame() {
      // 取消弹框
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false

      this.Empty_AlreadyTopics() // 清空
    },
    opened() {
      this.quesctionObj = JSON.parse(
        JSON.stringify({ ...this.quesctionObj, number: this.questionNumber_big })
      )

      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
      this.set_currentQuestion()
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
      this.set_currentQuestion()
    },

    layoutEdit(obj){
      // 改变页面布局使用

      const {group,rows} = obj.content
      const{singleBox,checkbox,judgment} = group
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgmentArr = this.traverse(judgment, this.letterArr)
      let topicList = [...singleArr, ...checkArr, ...judgmentArr]

      let result = []
      for (var i = 0; i < topicList.length; i += rows) {
        result.push(topicList.slice(i, i + rows))
      }

      const maxWidth = []
      result.filter((item) => {
        let widthS = item.map((row) => row.width)
        maxWidth.push(Math.max.apply(null, widthS))
      })
      let heights = this.HeightCalculation(maxWidth, result)

      let RowArr = []
      let columnArr = []
      let widthSum = 0
      result.forEach(item => {
        let maxWidth = Math.max.apply(Math, item.map(function(o) {return o.width}))
        widthSum += maxWidth

        if(widthSum < 745 ){
          columnArr.push(item)
        }else{
          RowArr.push(columnArr)
          widthSum = maxWidth
          columnArr = []
          columnArr.push(item)
        }

      })

      if(columnArr.length > 0){
        RowArr.push(columnArr)
      }

      this.pageData_edit({
        ...obj,
        height: heights + 32,
        showData:RowArr
      })

      return heights
    },
    preCreateQuestion() {
      // 数据编辑完成添加至全局数组中---------------
      const {
        rows,
        topic,
        number,
        InsertTitle,
        Postpone,
      } = this.objectiveData
      this.set_determineTopic(this.topicList) // 储存确实题型

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

      let scoreTotal = 0

      this.topicList.map((item) => {
        scoreTotal += item.score
      })
      this.objectiveData = {
        ...this.objectiveData,
        scoreTotal: scoreTotal,
      }
      let objId = `objective_${+new Date()}`
      var obj = {
        heightTitle: 23,
        MarginHeight: 10,
        rowHeight: 21 * rows,
        id: objId,
        height: heights + 32, // 32标题高度
        questionType: 'ObjectiveQuestion',
        content: {
          ...this.objectiveData,
          pageLayout:this.pageLayout
        },
        order: this.questionOrder,
        showData:this.topicGroupData,
        first: true,
      }

      let existquestionNumber_bigObj = {
        id: objId,
        label: `${this.options[number].label}.${topic}`,
        value: number,
        order: this.questionOrder,
      }

      if (this.editQuestionId == null) {
        if (InsertTitle && this.existquestionNumber_big.length > 0) {
          let index = this.existquestionNumber_big.findIndex(
            (item) => item.value === this.existNumber
          )
          if (index > -1) {
            let objIndex = this.pageData.findIndex(
              (item) => item.id == this.existquestionNumber_big[index].id
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
                SelfOrder: Postpone || false,
              }
              this.pageData_insert(data)
              //-------------------------------------------------已选大题数组
              this.insert_existquestionNumber_big({
                obj: {
                  ...existquestionNumber_bigObj,
                  order: this.existquestionNumber_big[index].order + 1,
                },
                num: this.existNumber,
                order: this.existquestionNumber_big[index].order,
                SelfOrder: Postpone || false,
              })
            }
          }
        } else {
          this.pageData_add(obj)
        }

        this.questionOrder_add()
        this.set_existquestionNumber_big({ ...existquestionNumber_bigObj, id: obj.id })
        this.questionNumber_big_add() // 大题号增加
      } else {
        this.delOnce_determineTopic(this.topicList[0].pid)
        obj.id = this.editQuestionId
        this.pageData_edit(obj)
      }
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
.existquestionNumber_big_style {
  display: inline-block;
  .hj-select {
    display: inline-block;
    margin: 0 5px;
  }
}
.Postpone {
  margin-left: 20px;
}
.existquestionNumber_big_style.Fade,
.Postpone.Fade {
  color: #999;
}
</style>
