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
      <!-- <space-question
        :group-data="objectiveData.group"
        :edit-id="editQuestionId"
        @change-status="changeStatus"
        @pre-edit-question-group="preEditQuestionGroup"
        @del-question-group="delQuestionGroup"
        @add-subTopic-group="addSubTopicGroup"
        @add-subtopic-firstlevel="addSubtopicFirstlevel"
        @del-subtopic-firstlevel="delSubTopicFirstlevel"
        @change-firstlevel-space="changeFirstlevelSpace"

        @hanlde-last-topic-del="hanldeLastTopicDel"
        @pre-Edit-last-subtopic="preEditLastSubtopic"
      /> -->
      <space-question
        :group-data="objectiveData.group"
        :edit-id="editQuestionId"
        @change-status="changeStatus"
        @pre-edit-question-group="preEditQuestionGroup"
        @add-subTopic-collection="addSubTopicCollection"
        @change-level="changeLevel"
        @change-firstlevel-space="changeFirstlevelSpace"
        @del-question-group="delQuestionGroup"
        @add-subTopic-group="addSubTopicGroup"
        @del-subtopic-firstlevel="delSubTopicFirstlevel"
        @pre-edit-last-score="preEditLastScore"
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
            id: 'spaceTopic',
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
      let {rows,group} = this.objectiveData
      let array = []

      group.map((item) => {
        array.push(...item.childGroup)
      })

      if (array.length > 0) {
        let temporaryArr = []
        let datas = []
        array.forEach((ele) => {
          let { childGroup } = ele
          if (childGroup && childGroup.length > 0) {
            childGroup.forEach((row, index) => {
              for (let i = 1; i <= row.space; i++) {
                if (temporaryArr.length + 1 > rows) {
                  datas.push(temporaryArr)
                  temporaryArr = []
                  if (i == 1) {
                    temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
                  } else {
                    temporaryArr.push(row)
                  }
                } else {
                  if (i == 1) {
                    temporaryArr.push({ ...row, lgTopic: index + 1 }) // 小标题
                  } else {
                    temporaryArr.push(row)
                  }
                }
              }
            })
          } else {
            for (let i = 1; i <= ele.space; i++) {
              if (temporaryArr.length + 1 > rows) {
                datas.push(temporaryArr)
                temporaryArr = []
                if (i == 1) {
                  temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
                } else {
                  temporaryArr.push(ele)
                }
              } else {
                if (i == 1) {
                  temporaryArr.push({ ...ele, lgTopic: 0 }) // 小标题
                } else {
                  temporaryArr.push(ele)
                }
              }
            }
          }
        })
        if (temporaryArr.length > 0) {
          datas.push(temporaryArr)
        }

        return datas
      } else {
        return []
      }
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

    addSubTopicCollection(subtopicObj){
      let {obj,data} = subtopicObj
      let temp = JSON.parse(JSON.stringify(this.objectiveData))
      let {group} = temp

      let firstLevel = this.findIndex(group,obj.pid)

      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)
        if(twoLevel.index > -1){
          twoLevel.data.childGroup.push(data)
          this.spaceTopic = JSON.parse(JSON.stringify(temp))
        }
      }
    },

    delSubTopicFirstlevel(obj){
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

      let firstLevel = this.findIndex(group,obj.lid)
      console.log(firstLevel)
      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.sid)

        if(twoLevel.index > -1){
          let threeLevel = this.findIndex(twoLevel.data.childGroup,obj.pid)

          if(threeLevel.index > -1){
            let fourLevel = this.findIndex(threeLevel.data.childGroup,obj.id)
            console.log(fourLevel)
            if(fourLevel.index > -1){
              threeLevel.data.childGroup.splice(fourLevel.index,1, obj)
              this.spaceTopic = JSON.parse(JSON.stringify(temp))
            }

          }
        }
      }
    },

    //--------------------------------------------
    //旧
    addSubTopicGroup(group) {
      //添加分段题组
      this.spaceTopic.group.push(group)
    },
    SplitFunc(index, groupObj, arr) {
      // 删除小题拆分数组 sub
      let arrObj = JSON.parse(JSON.stringify(arr)) // 赋值操作

      let FirstHalf = arr.splice(0, index) // 前半份
      let SecondHalf = arrObj.splice(index + 1, groupObj.end) // 后半份

      let SplitCombine = []
      SplitCombine.push(this.SplitArrObject(FirstHalf, groupObj))
      SplitCombine.push(this.SplitArrObject(SecondHalf, groupObj))

      return SplitCombine.sort((a, b) => {
        return a.start - b.start
      })
    },
    SplitArrObject(arrParameter, groupObj) {
      // 生成数组对象
      if (arrParameter.length > 0) {
        let arr = []
        let ids = 'spaceTopic_' + +new Date()
        arrParameter.forEach((item) => {
          arr.push({
            id: 'topic_' + +new Date() + item,
            pid: ids,
            start: arrParameter[0],
            end: arrParameter[arrParameter.length - 1],
            score: groupObj.score,
            space: groupObj.space,
            sum: groupObj.score * groupObj.space,
            topic: item,
            subtopic: 1,
            childGroup: [],
          })
        })
        let obj = {
          start: arrParameter[0],
          end: arrParameter[arrParameter.length - 1],
          id: ids,
          score: 1,
          space: 1,
          childGroup: arr,
        }
        // 弹框临时小题数
        this.subTopic_already_add(arr)
        return obj
      } else {
        return {}
      }
    },
    addSubtopicFirstlevel(obj) {
      // 添加小题
      let {group} = this.spaceTopic
      const i = group.findIndex((item) => item.id === obj.pid)
      let questionArr = group[i]
      if (i > -1) {
        const index = questionArr.childGroup.findIndex(
          (row) => row.id === obj.id
        )
        let childItem = questionArr.childGroup[index]
        let changeItem = {}
        if (index > -1) {
          let subObj = {
            fid: childItem.pid,
            pid: childItem.id,
            id: 'subLastTopic_' + +new Date() + '_' + childItem.topic,
            space: 1,
            sum: 1,
            score: 1,
            topic: childItem.topic,
          }
          if (childItem.childGroup != undefined) {
            changeItem = {
              ...childItem,
              space: childItem.space + 1,
              sum: childItem.score * (childItem.space + 1),
              childGroup: [
                ...childItem.childGroup,
                { ...subObj, id: 'subLastTopic_' + +new Date() + '_' + childItem.topic },
              ],
            }
          } else {
            changeItem = {
              ...childItem,
              space: 1,
              sum: 1,
              childGroup: [{ ...subObj }],
            }
          }
          questionArr.childGroup.splice(index, 1, changeItem)
        }
      }
    },
    changeFirstlevelSpace(obj) {
    // 一级修改空格数
      let temp = JSON.parse(JSON.stringify(this.objectiveData)) // spaceTopic
      let {group} = temp

      let {space} = obj

      let firstLevel = this.findIndex(group,obj.pid)

      if (firstLevel.index > -1) {
        let twoLevel = this.findIndex(firstLevel.data.childGroup,obj.id)

        if(twoLevel.index > -1){

          twoLevel.data.space = obj.space
          twoLevel.data.score = obj.score

          let three = twoLevel.data.childGroup[0]
          let subtopicGroup = this.spaceArray(obj,space,three.id)

              three.childGroup = subtopicGroup
          this.spaceTopic = JSON.parse(JSON.stringify(temp))
        }
      }
    },

    hanldeLastTopicDel(obj) {
      // 删除小题last题组item
      let {group} = this.spaceTopic // 找到题组
      const i = group.findIndex((item) => item.id === obj.fid)
      let questionArr = group[i]
      if (i > -1) {
        // 找到小题
        const a = questionArr.childGroup.findIndex((row) => row.id === obj.pid)
        let topicGroupArr = questionArr.childGroup[a]
        if (a > -1) {
          // 找到小题题空

          const index = topicGroupArr.childGroup.findIndex(
            (row) => row.id === obj.id
          )
          let lastObj = topicGroupArr.childGroup[index]
          if (index > -1) {
            let subObj = {
              // 小题
              ...topicGroupArr,
              space: topicGroupArr.space - 1 < 0 ? 0 : topicGroupArr.space - 1,
              sum:
                topicGroupArr.sum - lastObj.space * lastObj.score < 0
                  ? 0
                  : topicGroupArr.sum - lastObj.space * lastObj.score,
            }
            questionArr.childGroup.splice(a, 1, subObj) // 替换被改变的小题

            topicGroupArr.childGroup.splice(index, 1)
          }
        }
      }
    },

    findIndex(group,id){
      let index = group.findIndex(item => item.id == id)
      return {index:index,data:group[index]}
    },

    spaceArray(obj,space,Tpid){
      // 生成小题数组
      let arr = []
      for (let i = 1; i < space + 1; i++) {
        arr.push({
          smallTopic: i,
          lid:obj.pid,
          sid:obj.id,
          score:obj.score,
          pid:Tpid,
          id:'last_'+ +new Date() + '_' + i
        })
      }
      return arr
    },

    preEditLastScores(obj) { // 改变分值

      // console.log(obj)
      // console.log(oldObj)
      // // last-sub分值改变
      // const {fid} = obj // ,pid,id
      // let {group} = this.spaceTopic
      // if(fid){

      //   let index = group.findIndex(group => group.id === obj.fid)
      //   if(index > -1){
      //     let subGroup = group[index].childGroup
      //     let subIndex = subGroup.findIndex(subObj => subObj.id === obj.pid)
      //     if(subIndex > -1){
      //       let lastGrop = subGroup[subIndex].childGroup
      //       let lastIndex = lastGrop.findIndex(lastObj => lastObj.id === obj.id)
      //       if(lastIndex > -1){
      //         lastGrop.splice(lastIndex, 1, {...obj,sum:obj.score,score:oldObj.score})
      //         // 计算小题下所有总分值
      //         const groupSum = lastGrop.reduce((acc,cur) => acc.sum + cur.sum)
      //         subGroup.splice(subIndex, 1, {...subGroup[index],sum:groupSum})

      //       }
      //     }
      //   }
      // }else{
      //   let index = group.findIndex(group => group.id === obj.pid)
      //   if(index > -1){
      //     let subGroup = group[index].childGroup
      //     let subIndex = subGroup.findIndex(subObj => subObj.id === obj.id)
      //     if(subIndex > -1) {
      //       let iss = subGroup[subIndex].sum - oldObj.score + obj.score
      //       subGroup.splice(subIndex, 1, {...obj,sum:iss})
      //     }
      //   }
      // }
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
