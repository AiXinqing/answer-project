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
      <div class="table_search ranking">
        <div class="search_left">
          <div class="titile_14 ranking_title">您可以设置</div>
          <hj-select
            :items="options"
            size="mini"
            :value="type"
            @change="handelRanking"
          ></hj-select>
          <hj-input class="indent_model" style="width:120px;" v-model="placing" />
          <div class="titile_14" style="margin-left:10px">名，查看不同名次段的人数分布及详情。</div>

          <exam-button type="primary" @click="handelSearch">确定</exam-button>
        </div>
        <div class="search_right">
          <exam-button type="primary" style="margin-top:7px" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <umy-table
          :tablecols="gradersTableColumn"
          :tableData="gradersTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :single-height="50"
          :loading="tableLoading"
          :difference-height="differenceHeight"
          @hanlde-pop-func="hanldePopFunc"
        />
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
        differenceHeight:-7,
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'referenceNumber',
            label:'参考人数',
            width:'80',
            fixed:'left',
            align:'center',
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
        tsid:'',
        cidStr:'',
        type:'top',
        theight: document.body.clientHeight - 300 || 0,
        placing:'10,20,30,40,50',
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          type: 'top', //名次类型：top:前，after：后
          placing:'10,20,30,40,50',
          url:this.URL.GetPlacingSegment
        },
        options:[
          {
            value: 'top',
            label: '前'
          },
          {
            value: 'after',
            label: '后'
          }
        ]
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapState('ranking', ['tableLoading','headerTable','TableList',]),

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
                p_rank:ele,
                p_type:this.parameter.type,
                tid:this.prmTid,
                tsid:this.tsid == '' ? this.subjectsArr.find((element,i) => i == 0).tsid : this.tsid,
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

    created () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
          this.$nextTick(()=>{
            this.getHeight()
          })
        },
      },

    },

    methods: {
      getHeight () {
        this.theight = document.body.clientHeight - 350
      },

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
          this.cidStr = this.classIdsArr
          // 获取动态表头
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },400)
        })
      },

      handelSearch(){
        // 设置搜索
        this.parameter.placing = this.placing
        this.parameter.type = this.type
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
        this.$store.dispatch('ranking/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        const {step,type,placing} = this.parameter
        window.open(`${this.URL.ExportPlacingSegment}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}&step=${step}&type=${type}&placing=${placing}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      },

      handelRanking(val){
        this.type = val
        this.parameter.type = val
        this.$nextTick(()=>{
          this.getTable()
        })
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .ranking{

    .search_left{
      display: flex;
      width: 620px !important;

      .indent_model{
        margin-top: -2px;
      }

      .ranking_title{
        width: 80px;
      }

      .hj-select {
        width: 55px;
        margin-left: 5px;

        .el-input__inner{
          padding-right: 20px;
        }
      }
    }
    .el-input--medium .el-input__inner{
      text-align: left;
      text-indent: 0.6em !important;
    }
  }
</style>