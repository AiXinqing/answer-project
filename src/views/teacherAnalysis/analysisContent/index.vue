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

          <div
            :class="['subject_item',{'active':item.id == subjectSelect}]"
            v-for="item in subjectBox"
            :key="item.id"
            @click="subjectChange(item)"
          >{{item.name}}</div>

        </div>
      </div>
    </div>

    <overall-overview class="mr_10" />
  </div>
</template>

<script>
  import overallOverview from "./teacherHome/overallOverview"
  import { mapState} from 'vuex'

  export default {

    components: {
      overallOverview,
    },

    data() {
      return {
        tid:0,
        cid:0,
        subjectBox:[
          {
            name:'全部',
            id:0
          },
          {
            name:'语文',
            id:1
          },
          {
            name:'数学',
            id:2
          }
        ],
        subjectSelect:0,
        parameter:{
          tid: '',
          url:this.URL.GetAsTestClass
        },
      }
    },

    computed: {
      ...mapState('teacherHome', ['subject','classList']),

      examOptions(){
        return this.subject.length ? this.subject.map(item => ({label:item.name,value:item.tid})) : []
      },

      classOptions(){
        return this.classList.length ? this.classList.map(item => ({label:item.cname,value:item.cid})) : []
      }
    },

    watch: {
      examOptions: {
        immediate: true,
        handler () {
          this.tid =  this.examOptions.length ? this.examOptions.find((element,i) => i == 0).tid : 0
          if(this.tid != 0){
            // this.$nextTick(() => {
            //   this.parameter.tid = this.tid
            //   this.getClassList()
            // })
          }
        },
      },
      classOptions: {
        immediate: true,
        handler () {
          this.cid =  this.classOptions.length ? this.classOptions.find((element,i) => i == 0).cid : 0
        },
      },
    },

    mounted () {
      this.subjectList()
    },

    methods: {
      handelExamChange(val) {
        console.log(val)
        this.tid = val
        this.$nextTick(() => {
          this.parameter.tid = this.tid
          this.getClassList()
        })
      },
      handelClassChange() {

      },

      subjectChange(item){
        this.subjectSelect = item.id
      },
      subjectList(){
        // 获取考次列表
        this.$store.dispatch('teacherHome/getSubject', {url:this.URL.GetAsTestList})
      },

      getClassList(){
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

</style>