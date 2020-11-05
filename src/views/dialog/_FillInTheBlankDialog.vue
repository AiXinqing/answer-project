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
          <el-input
            v-model="objectiveData.topicName"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每行展示</div>
          <el-input
            v-model.number="objectiveData.rows"
            size="mini"
            placeholder="请输入内容"
          />
          <div class="label m-5" style="padding-left:5px">空</div>
        </el-col>
      </el-row>

      <space-question
        :group-data="objectiveData.group"
        :edit-id="editQuestionId"
        @change-status="changeStatus"
        @pre-edit-question-group="preEditQuestionGroup"
        @add-subTopic-collection="addSubTopicCollection"
        @change-level="changeLevel"
        @change-firstlevel-space="changeFirstlevelSpace"
        @change-twoLevel-topic="changeTwoLevelTopic"
        @del-question-group="delQuestionGroup"
        @add-subTopic-group="addSubTopicGroup"
        @del-subtopic-firstlevel="delSubTopicFirstlevel"
        @pre-edit-last-score="preEditLastScore"
        @del-two-level-subtopic="delTwoLevelSubtopic"
      />
      <div class="condition_box Insert_box" v-show="editQuestionId == ''">
        <el-checkbox v-model="objectiveData.InsertTitle"
          >插入添加题目</el-checkbox
        >
        <div
          :class="[
            'questionNumber_big_exist_style',
            { Fade: !objectiveData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="questionNumber_big_exist"
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
// import spaceQuestion from '../questionContent/Precautions/fillInTheBlank'
import spaceQuestion from '../Subassembly/fillInTheBlank'
import { mapState, mapMutations,mapGetters } from 'vuex'
export default {
  components: {
    spaceQuestion,
  },
  data() {
    return {
      openedFrame: false,
      existNumber: null,
      spaceTopic: {
        number: 0,
        topicName: '填空题',
        rows: 4,
        startQuestion: 1,
        InsertTitle: false,
        Postpone: false,
        group: [
          {
            start: 1,
            end: null,
            score: null,
            space: 1,
            id: 'FillInTheGroup',
            childGroup: [],
          },
        ],
      },
      closeData: {},
      errorVal: '',
      objectiveData: {},
      editQuestionId: '',
      orders:0,
      ContentHeight: 0, // 内容高度
      options:[],
    }
  },
  computed: {
    ...mapState('questionType', [
      'questionNumber',
      'subTopic_number',
      'subTopic_number_determine',
    ]),
    ...mapState('pageContent', [
      'pageData',
      'pageLayout',
      'questionOrder',
    ]),

    ...mapGetters('pageContent', ['questionNumber_big_exist']),

    questionNumber_big(){
      return this.questionNumber_big_exist.length
    },

    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 480
        : 745
    },

    errorMessage() {
      return this.errorVal != '' ? true : false
    },

    topicGroupData() {
      // let {group} = this.objectiveData
      // let array = []

      // group.map((item) => {
      //   array.push(...item.childGroup)
      // })

      // if (array.length > 0) {
      //   let temporaryArr = []
      //   let datas = []
      //   array.forEach((ele) => {
      //     let { childGroup } = ele
      //     if (childGroup && childGroup.length > 0) {
      //       childGroup.forEach((row, index) => {
      //         for (let i = 1; i <= row.space; i++) {
      //           if (temporaryArr.length + 1 > rows) {
      //             datas.push(temporaryArr)
      //             temporaryArr = []
      //             if (i == 1) {
      //               temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
      //             } else {
      //               temporaryArr.push(row)
      //             }
      //           } else {
      //             if (i == 1) {
      //               temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
      //             } else {
      //               temporaryArr.push(row)
      //             }
      //           }
      //         }
      //       })
      //     } else {
      //       for (let i = 1; i <= ele.space; i++) {
      //         if (temporaryArr.length + 1 > rows) {
      //           datas.push(temporaryArr)
      //           temporaryArr = []
      //           if (i == 1) {
      //             temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
      //           } else {
      //             temporaryArr.push(ele)
      //           }
      //         } else {
      //           if (i == 1) {
      //             temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
      //           } else {
      //             temporaryArr.push(ele)
      //           }
      //         }
      //       }
      //     }
      //   })
      //   if (temporaryArr.length > 0) {
      //     datas.push(temporaryArr)
      //   }

      //   return datas
      // } else {
      //   return []
      // }
      function recursion(obj, arr = []){
        if(obj.childGroup && obj.childGroup.length) {
          return obj.childGroup.reduce((acc, item) => {
            return recursion(item, acc)
          }, arr)
        }
        arr.push(obj)
        return arr
      }

      return recursion(this.objectiveData.group[0])
    },

    childGroups(){
      return this.objectiveData.group.map(item => item.childGroup).flat()
    },

    isdisabledFn(){
      return  this.childGroups.length > 0 && !this.errorMessage ? false:true
    },

    title(){
      return !this.editQuestionId ? '新增填空题' : '编辑填空题'
    }
  },

  watch: {
    spaceTopic: {
      immediate: true,
      handler() {
        this.objectiveData = {
          ...this.spaceTopic,
        }

        if (this.editQuestionId == '') {
          this.$nextTick(() => {
            this.objectiveData.number = this.questionNumber_big
          })
          this.existNumber =
            this.questionNumber_big_exist.length > 0
              ? this.questionNumber_big_exist[0].value
              : null
        }
      },
    },

    questionNumber: {
      immediate: true,
      handler() {
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      }
    },

    childGroups:{
      immediate: true,
      handler(){
        this.subTopic_already_reset()
        if(this.childGroups.length > 0){
          this.subTopic_already_add(this.childGroups)
        }else{
          this.subTopic_already_add(this.subTopic_number_determine)
        }
        this.subTopic_number_calculate()
      }
    }
  },

  mounted() {
    this.closeData = JSON.parse(JSON.stringify(this.spaceTopic))
    this.subTopic_number_calculate()
  },

  methods: {
    ...mapMutations('questionType', [
      'subTopic_number_calculate',
      'subTopic_already_add', // 小题数组
      'subTopic_already_del', // 删除题组-小题
      'subTopic_calculate_determine', // 储存确定题型
      'subTopic_already_reset', // 清空
      'subTopic_already_pid_clean',
      'subTopic_determine_pid_clean',
    ]),

    ...mapMutations('pageContent', [
      'pageData_add',
      'pageData_edit',
      'pageData_insert',
      'questionOrder_add',
    ]),

    closeFrame() {
      // 关闭弹框
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
      this.openedFrame = false
      this.errorVal=''
      //--------------
      this.subTopic_already_reset() // 清空临时小题group
      this.subTopic_already_add(this.subTopic_number_determine)
    },

    opened() {
      this.spaceTopic = JSON.parse(
        JSON.stringify({ ...this.spaceTopic, number: this.questionNumber_big })
      )

      this.openedFrame = true
      //-------------------打开
      this.subTopic_already_reset() // 清空
      this.subTopic_already_add(this.subTopic_number_determine)
      this.subTopic_number_calculate()
    },

    openedEdit(id) {
      let current = this.pageData.filter((item) => item.id === id)

      this.spaceTopic = JSON.parse(JSON.stringify(current[0].content))
      this.editQuestionId = id
      this.orders = current.order
      this.openedFrame = true
      this.subTopic_number_calculate()
    },

    preCreateQuestion() {
      // 数据编辑完成添加至全局数组中---------------
      // 计算高度
      let height = this.topicGroupData.length * 45 + 17 + 32
      // 此题总分计算
      const {InsertTitle, Postpone } = this.objectiveData

      let scoreTotal = 0

      this.childGroups.map((item) => {
        scoreTotal += item.sum
      })
      let objId = `FillInTheBlank_${+new Date()}`
      // 此题总分计算
      let obj = {
        heightTitle: 32,
        MarginHeight: 17,
        id: objId,
        height: height, // 32标题高度
        rowHeight: 45,
        questionType: 'FillInTheBlank',
        content: {
          ...this.objectiveData,
          scoreTotal: scoreTotal,
          pageLayout:this.pageLayout
        },
        showData: this.topicGroupData,
        first: true,
        // 此题总分
      }

      // 小题数组追加至确定题型
      this.subTopic_number_calculate()

      if (this.editQuestionId == '') {
        if (InsertTitle && this.questionNumber_big_exist.length > 0) {
          let select = this.questionNumber_big_exist[this.existNumber]

          let data = {
              obj: {
                ...obj,
                order: this.question_order,
              },
              bigId: select.id,
              SelfOrder: Postpone,
          }
          this.pageData_insert(data)
        } else {
          this.pageData_add(obj)
        }
        this.questionOrder_add()

      } else {
        this.subTopic_determine_pid_clean(this.childGroups[0].pid)
        obj.id = this.editQuestionId
        this.pageData_edit({...obj,order:this.orders})
      }
      this.subTopic_already_add(this.childGroups)
      this.subTopic_calculate_determine(this.childGroups)
      //------------------------------------
      this.openedFrame = false // 关闭弹窗

      //------------------------
      this.spaceTopic = JSON.parse(JSON.stringify(this.closeData))
    },

    hanldeSelect(e) {
      // 选择答题号
      this.spaceTopic.number = e
      this.objectiveData.number = e
    },
    hanldeSelectexistBig(e) {
      this.existNumber = e
    },
    traverse() {},
    HeightCalculation() {
      // 计算题型内容所占高度
    },
    changeStatus(val) {
      this.errorVal = val
    },
    preEditQuestionGroup(obj) {

      //添加题组
      let {group} = this.spaceTopic
      const index = group.findIndex((item) => item.id === obj.id)
      if (index > -1) {
        group.splice(index, 1, obj) // 替换
        // 追曾小题号至数组
      }
    },
    delQuestionGroup(id) {
      //删除题组
      let {group} = this.spaceTopic
      const index = group.findIndex((item) => item.id === id)
      if (index > -1) {
        let itemTopic = group[index]
        // 更改题型状态值

        this.subTopic_already_del(itemTopic.childGroup) // 删除弹框内临时数组
        group.splice(index, 1) // 删除
        this.$nextTick(() => {
          this.subTopic_number_calculate()
        })
        this.errorVal = ''
      }
    },

    changeLevel(obj){
      // 改变层级

      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.pid)
      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)
        if(twoLevel.index > -1){
          twoLevel.data.level = true

          this.spaceTopic = JSON.parse(JSON.stringify(temp))
        }
      }
    },

    addSubTopicCollection(obj){
      // 添加小题

      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.pid)

      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)

        if(twoLevel.index > -1){

          firstLevel.data.childGroup.splice(twoLevel.index,1,obj)
          this.spaceTopic = JSON.parse(JSON.stringify(temp))
        }
      }
    },

    delSubTopicFirstlevel(obj){
      // 分段小题删除
      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp
      let {topic} = obj

      let firstLevel = this.findIndex(group,obj.pid)

      if(firstLevel.index > -1){
        let {start,end} = firstLevel.data
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)

        if(topic == start || topic == end){
          if(twoLevel.index > -1){
            if(firstLevel.data.childGroup.length > 1){
              firstLevel.data.childGroup.splice(twoLevel.index, 1)
              if(topic == start){
                firstLevel.data.start += 1
              }
              if(topic == end){
                firstLevel.data.end -= 1
              }
            }else{
              group.splice(firstLevel.index, 1)
            }
            this.spaceTopic = JSON.parse(JSON.stringify(temp))
          }
        }else{

          let {childGroup} = firstLevel.data

          let topics = twoLevel.data.topic

          let before = childGroup.slice(0,twoLevel.index) //前
                      .map(question => ({...question,end:topics - 1 }))
          let after = childGroup.slice(twoLevel.index + 1,childGroup.length) // 后
                      .map(question => ({...question,start:topics + 1 }))
          let curObj = firstLevel.data
          let index = firstLevel.index

          group.splice(firstLevel.index, 1)

          group.splice(index,0,{
            ...curObj,
            childGroup:this.childGroupFunc(before,`${curObj.id}_${index}`),
            end:before[0].end,
            id: `${curObj.id}_${index}`
          })
          group.splice(index + 1,0,{
            ...curObj,
            childGroup:this.childGroupFunc(after,`${curObj.id}_${index + 1}`),
            start:after[0].start,
            id: `${curObj.id}_${index + 1}`
          })
          this.spaceTopic = JSON.parse(JSON.stringify(temp))

        }

      }

    },

    childGroupFunc(obj,index){
      // 返回显示id
      return obj.map(question =>{
        return {
          ...question,
          childGroup:question.childGroup.map(subtopic => {
            return {
              ...subtopic,
              sid:index,
              childGroup:subtopic.childGroup.map(topic =>({...topic,lid:index}))
            }
          }),
          pid:index,
        }
      })
    },

    preEditLastScore(obj){
      //编辑最后一级分数
      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.sid)

      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.pid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.id)

          if(threeLevel.index > -1){
            twoLevel.data.childGroup.splice(threeLevel.index,1, obj)
            this.spaceTopic = JSON.parse(JSON.stringify(temp))
          }
        }
      }
    },

    delTwoLevelSubtopic(obj){

      // 删除二级小题
      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.sid)
      if(firstLevel.index > -1){

        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.pid)
        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.id)

          if(threeLevel.index > -1){

            twoLevel.data.childGroup.splice(threeLevel.index,1)
            if(!twoLevel.data.childGroup.length){
              twoLevel.data.space = 0
              twoLevel.data.level = false
            }
          }

        }
      }
      this.spaceTopic = JSON.parse(JSON.stringify(temp))

    },

    //--------------------------------------------
    //旧
    addSubTopicGroup(group) {
      //添加分段题组
      this.spaceTopic.group.push(group)
    },

    changeFirstlevelSpace(obj) {
      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp
      let firstLevel = this.findIndex(group,obj.pid)
      if(firstLevel.index > -1){
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)
        if(twoLevel.index >- 1){
          firstLevel.data.childGroup.splice(twoLevel.index, 1,obj)
          this.spaceTopic = JSON.parse(JSON.stringify(temp))
        }
      }
    },

    changeTwoLevelTopic(obj) {

      if(obj.space == 0){
        this.errorVal = '每题空格数必须为正整数'
        return false
      }else{
        this.errorVal = ''
      }
    // 一级修改空格数
      let temp = JSON.parse(JSON.stringify(this.objectiveData)) // spaceTopic
      let {group} = temp

      let {space} = obj

      let firstLevel = this.findIndex(group,obj.sid)

      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.pid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.id)


          if(threeLevel.index > -1){
            threeLevel.data.space = obj.space
            threeLevel.data.score = obj.score
            let subtopicGroup = this.spaceArray(obj,space,threeLevel.data.id,true)


            threeLevel.data.childGroup = subtopicGroup

            this.spaceTopic = JSON.parse(JSON.stringify(temp))
          }
        }
      }
    },


    findIndex(group,id){
      let index = group.findIndex(item => item.id == id)
      return {index:index,data:group[index]}
    },

    spaceArray(obj,space,Tpid,isT){
      // 生成小题数组
      let arr = []
      for (let i = 1; i < space + 1; i++) {
        arr.push({
          smallTopic: i,
          lid:!isT ? obj.pid : obj.sid,
          sid:!isT ? obj.id : obj.pid,
          score:obj.score,
          pid:!isT ? Tpid : obj.id,
          id:'last_'+ +new Date() + '_' + i
        })
      }
      return arr
    },

  },
}
</script>

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
