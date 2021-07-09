<template>
    <!-- :modal="false" -->
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="800px"
  :append-to-body="true"
  :before-close="handleClose">
    <div class="table-description">
      <div class="table_left">
        <span class="mr_0">第<span class="color_style">{{question.questionName}}</span>题 </span>
        <span class="mr_0">分值<span class="color_style">{{question.fullScore}}</span></span>
        <span class="mr_0">平均分<span class="color_style">{{question.avgScore}}</span></span>
        <span class="mr_0">得分率<span class="color_style">{{question.scale}}</span></span>
        <span class="mr_0" v-if="question.type == 0">正确答案<span class="color_style">{{question.answer}}</span>
      </div>
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
        tableColumn:[
          {
            prop:'cname',
            label:'班级',
            width:'140',
            align:'center',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'option',
            label:'选项',
            minWidth:'80',
            align:'center',
            type:'Html'
          },
          {
            prop:'score',
            label:'得分',
            minWidth:'100',
            align:'center',
            type:'Html'
          }
        ],
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          tqid:'',
          type:0,
          scoreOrOptions:'',
          name:'',
          url:this.URL.GetAnswerStaticAnalysisStuDetails
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        prmTid:'',
        pageSizes:[10,15,20,30,50,100],
        theight: document.body.clientHeight - 400 || 0,
        question:{}
      }
    },

    computed: {
      ...mapState('answerTheTestDetails', ['tableLoading','TableList','pagination']),

      title() {
        return '学生名单详情'
      },

      tableData(){
        return this.TableList.length ? this.TableList : []
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
        const { tid,tsid,cids,type,tqid,scoreOrOptions,name} = row
        this.parameter = {
          ...this.parameter,
          tid:tid,
          tsid:tsid,
          cids:cids,
          type:type,
          tqid:tqid,
          scoreOrOptions:scoreOrOptions,
          name:name
        }
        this.question = row
        this.prmTid = row.tid
        this.$nextTick(()=>{
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },500)
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

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        //Qs.stringify
        this.parameter = {
          ...this.parameter,
          pageIndex: pageNum,
          pageSize: pageSize,
        }
        this.$store.dispatch('answerTheTestDetails/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {cids,tid,tsid,asid,type,tqid,scoreOrOptions,name} = this.parameter
        window.open(`${this.URL.ExportAnswerStaticAnalysisStuDetails}?tid=${tid}&tsid=${tsid}&type=${type}&cids=${cids}&asid=${asid}&tqid=${tqid}&scoreOrOptions=${scoreOrOptions}&questionName=${name}`)
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
      span.mr_0{
        margin-right: 0px;
      }
      .color_style{
        color: @main;
        margin: 0 5px;
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