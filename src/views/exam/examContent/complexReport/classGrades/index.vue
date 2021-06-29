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
        <div class="search_left is_active">
          <span class="scoring_rate">
            <span>得分率说明：</span>
            <span 
              v-for="item in headerTable"
              :key="item.tid"
            >
            {{item.subname}}: {{item.substart}} - {{item.subend}}
            </span>
            <span  class="set_parameter" @click="setParameterFunc" >设置参数</span>
          </span>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <umy-table
          :tablecols="classTableColumn"
          :tableData="classTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :single-height="50"
          :loading="tableLoading"
          @hanlde-pop-func="hanldePopFunc"
        />
      </div>
    </div>

    <student-details
      ref="studentDetails"
    />
    <parameter-settings
      ref="parameterSet"
      @change-set="changeSet"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_classDetails'
  import parameterSettings from './_parameterSettings'
  export default {
    components: {
      studentDetails,
      parameterSettings
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
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'teacher',
            label:'班主任',
            width:'90',
            align:'center',
            type:'Text',
            fixed:'left',
            color:'font'
          },
          {
            prop:'maxScore',
            label:'最高分',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'minScore',
            label:'最低分',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            label:'平均分',
            align:'center',
            childen:[
              {
                prop:'avgScore',
                label:'平均分',
                width:'90',
                align:'center',
                type:'Html'
              },
              {
                prop:'avgScoreRate',
                label:'平均得分率',
                width:'100',
                align:'center',
                type:'Html'
              },
              {
                prop:'rank',
                label:'排名',
                width:'90',
                align:'center',
                type:'Html'
              }
            ]
          }
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
            label:'率',
            minWidth:'90',
            align:'center',
          },
          {
            prop:'rank',
            label:'排名',
            minWidth:'90',
            align:'center',
          },
        ],

        // 参数
        tsid:'',
        cidStr:'',
        theight: document.body.clientHeight - 280 || 0,
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          url:this.URL.GetClassScoreContrast
        },
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapState('classGrades', ['tableLoading','headerTable','TableList']),

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

      classTableColumn(){
        // 动态表头
        let tsid_s = this.subjectsArr.find((element,i) => i == 0).tsid
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map((item,index) =>{
              let obj = {
                type:'Html'
              }
              return {
                ...ele,
                ...item,
                label:index != this.rankArr.length ? `${ele.subname}${item.label}` : item.label,
                ...obj,
                type: item.prop == 'num' ? 'popBtn' : 'Html',
                prop:`${item.prop}_${ele.subname}`,
                tsid:this.tsid == '' ? tsid_s : this.tsid,
              }
            })
          }))
        ] : []
      },

      classTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              [`num_${element.name}`]:element.num,
              [`scale_${element.name}`]:element.scale,
              [`rank_${element.name}`]:element.rank,
              scoreRange: element.scoreRange
            }
          })

          return {
            avgScore: item.avgScore,
            avgScoreRate: item.avgScoreRate,
            cid: item.cid,
            cname: item.cname,
            maxScore: item.maxScore,
            minScore: item.minScore,
            rank: item.rank,
            referenceNumber: item.referenceNumber,
            teacher: item.teacher,
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
          let _$this = this
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
          this.theight = document.body.clientHeight - 208 - height // 258 = 页面高度 - height  除条件以外的高度
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
        this.$store.dispatch('classGrades/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        window.open(`${this.URL.ExportClassScoreContrast}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      },

      setParameterFunc(){
        
        let subject = ''
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          subject = '总分'
        }else{
          subject = this.subjectsArr.filter(element => element.tsid == this.tsid)[0].name
        }
        
        let obj = {
          parameter:{
            tid: this.prmTid,
            tsid:this.tsid,
            type:this.tsid == 'totalScore' ? 2 : 1,
            url:this.URL.GetASAnalyseSettingList
          },
          subject:subject
        }
        
        this.$refs.parameterSet.openFrame(obj)
      },

      changeSet(){
        // 保存得分率后更新数据
        this.getTable()
      }

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .table_wapper{
    .search_left{
      &.is_active{
        width: calc(100% - 120px);
        font-size: 14px;
        color: @font-666;
        span{
          display: block;
          width: 100%;
        }
      }
    }
    .el_table_wapper{
      margin-top: 10px;
    }
    .set_parameter{
      color: @main;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .scoring_rate{
    display: flex !important;
    span {
      height: 28px;
      width: auto !important;
      margin-right: 10px;
    }
  }
</style>