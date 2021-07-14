<template>
  <div class="exam_content">
    <div class="head_wapper">
      <div class="dorm_head_nav">
        <div class="nav_logo"></div>
        <div class="nav_menu">
          <a
            v-for="(item, index) in linkData"
            :key="index"
            :class="['calssname',{'router-link-active':item.calssname == active}]"
            @click="handelChange(item)">
            <i></i>
            <span>{{item.linkName}} <em/></span>
          </a>
        </div>
        <div class="nav_login"></div>
      </div>
    </div>

    <div class="content_router">

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
      </div>

      <component
        :is="active"
        ref="dynamicComponent"
      />
    </div>
  </div>
</template>

<script>
  import teacherHome from './analysisContent/teacherHome'
  import testAnalysis from './analysisContent/testAnalysis'
  import subtopicScore from './analysisContent/subtopicScore'
  import examComment from './analysisContent/examComment'
  import { mapState } from 'vuex'
  export default {
    components: {
      teacherHome,
      testAnalysis,
      subtopicScore,
      examComment
    },
    data() {
      return {
        active:'teacherHome',
        linkData: [
          {
            'calssname':'teacherHome',
            'toUrl':'teacherHome',
            'linkName':'首页'
          },
          {
            'calssname':'testAnalysis',
            'toUrl':'testAnalysis',
            'linkName':'试题分析'
          },
          {
            'calssname':'subtopicScore',
            'toUrl':'subtopicScore',
            'linkName':'小题得分'
          },
          {
            'calssname':'examComment',
            'toUrl':'examComment',
            'linkName':'试卷讲评'
          }
        ],
        tid:0,
        cid:0,
        tsid:0,
        subjectBox:[],
        parameter:{
          tid: '',
          url:this.URL.GetAsTestClass
        },
        tabId:''
      }
    },

    computed: {
      ...mapState('questionAnalysis', ['examList','classList']),

      examOptions(){
        let objArray = this.examList.length ? this.examList.map(item => ({label:item.name,value:item.tid})) : []
        return objArray
      },

      classOptions(){
        let objArray = this.classList.length ? this.classList.filter(item => item.tsid != '0').map(item => ({label:item.cname,value:item.cid})) : []
        return objArray
      },

    },

    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query.tid) {
            this.tid = query.tid
          }
        },
        immediate: true
      },

      examOptions: {
        immediate: true,
        handler () {
          if(this.examOptions.length){
            if(this.tid == 0){
              this.tid =  this.examOptions.find((element,i) => i == 0).value
            }
            this.$nextTick(() => {
              this.parameter.tid = this.tid
              this.getClassSubjectList()
            })
          }
        }
      },

      classOptions: {
        immediate: true,
        handler () {
          if(this.classOptions.length){
            this.cid = this.classOptions.find((element,i) => i == 0).value
            this.subjectBox = this.classList.filter(item => item.cid == this.cid)[0].ASTestSubjectList.filter(item => item.tsid != '0').map(item => ({name:item.sname,tsid:item.tsid}))
          }else{
            this.cid = ''
            this.subjectBox = []
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
                this.$refs.dynamicComponent.initChange(formData)
              })
            }else{
              this.subjectBox = []
            }
          }
        }
      }
    },

    mounted () {
      if(this.tid != 0){
        this.subjectList()
      }
    },

    methods: {
      handelChange(item) {
        this.active = item.calssname
        this.$nextTick(() => {
          let formData = {
            tid:this.tid,
            cid:this.cid,
            tsid:this.tsid,
          }
          this.$refs.dynamicComponent.initChange(formData)
        })
      },

      handelExamChange(val) {
        this.tid = val
        this.$nextTick(() => {
          this.parameter.tid = this.tid
          this.getClassSubjectList()
        })
      },
      handelClassChange(val) {
        this.cid = val
        this.subjectBox = this.classList.filter(item => item.cid == this.cid)[0].ASTestSubjectList.filter(item => item.tsid != '0').map(item => ({name:item.sname,tsid:item.tsid}))
        this.$nextTick(() => {
          let formData = {
            tid:this.tid,
            cid:this.cid,
            tsid:this.tsid,
          }

          this.$refs.dynamicComponent.initChange(formData)
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

          this.$refs.dynamicComponent.initChange(formData)
        })
      },
      subjectList(){
        // 获取考次列表
        this.$store.dispatch('questionAnalysis/getExamList', {url:this.URL.GetAsTestList})
      },

      getClassSubjectList(){
        this.$store.dispatch('questionAnalysis/getClassList', this.parameter) // GetAsTestClass
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  button.el-button.btn_column.el-button--default.el-button--medium{
    &:hover{
      border-color: @bc_tr !important;
      background-color: @bc_tr !important;
      color: @main !important;
    }
  }
  .exam_content{

    height: 100%;

    .head_wapper{
      background-color: #fff;
      width: 100%;
      height: 59px;
      line-height: 59px;
      border-bottom: 1px solid #ebeef5;
    }
  }
  .dorm_head_nav{
    display: flex;
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    .nav_logo{
      flex-shrink:0;
      width: 180px;
      background: url('~@/assets/nav_logo.png') no-repeat center;
    }

    .nav_menu{
      width: 100%;
      flex-shrink:1;
      display: flex;

      a{
        flex-shrink:1;
        margin: 0 10px;
        width: 100%;
        text-align: center;

        &.router-link-active{
          span{
            color: @mainFont;
          }
        }

        span{
          color: @font-909;
        }

        &:hover{
          span{
            color: @mainFont;
          }
        }
      }

    }

    .nav_login{
      width: 160px;
      flex-shrink:0;
    }
  }

  .exam_wapper{
    height: calc(100% - 10px);
    width: 1200px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .content_router{
    height: calc(100% - 65px);
  }
  .calssname{
    cursor: pointer;
  }
</style>

<style lang="less" scoped>
  .teacher_wapper{
    padding-bottom:0;
  }
</style>
