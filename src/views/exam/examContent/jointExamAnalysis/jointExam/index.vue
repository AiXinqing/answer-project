<template>
  <div class="complex_content">
    <div ref="stretch">
      <hj-stretch
        v-for="(choose,i) in stretchBox"
        :key="i"
        :choose-list="choose"
        @handle-stretch="handleStretch"
        @handle-checkAll-change="handleCheckAllChange"
        @single-change="singleChange"
      >
      </hj-stretch>
    </div>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left is_active" style="margin-left:0">
          <span>得分率说明：优秀：90% - 100% 良好：80% - 100% 及格：60% - 100% 低分：0% - 30%<a href="###" class="set_parameter">设置参数</a></span>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table
          :style="{'max-height':theight+ tableH +'px'}"
          :tablecols="tableColumn"
          :tableData="tableData"
          :isIndex="false"
          :pagination="page"
          :loading="tableLoading"
          :theight="theight"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
          ></exam-table>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  export default {
    props: {

      prmTid: {
        type: String,
        default: ''
      },

      examInfo:{
        type:Array,
        default:() => []
      }
    },

    data() {
      return {
        stretch: true,
        stretchArr:[],
        fixedHeader:[
          {
            prop:'scname',
            label:'学校',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            minWidth:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            minWidth:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
        ],
        columnMultiLine:[
          {
            prop:'tscore',
            label:'分数',
            width:'85',
            align:'center',
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            width:'90',
            align:'center',
          },
          {
            prop:'classRank',
            label:'班级排名',
            width:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        keyWords:'',
        scids:'',
        theight: document.body.clientHeight - 350 || 0,

        parameter:{
          scids:'',
          keyWords:'',
          tid: '',
          tsid:'',
          url:this.URL.GetJointExamStuResults
        },

        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetStuResultsHeade,
        tableH:51
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr']),
      ...mapState('jointExams', ['headerTable',
        'TableList','schoolArr','pagination',
        'tableLoading'
      ]),


      schoolIdsArr(){
        return this.schoolArr.length ? this.schoolArr.filter(item => item.check && item.scid != 'all')
                .map(ele => ele.scid).toString() : ''
      },

      stretchBox(){
        return this.examInfo.length ? this.examInfo.map(element =>{
          return element.subject == '科目' ? {
            ...element,
            subjectList:element.subjectList.map((item,index) => {
              return index == 0 ? {...item,check:true} : {...item,check:false}
            })
          } : {
            ...element,
            subjectList:this.schoolArr
          }
        }) :[]
      },

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.sname,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {
                type:'Html'
              }
              if(item.label == '分数' && ele.sname !='总分'){
                obj = {
                  type:'Text',
                  url:this.URL.BrowsescoreAnsw,
                  subject:ele.sname
                }
              }
              return {
                ...item,
                prop:`${item.prop}_${ele.sname}`,
                label:item.label,
                width:item.width,
                align:item.align,
                ...obj
              }
            }),
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`classRank_${item.sname}`]: item.classRank,
              [`gradeRank_${item.sname}`]: item.gradeRank,
              [`tsid_${item.sname}`]: item.tsid,
              ord: item.ord,
              sname: item.sname,
              [`tscore_${item.sname}`]: item.tscore,
              tsid: item.tsid,
              tid: this.prmTid,
              jump:1
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            snumber: item.snumber,
            stuname: item.stuname,
            tmid: item.tmid,
            tnumber: item.tnumber,
            totalscore: item.totalscore,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 350
      })
    },

    watch: {
      schoolIdsArr: {
        immediate: true,
        handler () {
          this.scidsStr = this.schoolIdsArr
        },
      },
      pagination:{
        immediate: true,
        handler () {
          this.page = this.pagination
        },
      },

    },

    methods: {
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })

      },

      initTable() {
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          this.scidsStr = this.schoolIdsArr
          // 获取动态表头
          this.getDynamicHeader(this.tsid)
          this.getTable()
        })
      },

      handleSizeChange(val){
        // 分页每页显示数量
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }

        this.page.pageSize = val
        this.$nextTick(()=>{
          this.getTable()
        })

      },
      handleCurrentChange(val){
        // 分页起始页
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }

        this.page.pageNum = val
        this.$nextTick(()=>{
          this.getTable()
        })

      },

      handleCheckAllChange(scidsStr){
        // 学校查询
        if(this.scids == ''){
          this.scids = this.schoolArr.find((element,i) => i == 0).scids
        }
        this.scidsStr = scidsStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        this.$nextTick(()=>{
          this.getDynamicHeader(this.tsid)
          this.getTable()
        })
      },

      handleInquire(){
        // 输入框查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        window.open(`${this.URL.ExportJointExamStuResults}?tid=${this.prmTid}&tsid=${this.tsid}&scids=${this.scids}&keyWords=&${this.keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },


      getDynamicHeader(tsid){
        // 获取动态表头
        this.$store.dispatch('jointExams/dynamicHeader', {
          tid: this.prmTid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        this.parameter = {
          ...this.parameter,
          scids:this.scidsStr,
          tid: this.prmTid,
          tsid:this.tsid,
          keyWords:this.keyWords,
          pageIndex: pageNum,
          pageSize: pageSize,
        }
        this.$store.dispatch('jointExams/GetStuResults', this.parameter)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

</style>