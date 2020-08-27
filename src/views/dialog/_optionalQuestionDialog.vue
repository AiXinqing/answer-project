<template>
  <hj-dialog
    class="newAdd-content answer_box"
    :title="title"
    :visible.sync="openedFrame"
    :width="'600px'"
    :before-close="closeFrame"
  >
    <div class="item-box ">
      <el-row>
        <el-col :span="12" class="select-item">
          <div class="label">大题题号:</div>
          <hj-select
            :items="options"
            size="mini"
            :value="data.number"

          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="data.topic" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <add-form
        v-for="(item,i) in data.group"
        :key="i"
        :form-data="item"
        @hanlde-status="hanldeStatus"
        @pre-optional-data="preOptionalData"
      />
      <div class="question-group">
        <optional-item
          v-for="(item,i) in groupItemData"
          :key="i"
          :optional-data="item"
        />
      </div>
      <div class="condition_box">
        <el-checkbox v-model="data.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="data.HorizontalLine">
          <span>行数：</span>
          <el-input v-model.number="data.rows" size="mini" @input="rowsFunc"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
          <span class="p-5"> 行 </span>
        </span>
      </div>
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorVal }}</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button type="confirm" :disabled="isdisabledFn" @click="preCreateQuestion">确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
import AddForm from '../questionContent/Precautions/optional/_index'
import optionalItem from '../questionContent/Precautions/optional/_item'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    AddForm,
    optionalItem,
  },
  data () {
    return {
      data: {},
      title: '新增选作题',
      openedFrame: false,
      isdisabledFn: false,
      closeData: {},
      editQuestionId: null,
      errorVal: '',
      questionData: {
        number: 1,
        topic: '选作题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        group: [{
          choices: '', // 几选几
          select: '',
          start: 1,
          end: '',
          score: '',
          id: 'optionalTopic',
          childGroup: [],
        },]
      }
    }
  },
  computed: {
    ...mapState('questionType', [
      'options',
      'AlreadyTopics',
      'currentQuestion',
      'letterArr',
      'determineTopic'
    ]),
    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'BigQuestion',
      'pageData',
      'orderSort',
    ]),
    ...mapState('answerQuestion', ['answerQuestionArr',]),
    errorMessage () {
      return this.errorVal != '' ? true : false
    },
    groupItemData () {
      return this.data.group.map(item => item.childGroup)[0]
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        if (this.editQuestionId == null) {
          this.$nextTick(() => {
            this.data = {
              ...this.data,
              number: this.BigQuestion
            }
          })
        }

      }
    }
  },
  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.set_currentQuestion()
  },
  methods: {
    ...mapMutations('pageContent', [
      'initPageData',
      'amendPageData',
      'set_objectiveData',
      'deletePageData',
      'set_orderSort'
    ]),
    ...mapMutations('questionType', [
      'set_currentQuestion',
      'Empty_AlreadyTopics',
      'Add_AlreadyTopics',
      'set_closeFrame',
      'set_determineTopic',
      'once_AlreadyTopics',
    ]),
    opened () {
      this.questionData.number = this.BigQuestion
      this.data.number = this.BigQuestion
      // 开打弹框
      this.set_currentQuestion()
      this.openedFrame = true
      this.Empty_AlreadyTopics() // 清空
      this.Add_AlreadyTopics(this.determineTopic)
    },
    openedEdit (obj) {
      //编辑弹框
      this.set_currentQuestion()
      this.editQuestionId = obj.id
      this.openedFrame = true
      this.data = JSON.parse(JSON.stringify(obj))
      this.title = '编辑选作题'
    },
    closeFrame () {
      // 关闭弹窗
      this.set_currentQuestion()
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
    },
    preCreateQuestion () {
      // 当前页内容所占高度
      const { rows } = this.data
      // let heights = this.pageHeight[this.pageHeight.length - 1].map(item => item).reduce((accumulator, currentValue) => {
      //   return accumulator + currentValue;
      // })
      // let currentPageHeight = this.page_size - heights - 20 - 20 // 20当前大题下移的20，50标题高度 20每页底部余留
      // console.log(currentPageHeight)
      let rectHeight = rows * 35  // 当前内容高度 45(内部高度)
      let MarginHeight = + 12 + 40
      let heights = rectHeight + MarginHeight + 54

      let obj = {
        MarginHeight: MarginHeight,
        heightTitle: 54,
        height: heights,
        id: 'optional' + +new Date(),
        questionType: 'optionalQuestion',
        content: this.data,
        order: this.orderSort,
        first: true
      }
      // let objArr = []
      // let obj = {
      //   height: rectHeight,
      //   id: 'optional' + +new Date(),
      //   questionType: 'optionalQuestion',
      //   content: this.data,
      //   order: this.orderSort
      // }
      // if (currentPageHeight > rectHeight) {
      //   objArr.push(obj)
      // } else {
      //   // 当页所剩差值
      //   let difference = Math.abs(currentPageHeight - rectHeight)
      //   let SplitHeight = Math.abs(rectHeight - difference)

      //   if (SplitHeight < 50 && SplitHeight != 50) {
      //     objArr.push(obj)
      //   } else {
      //     // 内容拆分值

      //     let preObj = {
      //       ...obj,
      //       height: SplitHeight,
      //       first: true,

      //     }
      //     let nextObj = { ...obj, height: difference }
      //     objArr.push(preObj)
      //     objArr.push(nextObj)
      //   }
      // }

      if (this.editQuestionId == null) {
        // 新增
        // objArr.forEach(obj => {
        //   this.initPageData(obj)
        // })
        this.initPageData(obj)
      } else {
        // 编辑
        //清空编辑前数据
        // this.deletePageData(this.dataTopic.pid)
        // objArr.forEach(obj => {

        //   this.amendPageData({ ...obj, id: this.editQuestionId })
        // })
        this.amendPageData({ ...obj, id: this.editQuestionId })
      }
      // 大题号修改
      this.set_objectiveData(this.data.number)
      //------------------------------------
      this.set_orderSort()
      this.openedFrame = false // 关闭弹窗
      // 清空弹框数据

      this.set_determineTopic(this.data.group[0].childGroup)
      this.set_currentQuestion()

      this.data = JSON.parse(JSON.stringify(this.closeData))
      this.set_closeFrame() // 弹窗关闭置空
    },
    hanldeStatus (val) {
      // 报错状态
      this.errorVal = val
    },
    preOptionalData (obj) {
      // 新增题组
      const index = this.data.group.findIndex(item => item.id === obj.id)
      if (index > -1) {
        this.data.group.splice(index, 1, obj)
      }
    },
    rowsFunc () {
      if (this.data.rows <= 0) {
        this.errorVal = '行数必须大于0'
        this.isdisabledFn = true
      } else {
        this.errorVal = ''
        this.isdisabledFn = false
      }
    }
  },
}
</script>

<style lang="less" >
</style>


