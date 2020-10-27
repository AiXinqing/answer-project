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
        :question-group="editingData.group"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
        @pre-edit-subtopic="preEditSubtopic"
        @add-group-question="addGroupQuestion"
        @del-subtopic-group="delSubtopicGroup"
      />
      <!-- 题型编辑区 -->
      <div class="condition_box Insert_box" v-show="editQuestionId == null">
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
            @change="hanldeSelectexistBig"
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
        editQuestionId: null,
        orders:0,
        errorVal: '',
        ContentHeight: 0, // 内容高度
      }
    },
    computed: {
      ...mapGetters('pageContent', ['questionNumber_big_exist','question_order','options']),

      ...mapState('questionType',['subTopic_number','subTopic_number_already']),

      questionNumber_big(){
        return this.questionNumber_big_exist.length
      },
      name() {
        return this.data
      },
      title(){
        return  !this.editQuestionId ? '新增客观题' : '编辑客观题'
      },
      questionGroup(){
        const {singleChoice,checkChoice,judgmentChoice} = this.editingData.group
        return [
          ...singleChoice.map(group => group.childGroup).flat(),
          ...checkChoice.map(group => group.childGroup).flat(),
          ...judgmentChoice.map(group => group.childGroup).flat(),
        ]
      },
      isdisabledFn(){
        return this.questionGroup.length > 0 && !this.errorMessage ? false :true
      },
      errorMessage() {
        return this.errorVal != '' ? true : false
      },
    },
    watch: {
      preEditData: {
        immediate: true,
        handler() {
          //变量更改
          let Increase = {}
          let {
            singleChoice,
            checkChoice,
            judgmentChoice
          } = this.preEditData.group
          if(!this.editQuestionId){
            Increase = {
              number: this.questionNumber_big,
              group:{
                singleChoice:singleChoice.map(group => {
                  return {
                        ...group,
                        start: group.end == null ? this.subTopic_number : group.start,
                      }
                }),
                checkChoice:checkChoice.map(group => {
                  return {
                        ...group,
                        start: group.end == null ? this.subTopic_number : group.start,
                      }
                }),
                judgmentChoice:judgmentChoice.map(group => {
                  return {
                        ...group,
                        start: group.end == null ? this.subTopic_number : group.start,
                      }
                }),
              }
            }
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
    methods: {
      ...mapMutations('questionType', [
        'subTopic_number_calculate',
        'subTopic_already_add', // 小题数组
        'subTopic_already_del', // 删除题组-小题
        'subTopic_calculate_determine', // 储存确定题型
        'subTopic_already_reset', // 清空
        'subTopic_determine_pid_clean',
      ]),
      ...mapMutations('pageContent',[]),

      opened() {
        this.openedFrame = true
      },

      openedEdit(){
        this.openedFrame = true
      },

      closeFrame() {
        // 取消弹框
        this.openedFrame = false
      },

      changeQuestionBig(num){
        this.preEditData = {
          ...this.preEditData,
          number:num
        }
      },

      hanldeSelectexistBig(){},

      preCreateQuestion(){
        // 保存题型
      },

      groupVerifyStatus(verify){
        this.errorVal = verify.str
      },

      updateGroupSubTopic(groupObj){
        // 编辑题组
        let obj = JSON.parse(JSON.stringify(this.preEditData))
        let {type,data} = groupObj
        let {group} = obj

        let curGroup = group[type]
        let index = curGroup.findIndex(group => group.id == data.id)

        if(index > -1){
          curGroup.splice(index,1,data)
          this.$nextTick(()=>{
            this.preEditData = JSON.parse(JSON.stringify(obj))
          })
        }
      },

      preEditSubtopic(subtopic){
        //编辑小题号
        let obj = JSON.parse(JSON.stringify(this.preEditData))
        let {type,data} = subtopic

        let curGroup = obj.group[type]
        let index = curGroup.findIndex(group => group.id == data.pid)

        if(index > -1){
          let childrenGroup = curGroup[index].childGroup
          let cIndex = childrenGroup.findIndex(topic => topic.id == data.id)

          if(cIndex > -1){
            childrenGroup.splice(cIndex,1,data)
            this.$nextTick(()=>{
              this.preEditData = JSON.parse(JSON.stringify(obj))
            })
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

<style lang="less">

</style>