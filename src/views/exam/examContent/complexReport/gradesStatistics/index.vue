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
        <div class="search_center">
          <div class="search_name"> 统计方式：</div>
          <el-radio-group v-model="type" @change="handleStatistical">
            <el-radio-button label="0" >分段统计</el-radio-button>
            <el-radio-button label="1">累计统计</el-radio-button>
          </el-radio-group>
        </div>
        <div class="search_left" style="width:auto">
          <span class="titile_14">分数区间：</span>
          <hj-input class="indent_model" style="width:60px;" type="number" v-model="step" placeholder="50" />
          <span class="titile_14"> 分/段</span>

          <exam-button type="primary" class="grades_btn" @click="handelScoreInterval">确定</exam-button>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper" :style="{'max-height':theight +'px'}">
        <exam-table
          :tablecols="gradersTableColumn"
          :tableData="gradersTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :difference-height="differenceHeight"
          :loading="tableLoading"
          @hanlde-pop-func="hanldePopFunc"
        ></exam-table>
      </div>
    </div>

    <student-details
      ref="studentDetails"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_classDetails'
  export default {
    components: {
      studentDetails,
    },
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
        stretch: false,
        differenceHeight: -10,
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
            prop:'referenceNumber',
            label:'参考人数',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
        ],

        rankArr:[
          {
            prop:'num',
            label:'人数',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'scale',
            label:'比例',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        step:50,
        tsid:'',
        cidStr:'',
        theight: document.body.clientHeight - 310 || 0,
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          step:50,
          type: 0, //统计类型：0:分段统计，1：累计统计
          url:this.URL.GetClassScoreSegment
        },
        type: 0
      }
    },
    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapState('gradesStatistics', ['tableLoading','headerTable','TableList',]),

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

      gradersTableColumn(){
        // 动态表头
        let tsid_s = this.subjectsArr.find((element,i) => i == 0).tsid
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map((item,index) =>{
              return {
                ...item,
                label:item.label,
                type: index == 0 ? 'popBtn' : 'Html',
                prop:`${item.prop}_${ele}`,
                p_name:ele,
                p_step:this.step,
                p_type:this.type,
                tid:this.prmTid,
                tsid:this.tsid == '' ? tsid_s : this.tsid,
              }
            })
          }))
        ] : []
      },

      gradersTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`num_${element.name}`]:element.num,
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            referenceNumber: item.referenceNumber,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 310
      })
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
        },
      },

    },

    methods: {
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 248 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable() {
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },400)
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
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handelScoreInterval(){
        //分数区间
        this.parameter.step = Number(this.step)
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handleStatistical(){
        //统计方式
        this.parameter.type = Number(this.type)
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.parameter = {
          ...this.parameter,
          cids:this.cidStr,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.$store.dispatch('gradesStatistics/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {cids,tid,tsid,step,type} = this.parameter
        window.open(`${this.URL.ExportClassScoreSegment}?tid=${tid}&tsid=${tsid}&cids=${cids}&step=${step}&type=${type}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .titile_14{
    color: @font-888;
    font-size: 14px;
  }
  .indent_model{
    input{
      text-indent:0 !important
    }
  }
  .search_name{
    width: 70px;
    line-height: 28px;
    font-size: 14px;
    margin-top: 10px;
    color: @font-888;
  }
  .search_left{
    margin-left: 20px;
  }
  .search_center{
    width: 280px;
    display: flex;
    .el-radio-group{
      display: flex;
      margin-top: 10px;

      span.el-radio-button__inner{
        padding: 0 8px !important;
        height: 28px;
        line-height: 28px;
        color: @font-888;
        &:hover{
          color: @main;
        }
      }
      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background-color: @main;
        border-color: @main;
        color: @white;
      }
    }
  }
  .grades_btn{
    &.exam_box{
      display: inline;
      margin-left: 15px;
      width: 80px;

      .el-button--medium{
        width: 80px
      }
    }
  }
</style>