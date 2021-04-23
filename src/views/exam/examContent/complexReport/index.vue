<template>
  <div class="exam_wapper">
    <hj-tabs
      v-model="activeName"
      :tab-pane="tabPaneBox"
      @tab-click="handleClick"
    >
      <component
        :is="activeName"
        :stretch-box="stretchBox"
        :active-name="activeName"
        :pagination="pagination"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
        @handle-checkAll-change="handleCheckAllChange"
        @single-change="singleChange"
        @handle-inquire="handleInquire"
        @handel-down-table="handelDownTable"
      ></component>
    </hj-tabs>
  </div>
</template>

<script>
  import gradebook from './gradebook'
  import subTable from './subTable'
  import classGrades from './classGrades'
  import question from './question'
  import gradesStatistics from './gradesStatistics'
  import ranking from './ranking'
  // import Qs from 'qs'

  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      gradebook,
      subTable,
      classGrades,
      question,
      gradesStatistics,
      ranking
    },

    data() {
      return {
        activeName: 'gradebook',
        tabPaneBox:[
          {
            label:'成绩册',
            name:'gradebook'
          },
          {
            label:'小分表',
            name:'subTable'
          },
          {
            label:'班级成绩对比',
            name:'classGrades'
          },
          {
            label:'试题汇总表',
            name:'question'
          },
          {
            label:'成绩分段统计',
            name:'gradesStatistics'
          },
          {
            label:'名次和比例分析',
            name:'ranking'
          },
        ],
        prmTid: '',
        tsid:'',
        stretchBox:[],
        pagination: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        pageData:{},
        parameter:{
          cids:'',
          keyWords:'',
          tid: '',
          tsid:'',
        },
        resetParameter:{}
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapGetters('getExam', ['examInfo']),

      classIdsArr(){
        return this.classesArr.length ? this.classesArr.filter(item => item.check && item.cid != 'all')
                  .map(ele => ele.cid).toString() : ''
      }
    },

    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query.prmTid) {
            this.prmTid = query.prmTid
          }
        },
        immediate: true
      },
      classIdsArr: {
        immediate: true,
        handler () {
          this.parameter = {
            ...this.parameter,
            cids:this.classIdsArr,
          }
        },
      },
    },

    mounted () {
      if(this.prmTid != ''){
        this.getExamFunc(this.prmTid)
        this.pageData = this.pagination
        this.resetParameter = this.parameter
      }
    },
    methods: {
      handleClick(tab){
        this.activeName = tab.name
      },

      getExamFunc(prmTid) {
        this.$store.dispatch('getExam/getExamInfo', {
          prmTid: prmTid
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.stretchBox = this.examInfo
            this.subjectsArr.forEach((element,i) => {
              if(i == 0){
                this.tsid = element.tsid
              }
            })
            this.$nextTick(()=>{
              // 获取动态表头
              this.getDynamicHeader(prmTid,this.tsid)
              this.parameter = {
                ...this.parameter,
                tid:prmTid,
                tsid:this.tsid
              }
              this.getTable()
            })
          }
        })
      },

      getDynamicHeader(prmTid,tsid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: prmTid,tsid:tsid
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.pagination
        //Qs.stringify
        this.$store.dispatch('getExam/GetStuResults', {
          ...this.parameter,
          pageIndex: pageNum,
          pageSize: pageSize,
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            const {count,pageIndex,pageSize} = res.ResponseContent
            this.pagination = {
              pageSize: pageSize,
              pageNum: pageIndex,
              total: count
            }
          }
        })
      },

      handleSizeChange(val){
        this.pagination.pageSize = val
        this.getTable()
      },

      handleCurrentChange(val){
        this.pagination.pageNum = val
        this.getTable()
      },

      handleCheckAllChange(cidStr){
        // 选择班级
        this.parameter={
          ...this.parameter,
          cids:cidStr
        }
        this.getTable()
      },

      singleChange(tsid){
        // 选择科目
        this.parameter={
          ...this.parameter,
          tsid:tsid
        }
        this.getDynamicHeader(this.prmTid,tsid)
        this.getTable()
      },

      handleInquire(keyWords){
        //输入框查询条件
        this.parameter={
          ...this.parameter,
          keyWords:keyWords
        }
        this.getTable()
      },

      handelDownTable(){
        // 下载表格
        this.$http.get(URL.ExportStuResults,this.parameter).then((res) => {
          if(res.data.ResponseCode == 'Success'){
            console.log(res)
          }
        })
        .catch(() => { // 请求失败处理
          this.saveBtnStuta = false
        })
      }
    },
  }
</script>

<style lang="less">
  .exam_wapper{
    width: 1200px;
    position: relative;
    left: 50%;
    margin: 5px;
    transform: translateX(-50%);
    height: calc(100% - 40px);

    &>div{
      height: 100%;
    }
  }
  .el-tabs__content{
    height: 100%;
    &>div{
      height: 100%;
    }
  }
</style>