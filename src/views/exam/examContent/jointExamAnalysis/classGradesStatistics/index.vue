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
          <hj-input class="indent_model" style="width:60px;" type="number" v-model="stepVal" @keyup.native="proving($event)" />
          <span class="titile_14"> 分/段</span>

          <exam-button type="primary" class="grades_btn" @click="handelScoreInterval">确定</exam-button>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper" >
        <exam-table
          :tablecols="gradersTableColumn"
          :tableData="gradersTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :single-height="20"
          :loading="tableLoading"
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
        differenceHeight: -10,
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
        stepVal:100,
        tsid:'',
        scidsStr:'',
        theight: document.body.clientHeight - 340 || 0,
        parameter:{
          scids:'',
          tid: '',
          tsid:'',
          step:100,
          type: 0, //统计类型：0:分段统计，1：累计统计
          url:this.URL.GetJointExamClassScoreSegment
        },
        type: 0
      }
    },
    computed: {
      ...mapState('getExam', ['subjectsArr']),
      ...mapState('jointExams', ['schoolArr']),
      ...mapState('classGradesStatistics', ['tableLoading','headerTable','TableList']),

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
              let obj = {
                type:'Html'
              }
              if(item.prop == 'num'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,element) => {
                        const {scids} = this.parameter
                        let obj = {
                          cid:row.cid,
                          tid:element.tid,
                          tsid:element.tsid,
                          scids: scids,
                          segmentName:element.p_name,
                          step:this.parameter.step,
                          type:this.type
                        }
                        // 详情数值为0时不弹出详情框
                        if(row[element.prop] != 0 && row[element.prop] != null){
                          this.hanldePopFunc(obj)
                        }
                      }
                    }
                  ]
                }
              }
              return {
                ...item,
                label:item.label,
                ...obj,
                type: index == 0 ? 'pop_Btn' : 'Html',
                prop:`${item.prop}_${ele}`,
                p_name:ele,
                p_step:this.parameter.step,
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
            cname:item.cname,
            scname: item.scname,
            referenceNumber: item.referenceNumber,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 340
      })
    },

    watch: {
      schoolIdsArr: {
        immediate: true,
        handler () {
          this.scidsStr = this.schoolIdsArr
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
          this.stepVal = 100
          this.parameter.step = Number(this.stepVal)
          // 班级数组
          this.scidsStr = this.schoolIdsArr
          // 获取动态表头
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        if(this.tsid !="totalScore"){
          this.stepVal = 20
        }else{
          this.stepVal = 100
        }
        this.parameter.step = Number(this.stepVal)
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handelScoreInterval(){
        //分数区间
        this.parameter.step = Number(this.stepVal)
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

      handleCheckAllChange(scidsStr){
        // 条件查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          this.stepVal = 100
        }
        this.parameter.step = Number(this.stepVal)
        this.scidsStr = scidsStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.parameter = {
          ...this.parameter,
          scids:this.scidsStr,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.$store.dispatch('classGradesStatistics/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          this.stepVal = 100
        }
        window.open(`${this.URL.ExportJointExamClassScoreSegment}?tid=${this.prmTid}&tsid=${this.tsid}&scids=${this.scidsStr}&step=${this.stepVal}&type=${this.type}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';

</style>