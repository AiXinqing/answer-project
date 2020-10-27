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
        :tab-pane-data="tabPaneData"
        :group-data="editingData.group"
        @group-verify-status="groupVerifyStatus"
        @update-group-subTopic="updateGroupSubTopic"
        @pre-edit-subtopic="preEditSubtopic"
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
  import { mapState,mapGetters } from 'vuex' // mapMutations,
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
      ...mapState('questionType', ['tabPaneData']),
      ...mapGetters('pageContent', ['questionNumber_big_exist','question_order','options']),
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
        return []
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
          this.editingData = {
            ...this.preEditData
          }
        }
      }
    },
    methods: {
      opened() {
        this.openedFrame = true
      },

      openedEdit(){
        this.openedFrame = true
      },

      closeFrame() {
        // 取消弹框
        // this.preEditQuestion = JSON.parse(JSON.stringify(this.closeData))
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
        let {type,data} = groupObj
        let {group} = this.preEditData

        let curGroup = group[type]
        let index = curGroup.findIndex(group => group.id == data.id)

        if(index > -1){
          this.preEditData.group[type].splice(index,1,data)
        }
      },

      preEditSubtopic(subtopic){
        //编辑小题号
        let {type,data} = subtopic
        let {group} = this.preEditData

        let curGroup = group[type]
        let index = curGroup.findIndex(group => group.id == data.pid)

        if(index > -1){
          let childrenGroup = curGroup[index].childGroup
          let cIndex = childrenGroup.findIndex(topic => topic.id == data.id)

          if(cIndex > -1){
            this.preEditData.group[type][index].childGroup.splice(cIndex,1,data)
          }
        }
      },
    },
  }
</script>

<style lang="less">

</style>