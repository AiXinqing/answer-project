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

    <!-- 试题分析 -->
    <questions-analysis
      ref="questionsAnalysis"
      class="mr_10"
    />

  </div>
</template>

<script>

  import questionsAnalysis from "./questionsAnalysis"
  import { mapState } from 'vuex'

  export default {

    components: {
      questionsAnalysis
    },

    data() {
      return {
        tid:0,
        cid:0,
        tsid:0,
        subjectBox:[],
        parameter:{
          tid: '',
          url:this.URL.GetAsTestClass
        },
      }
    },

    computed: {
      ...mapState('teacherHome', ['examList','classList']),

      examOptions(){
        return this.examList.length ? this.examList.map(item => ({label:item.name,value:item.tid})) : []
      },

      classOptions(){
        return this.classList.length ? this.classList.map(item => ({label:item.cname,value:item.cid})) : []
      },

      cidVal () {
        return this.classOptions.length ? this.classOptions[0].value : ''
      },

    },

    watch: {
      cidVal: {
        immediate: true,
        handler () {
          if(this.cidVal != '' && this.cid != 0){
            this.cid = this.cidVal
            this.subjectBox = this.classList.filter(item => item.cid == this.cid)[0].ASTestSubjectList.map(item => ({name:item.sname,tsid:item.tsid}))
          }
        }
      },
      subjectBox: {
        immediate: true,
        handler () {
          if(this.subjectBox.length){
            this.tsid = this.subjectBox.find((element,i) => i == 0).tsid
            if(this.tsid != 0){
              this.$nextTick(() => {
                let formData = {
                  tid:this.tid,
                  cid:this.cid,
                  tsid:this.tsid,
                }

                this.$refs.questionsAnalysis.initTable(formData)
              })
            }
          }
        }
      }
    },

    mounted () {
      this.subjectList()
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

          this.$refs.questionsAnalysis.initTable(formData)
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

          this.$refs.questionsAnalysis.initTable(formData)
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

</style>