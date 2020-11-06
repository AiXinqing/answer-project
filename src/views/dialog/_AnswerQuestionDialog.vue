<template>
<!-- 填空题 -->
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
            :value="dataTopic.number"
            @change="hanldeSelect"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input v-model="dataTopic.topicName" size="mini" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <!-- 新增题组 -->
      <question-grous
        v-for="(item,i) in dataTopic.group"
        :key="i"
        :form-data="item"
        :edit-id="editQuestionId"
        @hanlde-status="hanldeStatus"
        @add-answer-topic-group="addAnswerTopicGroup"
      />
      <!-- 新增题组 -->
      <div class="question-group">
        <!-- 小题显示区 -->
        <subtopic-level-item
          v-for="(item,i) in childGroups"
          :key="i"
          :child-data="item"
          @pre-edit-sub-answer-item="preEditSubAnswerItem"
          @pre-edit-two-subtopic="preEditTwoSubtopic"
          @pre-edit-points-answer-group="preEditPointsAnswerGroup"
          @pre-edit-last-subtopic="preEditLastSubtopic"

          @pre-edit-last-answer-item="preEditLastAnswerItem"
        />
        <!-- 小题显示区 -->
      </div>
      <div class="condition_box">
        <el-checkbox v-model="dataTopic.ShowScore">小题显示分数</el-checkbox>
        <el-checkbox v-model="dataTopic.HorizontalLine">生成解答题横线</el-checkbox>
        <span class="answer_rows" v-show="dataTopic.HorizontalLine">
          <span>行数：</span>
          <el-input v-model.number="dataTopic.rows" size="mini"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" />
          <span class="p-5"> 行 </span>
        </span>
      </div>
      <div class="condition_box Insert_box" v-show="editQuestionId ==''">
        <el-checkbox v-model="dataTopic.InsertTitle">插入添加题目</el-checkbox>
        <div
          :class="['questionNumber_big_exist_style',{'Fade':!dataTopic.InsertTitle}]">
          <span>插入到第</span>
          <hj-select
              :items="questionNumber_big_exist"
              size="mini"
              :value="existNumber"
              @change="hanldeSelectexistBig" />
          <span>大题后</span>
        </div>
        <el-checkbox :class="['Postpone',{'Fade':!dataTopic.InsertTitle}]" v-model="dataTopic.Postpone">大题号自动顺延</el-checkbox>
        <div class="Insert_Mask" v-show="!dataTopic.InsertTitle"></div>
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
import questionGrous from '../Subassembly/answer'
import subtopicLevelItem from '../Subassembly/answer/firstlevelItem'
import { mapState, mapMutations,mapGetters } from 'vuex'
export default {
  components: {
    questionGrous,
    subtopicLevelItem
  },
  data () {
    return {
      dataTopic: {},
      closeData: {},
      editQuestionId: '',
      openedFrame: false,
      errorVal: '',
      existNumber: null,
      orders:0,
      previous:null,
      questionData: {
        number: 0,
        topicName: '解答题',
        rows: 6,
        startQuestion: 1,
        HorizontalLine: false, // 横行
        ShowScore: true, // 显示分数
        InsertTitle: false,
        Postpone: false,
        group: [{
          start: this.subTopic_number,
          end: null,
          score: 1,
          space: 1,
          id: 'answerTopic',
          childGroup: [],
        },]
      },
      options:[],
      initScore:1, // 删除后初始分数
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'subTopic_number',
      'subTopic_number_determine',
    ]),

    ...mapState('pageContent', [
      'pageHeight',
      'page_size',
      'questionOrder',
      'pageData',
      'pageLayout',
    ]),

    ...mapState('answerQuestion', ['answerQuestionArr',]),

    ...mapGetters('pageContent', ['questionNumber_big_exist','question_order']),

    questionNumber_big(){
      return this.questionNumber_big_exist.length
    },

    title(){
      return !this.editQuestionId ? '新增解答题': '编辑解答题'
    },

    childGroups () {
      return this.dataTopic.group.map(item => item.childGroup).flat()
    },

    errorMessage () {
      return this.errorVal != '' ? true : false
    },

    RefactorData () {

      function recursion(obj, arr = []){
        if(obj.childGroup && obj.childGroup.length) {
          return obj.childGroup.reduce((acc, item) => {
            return recursion(item, acc)
          }, arr)
        }
        arr.push(obj)
        return arr
      }

      return recursion(this.dataTopic.group[0])
    },

    scoreTotal () {
      return this.RefactorData.map(item => item.score).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },

    subTopicGroup(){
      //确定信息
      let Arr = []
      let objId = `answer_${+new Date()}`
      let rectHeight = this.dataTopic.rows * 35 + 12 + 20 // 小题初始高度
      this.RefactorData.forEach((item, index) => {
        let obj = {
          heightTitle: index == 0 ? 32 : 0,
          height: index == 0 ? rectHeight + 32 : rectHeight,
          MarginHeight: 12,
          ...item,
          content: {
            ...this.dataTopic,
            pageLayout:this.pageLayout,
          },
          first: index === 0 ? true : false,
          questionType: 'answerQuestion',
          objId: objId,
          row:this.dataTopic.rows,
          rowHeight:35,
          scoreTotal:this.scoreTotal,
          previousOrder:this.questionOrder - 1, // 解答题插入前的序列号
          index:index,
        }
        Arr.push(obj)
      })
      return Arr
    },

    isdisabledFn(){
      return this.childGroups.length  && !this.errorMessage ? false:true
    },
  },

  mounted () {
    this.closeData = JSON.parse(JSON.stringify(this.questionData))
    this.subTopic_number_calculate()
  },

  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.dataTopic = {
          ...this.questionData
        }
        if (this.editQuestionId == '') {
          this.$nextTick(() => {
            this.dataTopic = {
              ...this.dataTopic,
              number: this.questionNumber_big
            }
          })
          this.existNumber = this.questionNumber_big_exist.length ? this.questionNumber_big_exist[0].value : null
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      }
    },

    childGroups:{
      immediate: true,
      handler(){
        this.subTopic_already_reset()
        if(this.childGroups.length){
          this.subTopic_already_add(this.childGroups)
        }else{
          this.subTopic_already_add(this.subTopic_number_determine)
        }
        this.subTopic_number_calculate()
      }
    }
  },
  methods: {
    ...mapMutations('pageContent', [
      'pageData_add',
      'pageData_edit',
      'pageData_insert',
      'questionOrder_add',
      'questionOrder_subtract',
      'pageData_simple_insert',
      'nonAnswer_insert',
      'pageData_nonA_clean'
    ]),

    ...mapMutations('questionType', [
      'subTopic_number_calculate_already',
      'subTopic_number_calculate',
      'subTopic_calculate_determine',
      'subTopic_already_reset',
      'subTopic_already_add',
      'subTopic_determine_pid_clean',
    ]),

    ...mapMutations('answerQuestion', ['set_answerQuestionArr']),

    opened () {
      this.questionData = JSON.parse(JSON.stringify({
        ...this.questionData,
        start:this.subTopic_number
      }))

      // 开打弹框
      this.questionData.number = this.questionNumber_big
      this.dataTopic.number = this.questionNumber_big

      this.openedFrame = true
      this.subTopic_already_reset() // 清空
      this.subTopic_already_add(this.subTopic_number_determine)
      this.subTopic_number_calculate()
    },

    openedEdit (obj) {
      //编辑弹框
      this.editQuestionId = obj.objId
      this.orders = obj.order
      this.previous = obj.previousOrder
      this.openedFrame = true
      this.questionData = JSON.parse(JSON.stringify(obj.content))
      this.subTopic_already_reset() // 清空
      this.subTopic_already_add(this.subTopic_number_determine)
      this.subTopic_number_calculate()
    },

    closeFrame () {
      // 关闭弹窗
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.subTopic_already_reset() // 清空临时小题group
      this.errorVal = ''
    },

    preCreateQuestion () {
      const { InsertTitle, Postpone} = this.dataTopic
      if (this.editQuestionId == '') {
        // 新增
        if(InsertTitle && this.questionNumber_big_exist.length > 0){
          let select = this.questionNumber_big_exist[this.existNumber]
          let i = this.question_order
          this.subTopicGroup.forEach((obj) => {
            i += 1
            let data = {
              obj: {
                ...obj,
                order: i,
                },
                bigId: select.id,
                SelfOrder: Postpone,
            }
            this.pageData_insert(data)
          })

        } else {
          this.subTopicGroup.forEach(obj => {
            this.pageData_add(obj)
          })
        }

      } else {
          let previous = this.previous
          let previousTig = this.previous
          let pageObj = this.pageData[previous + 1]
          this.pageData_nonA_clean(this.editQuestionId) // 清空非答题

          this.subTopicGroup.forEach((question,index) => {
            previous += 1
            let data = {
              obj: {
                ...question,
                order: previous,
                objId:this.editQuestionId,
                previousOrder:  pageObj && pageObj.questionType ==="NonRresponseArea" ? pageObj.order :previousTig,
              },
              num: previous,
            }

            this.pageData_simple_insert(data)

            if(index == this.subTopicGroup.length - 1){
              this.$nextTick(()=>{
                this.nonAnswer_insert()
              })
            }
          })
        this.subTopic_determine_pid_clean(this.childGroups[0].pid)
      }

      //------------------------------------

      this.openedFrame = false // 关闭弹窗
      this.subTopic_already_add(this.childGroups)
      this.subTopic_calculate_determine(this.childGroups)
      this.subTopic_number_calculate()
      // 清空弹框数据
      this.questionData = JSON.parse(JSON.stringify(this.closeData))
    },
    hanldeStatus (val) {
      this.errorVal = val
    },
    addAnswerTopicGroup (obj) {
      // 新增题组数据
      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.id)
      if (index > -1) {
        group.splice(index, 1, obj)
      }

    },

    preEditLastAnswerItem(obj, isDel = false) {

      let group = this.dataTopic.group
      let index = group.findIndex(item => item.id == obj.fid)
      if (index > -1) {
        let items = group[index]
        let itemsIndex = items.childGroup.findIndex(item => item.id == obj.pid)

        if (itemsIndex > -1) {

          let subItems = items.childGroup[itemsIndex] // 当前小题
          let subItemIndex = subItems.childGroup.findIndex(item => item.id == obj.id)

          if (subItemIndex > -1) {
            if (isDel) {
              subItems.childGroup.splice(subItemIndex, 1)
            } else {
              subItems.childGroup.splice(subItemIndex, 1, obj)

              let lastItem = subItems.childGroup[index]
              // 更改分值
              lastItem.score = this.countTheScore(lastItem)
              this.$nextTick(() => {
                subItems.score = this.countTheScore(subItems)
              })
            }
            this.subTopic_number_calculate_already([subItems]) // 更新临时数组

          }
        }
      }
    },


    preEditSubAnswerItem(obj, isDel = false){
      // yi级菜单下的小题
      let temp = JSON.parse(JSON.stringify(this.dataTopic))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.pid)

      if(firstLevel.index > -1){
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)

          if(twoLevel.index > -1){

              if(!isDel){
                firstLevel.data.childGroup.splice(twoLevel.index, 1, obj)
              }else{
                if(firstLevel.data.childGroup.length > 1){
                  firstLevel.data.childGroup.splice(twoLevel.index, 1)
                }else{
                  group.splice(firstLevel.index, 1,{
                    ...group[firstLevel.index],
                    end:null,
                    childGroup:[]
                  })
                }
              }
              this.questionData = JSON.parse(JSON.stringify(temp))
          }
      }
    },

    preEditTwoSubtopic (obj, isDel = false) {
      // 二级菜单下的小题
      let temp = JSON.parse(JSON.stringify(this.dataTopic))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.fid)

      if(firstLevel.index > -1){
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.pid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.id)

          if(threeLevel.index > -1){

              if(!isDel){
                twoLevel.data.childGroup.splice(threeLevel.index, 1, obj)

              }else{

                if(twoLevel.data.childGroup.length > 1){
                  twoLevel.data.childGroup.splice(threeLevel.index, 1)
                }else{
                  firstLevel.data.childGroup.splice(firstLevel.index, 1,{
                    ...firstLevel.data.childGroup[firstLevel.index],
                    score:this.initScore,
                    childGroup:[]
                  })
                }
              }
              this.questionData = JSON.parse(JSON.stringify(temp))
            }
        }
      }
    },

    preEditPointsAnswerGroup (obj, isDel = false) {
      // 三级菜单下的小题
      let temp = JSON.parse(JSON.stringify(this.dataTopic))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.sid)

      if(firstLevel.index > -1){
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.fid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.pid)

          if(threeLevel.index > -1){
            let fourLevel = this.findIndex(threeLevel.data.childGroup,obj.id)

            if(fourLevel.index > -1){

              if(!isDel){
                threeLevel.data.childGroup.splice(fourLevel.index, 1, obj)

              }else{

                if(threeLevel.data.childGroup.length > 1){
                  threeLevel.data.childGroup.splice(fourLevel.index, 1)
                }else{
                  twoLevel.data.childGroup.splice(twoLevel.index, 1,{
                    ...twoLevel.data.childGroup[twoLevel.index],
                    score:this.initScore,
                    childGroup:[]
                  })
                }
              }
              this.questionData = JSON.parse(JSON.stringify(temp))
            }


            }
        }
      }
    },

    preEditLastSubtopic(subtopic){
      let {del,obj} = subtopic
      // 最后一级item 分数编辑及删除
      let temp = JSON.parse(JSON.stringify(this.dataTopic))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.spId)

      if(firstLevel.index > -1){
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.sid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.fid)

          if(threeLevel.index > -1){
            let fourLevel = this.findIndex(threeLevel.data.childGroup,obj.pid)

            if(fourLevel.index > -1){

              let fivesLevel = this.findIndex(fourLevel.data.childGroup,obj.id)

              if(fivesLevel.index > -1){

                if(!del){
                  fourLevel.data.childGroup.splice(fivesLevel.index, 1, obj)

                }else{

                  if(fourLevel.data.childGroup.length){
                    fourLevel.data.childGroup.splice(fivesLevel.index, 1)
                  }else{
                    threeLevel.data.childGroup.splice(threeLevel.index, 1,{
                      ...threeLevel.data.childGroup[threeLevel.index],
                      score:this.initScore,
                      childGroup:[]
                    })
                  }
                }
                this.questionData = JSON.parse(JSON.stringify(temp))
              }


            }

          }
        }
      }
    },

    findIndex(group,id){
      let index = group.findIndex(item => item.id == id)
      return {index:index,data:group[index]}
    },

    countTheScore (obj) {
      let sum = 0
      obj.childGroup.forEach(item => {
        sum += item.score
      })
      return sum
    },
    hanldeSelect (e) {
      // 选择答题号
      this.questionData.number = e
      this.dataTopic.number = e
    },
    hanldeSelectexistBig (e) {
      this.existNumber = e
    },
  },
}
</script>

<style lang="less" >
.answer_box {
  .select-item:last-child {
    margin-top: 0;
  }
  .big-item .el-input--mini {
    width: 68px;
  }
  .big-item input {
    width: 68px;
    margin-top: 10px;
    text-align: center;
  }
  .condition_box {
    margin-top: 15px;
  }
  .big-item {
    span {
      top: 15px;
    }
  }
  .p-5 {
    padding: 0 5px;
  }
  .answer_rows {
    display: inline-block;
    width: 140px;
    position: absolute;
    margin-top: -3px;
    margin-left: 40px;
    .el-input,
    input {
      width: 48px;
    }
  }
  .error-message {
    margin-top: 10px;
    text-indent: 0;
  }
}
</style>


