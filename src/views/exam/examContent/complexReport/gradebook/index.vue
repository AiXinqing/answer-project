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
        <div class="search_left">
          <span class="titile_18">分数详情</span>
          <i>(点击学科的分数，可查看学生的答题卡)</i>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
          <exam-button type="primary" @click="handleInquire">查询</exam-button>
          <div class="input_box">
            <span class="clear_box">
              <i class="el-icon-circle-close" @click="handleClear"></i>
            </span>
            <hj-input
              v-model="keyWords"
              class="search_input"
              placeholder="输入姓名/考号/学号进行搜索"
              :iSlot="iSlot"
            />
          </div>
        </div>
      </div>

      <div class="el_table_wapper">
        <umy-table
          :tablecols="tableColumn"
          :tableData="tableData"
          :isIndex="false"
          :pagination="page"
          :loading="tableLoading"
          :theight="tableData.length < 10 ? tableData.length * 35 + 110 : theight"
          @hanlde-page-size="handlePageSize"
         />
        
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
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
        ],
        columnMultiLine:[
          {
            prop:'tscore',
            label:'分数',
            minWidth:'85',
            align:'center',
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'classRank',
            label:'班级排名',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        keyWords:'',
        cidStr:'',
        theight: 500,
        iSlot:[
          {
            type:'prefix',
            icon:'el-icon-search'
          }
        ],
        parameter:{
          cids:'',
          keyWords:'',
          tid: '',
          tsid:'',
          url:this.URL.GetStuResults
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetTableHeadeSubject,
        tableH:51
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','headerTable',
        'TableList','classesArr','pagination',
        'tableLoading'
      ]),


      classIdsArr(){
        return this.classesArr.length ? this.classesArr.filter(item => item.check && item.cid != 'all')
                .map(ele => ele.cid).toString() : ''
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
            subjectList:this.classesArr
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

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
          let _$this = this
          this.$nextTick(()=>{
            this.getHeight()
          })
        },
      },
      pagination:{
        immediate: true,
        handler () {
          this.page = this.pagination
        },
      },

    },

    created () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },

    methods: {
      getHeight () {
        this.theight = document.body.clientHeight - 310
      },

      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })

      },

      initTable() {
        this.theight = document.body.clientHeight - 310

        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          this.getDynamicHeader(this.tsid)
          this.getTable()
        })
      },

      handlePageSize({page, size}){
        // 分页起始页
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.page.pageNum = page
        this.page.pageSize = size
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handleCheckAllChange(cidStr){
        // 班级查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.cidStr = cidStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        this.page = {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
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
        window.open(`${this.URL.ExportStuResults}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}&keyWords=&${this.keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },


      getDynamicHeader(tsid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: this.prmTid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        this.parameter = {
            ...this.parameter,
            cids:this.cidStr,
            tid: this.prmTid,
            tsid:this.tsid,
            keyWords:this.keyWords,
            pageIndex: pageNum,
            pageSize: pageSize,
          }

        this.$store.dispatch('getExam/GetStuResults', this.parameter)
        this.$nextTick(()=>{
          this.theight = document.body.clientHeight - 310
        })

      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .input_box{
    position: relative;
    .hj-input.el-input{
      width: 225px;
    }

    .clear_box{
      position: absolute;
      right: 5px;
      z-index: 1000;
      top: 8px;
      cursor: pointer;
    }
  }
  .complex_content{
    width: 100%;
    background-color: @white;
    margin-top: 10px;
    padding: 5px 0;
    height: calc(100% - 20px);
    // overflow: auto
  }

  .table_wapper {
    height: auto;
    margin-top: 15px;
    padding: 0 15px 10px 15px;

    .table_search{
      display: flex;
      height: 40px;

      .search_left{
        width: 310px;
        flex-shrink:0;
        line-height: 40px;

        .titile_18{
          font-size: 18px;
        }
        i{
          font-size: 12px;
          margin-left: 10px;
          color: @font-909;
        }
      }

      .search_right{
        width: 100%;
        flex-shrink:1;
        justify-content:flex-end;

        &>div{
          margin-top: 5px;
          float: right;
          margin-left: 10px;
        }

        &:after {
          content: "";
          clear: both;
          display: block;
        }

        .exam_box{
          margin-top: 10px;
        }
      }
    }

    .el_table_wapper{
      margin-top: 30px;
    }
  }
  .el_table_wapper{
    height: 100%;
    // overflow: auto;
    // height: calc(100% - 285px);
    section{
      height: 100%;
      >div{
        height: 100% ;//calc(100% - 47px);
        .el-table__body-wrapper{
          height: calc(100% - 60px);
        }
        .el-table__fixed{
          height:100%
        }
      }
    }
  }
  .input_box{
    .clear_box{
      display: none
    }
    &:hover{
      .clear_box{
        display: block
      }
    }
  }

</style>