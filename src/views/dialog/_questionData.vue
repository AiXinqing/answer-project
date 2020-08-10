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
            :value="objectiveData.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="objectiveData.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每组题数:</div>
          <el-input v-model="objectiveData.rows" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <tab-pane-box
        :tab-pane-data="tabData"
        :group-data="objectiveData.group"
        @hanlde-dels="hanldeDel"
        @hanlde-add-subtopic="hanldeAddSubtopic"
        @hanlde-status="hanldeStatus"
        @hanlde-add-group-question="hanldeAddGroupQuestion"
        @edit-topic-func="editTopicFunc"
      />
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
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
  data () {
    return {
      openedFrame: false,
      isdisabledFn: false,
      title: '新增客观题',
      quesctionObj: {
        number: 1,
        topic: '选择题',
        rows: 5,
        startQuestion: 1,
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
      editQuestionId: null
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'startQuestion',
      'endQuestion',
      'AlreadyTopics',
      'delTopics',
      'currentQuestion',
      'letterArr'
    ]),
    ...mapState('pageContent', ['pageData']),
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
  },
  watch: {
    quesctionObj: {
      immediate: true,
      handler () {
        this.objectiveData = {
          ...this.quesctionObj
        }

      }
    }
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.quesctionObj))
  },
  methods: {
    ...mapMutations('questionType', [
      'set_startQuestion',
      'set_endQuestion',
      'set_minTopic',
      'set_SubtitleNumber',
      'delete_SubtitleNumber',
      'set_delTopics',
      'set_currentQuestion',
      'set_closeFrame',
      'Add_AlreadyTopics', // 小题数组
      'del_AlreadyTopics', // 删除题组-小题
    ]),
    ...mapMutations('pageContent', ['initPageData', 'amendPageData']),
    closeFrame () {
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame(this.quesctionObj.startQuestion)
      this.openedFrame = false
    },
    opened () {
      this.openedFrame = true
      this.set_currentQuestion()
    },
    openedEdit (id) {
      let current = this.pageData.filter(item => item.id === id)
      this.quesctionObj = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.openedFrame = true
      this.title='编辑客观题'
      this.set_currentQuestion()
    },
    preCreateQuestion () { // 数据编辑完成添加至全局数组中---------------
      let group = this.objectiveData.group
      const singleBox = group.singleBox
      //------------------------------------小题计算
      const singleArr = this.traverse(singleBox, this.letterArr)
      const checkbox = group.checkbox
      const checkArr = this.traverse(checkbox, this.letterArr)
      const judgment = group.judgment
      const judgmentArr = this.traverse(judgment, this.letterArr)
      //------------------xiao题号数组-------------------------
      this.topicList = [...singleArr, ...checkArr, ...judgmentArr]
      let long = this.topicList.length
      //-------------------------------------------
      let result = [];
      for (var i = 0; i < this.topicList.length; i += this.objectiveData.rows) {
        result.push(this.topicList.slice(i, i + this.objectiveData.rows));
      }

      // const maxWidth = result.filter(item => {
      //   // console.log(item)
      // })

      // window.console.log(maxWidth)

      let row = this.objectiveData.rows // 排列行数
      let hang = Math.ceil(long / row)
      let lie = Math.ceil(hang / 4)
      let heights = lie * (row * 21) + 21
      let totalScore = 0;

      this.topicList.map(item => {
        totalScore += item.score
      })
      this.objectiveData = {
        ...this.objectiveData,
        totalScore: totalScore
      }
      var obj = {
        id: 'objective' + +new Date(),
        height: heights,
        questionType: 'ObjectiveQuestion',
        content: this.objectiveData,
      }

      if (this.editQuestionId == null) {
        this.initPageData(obj)
      } else {
        obj.id = this.editQuestionId
        this.amendPageData(obj)
      }
      // guan bi - 清楚数据
      this.quesctionObj = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame(this.quesctionObj.startQuestion)
      // 小题数组追加数据
      this.Add_AlreadyTopics(this.topicList)
      //------------------------------------
      this.openedFrame = false // 关闭弹窗
    },
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
        let itemTopic = groupItem[index]
        // 更改题型状态值
        if (this.minTopic <= itemTopic.end) {
          this.set_minTopic(itemTopic.end)
        }
        this.set_endQuestion(itemTopic.end)
        this.set_startQuestion(itemTopic.start)

        this.del_AlreadyTopics(itemTopic.childGroup) // 删除弹框内临时数组
        groupItem.splice(index, 1)
        this.delete_SubtitleNumber(obj.id)
        this.set_delTopics({ start: itemTopic.start, end: itemTopic.end })
        this.$nextTick(() => {
          this.set_currentQuestion()
        })
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
          lessScore: null
        }
      }
      groupItem.push(itemObj)
    },
    hanldeStatus (statusObj) {
      this.errorVal = statusObj.val
      // 分段题组增加小题详情状态
    },
    hanldeAddGroupQuestion (itemObj) {
      //题组详情
      const group = this.quesctionObj.group
      const groupItem =
        itemObj.type == 'singleBox'
          ? group.singleBox
          : itemObj.type == 'checkbox'
            ? group.checkbox
            : group.judgment
      const index = groupItem.findIndex(item => item.id === itemObj.data.id)

      if (index > -1) {

        let itemTopic = itemObj.data // 当前新增

        groupItem.splice(index, 1, itemObj.data) // 替换
        // 追曾小题号至数组
        let obj = { start: itemTopic.start, end: itemTopic.end, id: itemTopic.id }
        this.set_SubtitleNumber(obj)
      }
    },
    editTopicFunc (dataItem, type) {
      // 编辑小题详情
      const group = this.quesctionObj.group
      const groupItem =
        type == 'singleBox'
          ? group.singleBox
          : type == 'checkbox'
            ? group.checkbox
            : group.judgment
      const index = groupItem.findIndex(item => item.id === dataItem.pid)
      if (index > -1) {
        let currentGroup = groupItem[index]
        let currentIndex = currentGroup.childGroup.findIndex(item => item.id === dataItem.id)
        if (currentIndex > -1) {
          currentGroup.childGroup.splice(currentIndex, 1, dataItem) // 替换

        }
      }
    },
    traverse (Arr, letterArr)  {
      if (Arr.length > 0) {
        let data = []
        Arr.forEach(item => {
          item.childGroup.forEach(row =>{
            let obj = {
              ...row,
              selectBox:row.select == 2 && row.id.indexOf('judgment') != -1 ? ['T', 'F'] : letterArr.slice(0, row.select),
              width:row.select * 26 + 42
            }
            data.push(obj)
          })
        })

        return data
      } else {
        return []
      }
    }
  },
}
</script>

<style lang="less" scoped>
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
  text-indent: 1em;
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
