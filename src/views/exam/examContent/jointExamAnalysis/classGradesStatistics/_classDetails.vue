<template>
    <!-- :modal="false" -->
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="1000px"
  :append-to-body="true"
  :before-close="handleClose">
    <div class="table-description">
      <div class="table_left" />
      <div class="table_right">
        <exam-button type="primary" @click="downTable">下载表格</exam-button>
      </div>
    </div>
    <div class="el_table_wapper mr_top">
      <exam-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :pagination="page"
        :loading="tableLoading"
        :pageSizes="pageSizes"
        :theight="theight"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      ></exam-table>
    </div>
</el-dialog>
</template>

<script>
  import { mapState} from 'vuex'
  export default {
    data() {
      return {
        dialogVisible: false,
        fixedHeader:[
          {
            prop:'scname',
            label:'学校',
            width:'140',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            width:'100',
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
          }
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
        parameter:{
          cid:'',
          tid: '',
          tsid:'',
          scids:'',
          segmentName:'',
          step:50,
          type:0,
          url:this.URL.GetJointExamClassScoreSegmentStuDetails
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetTableHeadeSubject,
        prmTid:'',
        pageSizes:[10,15,20,30,50,100],
        theight: document.body.clientHeight - 400 || 0
      }
    },

    computed: {
      ...mapState('getExam', ['headerTable',]),
      ...mapState('classStatisticsDetails', ['tableLoading','TableList','pagination',]),

      title() {
        return '学生名单详情'
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
                  type:'Jump',
                  btnList:[
                    {
                      label:'',
                      handle: (row) => {
                        window.open(`${this.URL.BrowsescoreAnsw}?tid=${row.tid}&tsid=${ele.tsid}&tnumber=${row.tnumber}`)
                      }
                    }
                  ]
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
            scname: item.scname,
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
      pagination:{
        immediate: true,
        handler () {
          this.page = this.pagination
          this.theight = document.body.clientHeight - 400
        },
      },
    },

    methods: {
      openDetails(row){
        this.dialogVisible = true
        this.parameter = {
          ...this.parameter,
          ...row
        }
        this.prmTid = row.tid
        this.$nextTick(()=>{
          this.getDynamicHeader(row.tsid,row.tid)
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },400)
        })
      },

      handleClose() {
        this.dialogVisible = false
        this.page = {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
      },

      handleSizeChange(val){
        // 分页每页显示数量
        this.page.pageSize = val
        this.$nextTick(()=>{
          this.getTable()
        })

      },
      handleCurrentChange(val){
        // 分页起始页
        this.page.pageNum = val
        this.$nextTick(()=>{
          this.getTable()
        })

      },

      getDynamicHeader(tsid,tid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: tid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        //Qs.stringify
        this.parameter = {
          ...this.parameter,
          pageIndex: pageNum,
          pageSize: pageSize,
        }
        this.$store.dispatch('classStatisticsDetails/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {cid,tid,tsid,segmentName,step,type,scids} = this.parameter
        window.open(`${this.URL.ExportJointExamClassScoreSegmentStuDetails}?tid=${tid}&tsid=${tsid}&cid=${cid}&segmentName=${segmentName}&step=${step}&type=${type}&scids=${scids}`)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el_table_wapper.mr_top{
    margin-top: 15px;
  }
  .table-description{
    display: flex;

    .table_left{
      width: 87%;
      span{
        margin-right: 10px;
      }
    }
  }
  .el-dialog__headerbtn:focus ,
  .el-dialog__headerbtn:hover {
    .el-dialog__close{
      color: @main
    }
  }
</style>