<template>
  <div class="teacher_wapper">
    <div class="exam_subject mr_10">

      <div class="select_box">
        <div class="search_select">
          <div class="select_label">切换考试：</div>
          <hj-select
            :items="examOptions"
            size="mini"
            :value="tid"
            @change="handelExamChange"
          ></hj-select>
        </div>
        <div class="search_select">
          <div class="select_label">切换班级：</div>
          <hj-select
            :items="classOptions"
            size="mini"
            :value="cid"
            @change="handelClassChange"
          ></hj-select>
        </div>
      </div>

      <div class="subject_box">
        <div class="subject_left">选择科目：</div>
        <div class="subject_right">
          <template v-if="subjectBox.length">
            <div
              :class="['subject_item',{'active':item.tsid == tsid }]"
              v-for="item in subjectBox"
              :key="item.tisd"
              @click="subjectChange(item)"
            >{{item.name}}</div>
          </template>
          <template v-else><div class="no_data">暂无数据</div></template>

        </div>
      </div>
    </div>

    <!-- 整体概况 -->
    <overall-overview
      ref="overallOverview"
      class="mr_10" />

    <!-- 学科等级分布 -->
    <subject-juxtapose
      ref="subjectJuxtapose"
      class="mr_10"
    />

    <!-- 学科对比 -->
    <subject-contrast
      ref="subjectContrast"
      class="mr_10"
    />

    <!-- 成绩单 -->
    <template v-if="tsid == 0">
      <transcript
        ref="transcript"
        class="mr_10"
      />
    </template>
    <template v-else>
      <singleTranscript
        ref="transcript"
        class="mr_10"
      />
    </template>

  </div>
</template>

<script>
  import overallOverview from "./overallOverview"
  import subjectJuxtapose from "./subjectJuxtapose"
  import subjectContrast from "./subjectContrast"
  import transcript from "./transcript"
  import singleTranscript from "./transcript/singleTranscript"
  import { mapState } from 'vuex'

  export default {

    components: {
      overallOverview,
      subjectJuxtapose,
      subjectContrast,
      transcript,
      singleTranscript
    },

    data() {
      return {
        tid:0,
        cid:0,
        tsid:'',
        subjectBox:[],
        parameter:{
          tid: '',
          url:this.URL.GetAsTestClass
        },
        tabId:''
      }
    },

    computed: {
      ...mapState('teacherHome', ['examList','classList']),

      examOptions(){
        let objArray = this.examList.length ? this.examList.map(item => ({label:item.name,value:item.tid})) : []
          if(objArray.length){
            let tid = objArray.find((element,i) => i == 0).value
              this.$nextTick(() => {
                this.tid = tid
                this.parameter.tid = tid
                this.getClassSubjectList()
              })
            }
        return objArray
      },

      classOptions(){
        return this.classList.length ? this.classList.map(item => ({label:item.cname,value:item.cid})) : []
      },

    },

    watch: {

      classOptions: {
        immediate: true,
        handler () {
          if(this.classOptions.length){
            this.cid = this.classOptions.find((element,i) => i == 0).value

            this.subjectBox = this.classList.filter(item => item.cid == this.cid)[0].ASTestSubjectList.map(item => ({name:item.sname,tsid:item.tsid}))
          }
        }
      },


      subjectBox: {
        immediate: true,
        handler () {
          if(this.subjectBox.length){
            this.tsid = this.subjectBox.find((element,i) => i == 0).tsid
            let tid = this.tid
            if(tid == 0){
              tid = this.examOptions.find((element,i) => i == 0).value
            }

            if(this.tsid != ''  && this.tid != 0){
              this.$nextTick(() => {
                let formData = {
                  tid:tid,
                  cid:this.cid,
                  tsid:this.tsid,
                }
                this.$refs.overallOverview.initTable(formData)
                this.$refs.subjectJuxtapose.initTable(formData)
                this.$refs.subjectContrast.initTable(formData)
                this.$refs.transcript.initTable(formData)
              })
            }else{
              this.subjectBox = []
              this.$refs.overallOverview.emptyFunc()
              this.$refs.subjectJuxtapose.emptyFunc()
              this.$refs.subjectContrast.emptyFunc()
              this.$refs.transcript.emptyFunc()
            }
          }
        }
      }
    },


    mounted () {
      this.subjectList()
      if(this.tabId != ''){
        this.subjectList()
      }
    },

    methods: {
      handelExamChange(val) {
        this.tid = val
        this.$nextTick(() => {
          this.parameter.tid = this.tid
          this.getClassSubjectList()
        })
      },
      handelClassChange(val) {
        this.cid = val
        this.subjectBox = this.classList.filter(item => item.cid == val)[0].ASTestSubjectList.map(item => ({name:item.sname,tsid:item.tsid}))
        this.$nextTick(() => {
          let formData = {
            tid:this.tid,
            cid:this.cid,
            tsid:this.tsid,
          }

          this.$refs.overallOverview.initTable(formData)
          this.$refs.subjectJuxtapose.initTable(formData)
          this.$refs.subjectContrast.initTable(formData)
          this.$refs.transcript.initTable(formData)
        })
      },

      subjectChange(item){
        // 切换科目
        this.tsid = item.tsid
        this.$nextTick(() => {
          let formData = {
            tid:this.tid,
            cid:this.cid,
            tsid:this.tsid,
          }

          this.$refs.overallOverview.initTable(formData)
          this.$refs.subjectJuxtapose.initTable(formData)
          this.$refs.subjectContrast.initTable(formData)
          this.$refs.transcript.initTable(formData)
        })
      },
      subjectList(){
        // 获取考次列表
        this.$store.dispatch('teacherHome/getExamList', {url:this.URL.GetAsTestList})
      },

      getClassSubjectList(){
        this.$store.dispatch('teacherHome/getClassList', this.parameter)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

  .teacher_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 20px;
  }

  .exam_subject{
    padding: 20px 0;
    background-color: @white;
    width: 100%;

    &>div{
      margin: 0 10px;
    }

    .select_box{
      display: flex;
      width: clac(100% - 20px);

      .search_select{
        display: flex;
        width: 50%;

        .select_label{
          font-size: 14px;
          line-height: 28px;
        }

        .hj-select{
          width: 250px;
          .el-select{
            width: 250px;
          }

          .el-input--mini .el-input__inner{
            text-align: left;
            text-indent: 1em;
          }
        }

      }
    }

    .subject_box{
      display: flex;
      font-size: 14px;

      .subject_left{
        line-height: 28px;
        margin-top: 20px;
        width: 75px;
      }
    }
  }

  .mr_10{
    margin-top: 10px;
  }

  .subject_right{
    display: flex;
    width: 100%;

    .subject_item{
      padding: 0 15px;
      border-radius: 4px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      margin-left: 10px;
      margin-top: 20px;

      &.active{
        background-color: @main;
        color: @white;
      }
    }
  }

  .no_data {
    line-height: 28px;
    margin-top: 20px;
    color: @font-999;
    margin-left: 20px;
  }
</style>