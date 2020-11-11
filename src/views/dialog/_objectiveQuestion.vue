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
            :value="editingData.number"
            @change="changeQuestionBig"
          ></hj-select>
        </el-col>
        <el-col :span="12" class="select-item">
          <div class="label">题目:</div>
          <el-input
            v-model="editingData.topicName"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="24" class="select-item">
          <div class="label">每组题数:</div>
          <el-input
            v-model.number="editingData.rows"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
      </el-row>
      <!-- 题型编辑区 -->
      <tab-pane-box
        :edit-id="editQuestionId"
        :question-group="editingData.group"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
        @pre-edit-subtopic="preEditSubtopic"
        @add-group-question="addGroupQuestion"
        @del-subtopic-group="delSubtopicGroup"
      />
      <!-- 题型编辑区 -->
      <div class="condition_box Insert_box" v-show="editQuestionId == ''">
        <el-checkbox v-model="editingData.InsertTitle"
          >插入添加题目</el-checkbox
        >
        <div
          :class="[
            'questionNumber_big_exist_style',
            { Fade: !editingData.InsertTitle },
          ]"
        >
          <span>插入到第</span>
          <hj-select
            :items="questionNumber_big_exist"
            size="mini"
            :value="existNumber"
            @change="changeSelectexistBig"
          />
          <span>大题后</span>
        </div>
        <el-checkbox
          :class="['Postpone', { Fade: !editingData.InsertTitle }]"
          v-model="editingData.Postpone"
          >大题号自动顺延</el-checkbox
        >
        <div class="Insert_Mask" v-show="!editingData.InsertTitle"></div>
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
  import {mapGetters,mapState,mapMutations } from 'vuex'
  import tabPaneBox from '../Subassembly/objective'
  export default {
    components: {
      tabPaneBox,
    },
    data() {
      return {
        openedFrame: false,
        existNumber: null,
        preEditData:{
          number: 1,
          topicName: '选择题',
          rows: 5,
          startQuestion: 1,
          InsertTitle: false,
          Postpone: false,
          group:{
            singleChoice:[{
              start: 1,
              end: null,
              score: null,
              select: 4,
              id: 'singleBox0',
              childGroup: [],
            },],
            checkChoice:[
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
            judgmentChoice:[
              {
                start: 1,
                end: null,
                score: null,
                select: 2,
                id: 'judgment0',
                childGroup: [],
              },
            ],
          }
        },
        editingData:{},
        InitialData:{},
        editQuestionId: '',
        orders:0,
        errorVal: '',
        ContentHeight: 0, // 内容高度
        //标题附加高度
        heightTitle:23,
        MarginHeight:10,
        rowHeight:21,
        titleH:32,

      }
    },
    computed: {
      ...mapGetters('pageContent', ['questionNumber_big_exist',
      'question_order','options',]),

      ...mapState('questionType',['subTopic_number',
      'subTopic_number_already',
      'subTopic_number_determine',]),

      ...mapState('page',['pageData']),
      ...mapGetters('page',['page_width']),

      questionNumber_big(){
        return this.questionNumber_big_exist.length
      },

      title(){
        return  !this.editQuestionId ? '新增客观题' : '编辑客观题'
      },

      isdisabledFn(){
        return this.questionGroup.length > 0 && !this.errorMessage ? false :true
      },

      errorMessage() {
        return this.errorVal != '' ? true : false
      },

      questionGroup(){
        const {singleChoice,checkChoice,judgmentChoice} = this.editingData.group
        return [
          ...singleChoice.map(group => group.childGroup).flat(),
          ...checkChoice.map(group => group.childGroup).flat(),
          ...judgmentChoice.map(group => group.childGroup).flat(),
        ]
      },

      rowGroup(){
        // 每行所占小题
        let result = []
        let {rows} = this.editingData
        for (var i = 0; i < this.questionGroup.length; i += rows) {
          result.push(this.questionGroup.slice(i, i + rows))
        }
        return result
      },

      // maxWidth(){
      //   // 最大宽度
      //   const maxWidthArr = []
      //   this.rowGroup.filter((item) => {
      //     let widthS = item.map((row) => row.width)
      //     maxWidthArr.push(Math.max.apply(null, widthS))
      //   })

      //   let sum = 0,max = this.page_width
      //   let arr = [],numberArr = []
      //   maxWidthArr.forEach(num => {
      //     sum += num
      //     if(sum <= max){
      //       arr.push(num)
      //     }else{
      //       numberArr.push(arr)
      //       sum = num
      //       arr = [num]
      //     }
      //   });
      //   if(arr.length > 0){
      //     numberArr.push(arr)
      //   }
      //   return numberArr.map(num => num.length)
      // },

      // contentHeight(){
      //   // 计算题型内容所占高度
      //   // 计算宽度所占数组长度
      //   let heights = this.rowGroup.map((item) => item.length * 22)
      //   // 根据宽度数组 和 高度数组合成高度二维数组
      //   let twoDimensional = []
      //   let num = 0
      //   for (let i = 0; i < this.maxWidth.length; i++) {
      //     num += this.maxWidth[i]
      //     twoDimensional.push(heights.slice(num - this.maxWidth[i], num))
      //   }
      //   let heightList = twoDimensional.map((item) => {
      //     return Math.max.apply(null, item)
      //   })
      //   if (heightList.length > 0) {
      //     return (
      //       heightList.reduce(
      //         (accumulator, currentValue) => accumulator + currentValue
      //       ) +
      //       heightList.length * 10
      //     )
      //   } else {
      //     return 0
      //   }
      // },

      // subTopicGroup(){
      //   let RowArr = []
      //   let columnArr = []
      //   let widthSum = 0

      //   this.rowGroup.forEach(item => {
      //     let maxWidth = Math.max.apply(Math, item.map(function(o) {return o.width}))
      //     widthSum += maxWidth

      //     if(widthSum < this.page_width){
      //       columnArr.push(item)
      //     }else{
      //       RowArr.push(columnArr)
      //       widthSum = maxWidth
      //       columnArr = []
      //       columnArr.push(item)
      //     }

      //   })

      //   if(columnArr.length > 0){
      //     RowArr.push(columnArr)
      //   }
      //   return RowArr
      // },

      scoreTotal(){
        return this.questionGroup.map(topic => topic.score)
                                  .reduce((acc,cur) => acc + cur)
      },

    },

    watch: {
      preEditData: {
        immediate: true,
        handler() {
          //变量更改
          let Increase = {}
          if(!this.editQuestionId){
            Increase = {
              number: this.questionNumber_big,
            }
            this.existNumber =
            this.questionNumber_big_exist.length > 0
              ? this.questionNumber_big_exist[0].value
              : null
          }
          this.editingData = {
            ...this.preEditData,
            ...Increase
          }

        }
      },

      questionGroup:{
        immediate: true,
        handler(){
          this.subTopic_already_reset()
          if(this.questionGroup.length > 0){
            this.subTopic_already_add(this.questionGroup)
          }else{
            this.subTopic_already_add(this.subTopic_number_determine)
          }
          this.subTopic_number_calculate()
        }
      }
    },

    mounted() {
      this.InitialData = JSON.parse(JSON.stringify(this.preEditData))
    },

    methods: {
      ...mapMutations('questionType', [
        'subTopic_number_calculate',
        'subTopic_already_add', // 小题数组
        'subTopic_already_del', // 删除题组-小题
        'subTopic_calculate_determine', // 储存确定题型
        'subTopic_already_reset', // 清空
        'subTopic_determine_pid_clean',
      ]),

      ...mapMutations('page', [
        'pageData_add',
        'pageData_edit',
        'pageData_insert',
      ]),

      opened() {
        this.preEditData = JSON.parse(
          JSON.stringify({ ...this.preEditData, number: this.questionNumber_big })
        )

        this.openedFrame = true
        this.subTopic_already_reset() // 清空
        this.subTopic_already_add(this.subTopic_number_determine)
        this.subTopic_number_calculate()
      },

      openedEdit(id){
        let current = this.pageData.filter((item) => item.id === id)
        this.preEditData = JSON.parse(JSON.stringify(current[0].content))
        this.editQuestionId = id
        this.orders = current.order
        this.openedFrame = true
        this.subTopic_number_calculate()
      },

      closeFrame() {
        // 取消弹框
        this.errorVal = ''
        this.preEditData = this.InitialData
        this.openedFrame = false
        this.subTopic_number_calculate()
      },

      change(id, num){
        // 改变row数量
        let current = this.pageData.filter((item) => item.id === id)
        this.preEditData = JSON.parse(JSON.stringify(current[0].content))
        this.editQuestionId = id

        let rows = this.preEditData.rows
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
        this.preEditData.rows = rows
        this.editingData.rows = rows
        this.$nextTick(()=>{
          this.preCreateQuestion()
        })
      },

      changeQuestionBig(num){
        this.preEditData = {
          ...this.preEditData,
          number:num
        }
      },

      changeSelectexistBig(e){
        this.existNumber = e
      },

      preCreateQuestion(){
        // 保存题型
        const { rows,InsertTitle,Postpone,} = this.editingData

        let questionId = `objective_${+new Date()}`
        //this.subTopicGroup
        var questionObj = {
            heightTitle: this.heightTitle,
            MarginHeight: this.MarginHeight,
            rowHeight: this.rowHeight * rows,
            id: questionId,
           // height: this.contentHeight + this.titleH, // 32标题高度
            height:{
              rowGroup:this.rowGroup,
              titleH:this.titleH
            },
            questionType: 'ObjectiveQuestion',
            content: {
              ...this.editingData,
              scoreTotal:this.scoreTotal,
              pageLayout:this.pageLayout
            },
            order: this.question_order,
            showData:[],
            first: true,
          }
        if (this.editQuestionId == '') {
          if (InsertTitle && this.questionNumber_big_exist.length > 0){
              let select = this.questionNumber_big_exist[this.existNumber]
              let data = {
                obj: {
                  ...questionObj,
                  order: this.question_order,
                },
                bigId: select.id,
                SelfOrder: Postpone || false,
              }
            this.pageData_insert(data)
          }else{
            this.pageData_add(questionObj)
          }
        }else{
          this.subTopic_determine_pid_clean(this.questionGroup[0].pid)
          questionObj.id = this.editQuestionId
          this.pageData_edit({...questionObj,order:this.orders})
        }
        // 小题数组追加数据
        this.subTopic_calculate_determine(this.questionGroup)
        this.subTopic_already_add(this.questionGroup)

        // guan bi - 清楚数据
        this.preEditData = JSON.parse(JSON.stringify(this.InitialData))

        //------------------------------------
        this.openedFrame = false // 关闭弹窗
      },

      groupVerifyStatus(verify){
        this.errorVal = verify.str
      },

      updateGroupSubTopic(groupObj){
        // 编辑题组
        let obj = this.editingData //JSON.parse(JSON.stringify(this.editingData))
        let {type,data} = groupObj
        let {group} = obj

        let curGroup = group[type]
        let index = curGroup.findIndex(group => group.id == data.id)


        if(index > -1){
          curGroup.splice(index,1,data)

          // this.preEditData = JSON.parse(JSON.stringify(obj))
        }
      },

      preEditSubtopic(subtopic){
        //编辑小题号
        let obj = this.editingData //JSON.parse(JSON.stringify(this.preEditData))
        let {type,data} = subtopic

        let curGroup = obj.group[type]
        let index = curGroup.findIndex(group => group.id == data.pid)

        if(index > -1){
          let childrenGroup = curGroup[index].childGroup
          let cIndex = childrenGroup.findIndex(topic => topic.id == data.id)

          if(cIndex > -1){
            childrenGroup.splice(cIndex,1,data)
            // this.$nextTick(()=>{
            //   this.preEditData = JSON.parse(JSON.stringify(obj))
            // })
          }
        }
      },

      addGroupQuestion(groupSubTopic){
        //添加分段小题组
        let {type,groupTopic} = groupSubTopic
        let obj = JSON.parse(JSON.stringify(this.preEditData))

        obj.group[type].push(groupTopic)

        this.$nextTick(()=>{
          this.preEditData = JSON.parse(JSON.stringify(obj))
        })
      },

      delSubtopicGroup(groupSubTopic){
        // 删除题组
        let {type,subtopic} = groupSubTopic
        let obj = JSON.parse(JSON.stringify(this.preEditData))
        let curGroup = obj.group[type]

        let index = curGroup.findIndex(group => group.id == subtopic.id)

        if(index > -1){
          curGroup.splice(index,1)
          this.$nextTick(()=>{
            this.preEditData = JSON.parse(JSON.stringify(obj))
          })
          this.errorVal = ''
        }

      }
    },
  }
</script>

