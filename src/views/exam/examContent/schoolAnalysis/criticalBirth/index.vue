<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>临界生分析</span>
        <span class="font_12">默认临界分为满分60%, 浮动分为满分5%, 即满分为100分, 则分数区间为55-65分</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left" style="margin:5px 0">
          <span>临界分: <span class="mr_10">{{criticalScale}}%</span> 浮动分: <span class="mr_10">{{floatScale}}%</span> </span>
          <exam-button
            type="primary"
            class="left_modify"
            @click="handelModify"
          >修改</exam-button>
        </div>
        <div class="title_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
        </div>
        <div class="el_table_wapper">
          <exam-table
            :tablecols="tableColumn"
            :tableData="tableData"
            :isIndex="false"
            :isPagination="false"
            :autoHeight="true"
            :loading="tableLoading"
          ></exam-table>
        </div>
    </div>
    <set-critical
      ref="setCritical"
      @change-set-critical="changeSetCritical"
    />
    <student-details
      ref="studentDetails"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import setCritical from './_setCritical'
  import studentDetails from './_details'
  export default {
    components: {
      setCritical,
      studentDetails
    },
    props: {
      prmTid: {
        type: String,
        default: ''
      },
    },

    data() {
      return {

        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          }
        ],
        columnMultiLine:[
          {
            prop:'num',
            label:'人数',
            minWidth:'85',
            align:'center',
            type:'Html'
          },
          {
            prop:'percentage',
            label:'占比',
            minWidth:'90',
            align:'center',
            type:'Html'
          }
        ],

        criticalScale:60,
        floatScale:5,
        parameter:{
          tid: '',
          criticalScale:60,
          floatScale:5,
          url:this.URL.GetClassSubjectScoreCriticalityNum
        }
      }
    },

    computed: {
      ...mapState('criticalBirth', ['tableLoading','TableList','headerTable']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.sname,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {}
              if(item.prop == 'num'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,element) => {
                        let obj = {
                          tid:this.prmTid,
                          cid:row.cid,
                          minScore:row[`minScore_${ele.sname}`],
                          maxScore:row[`maxScore_${ele.sname}`],
                          tsid:ele.tsid
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
                ...obj,
                prop:`${item.prop}_${ele.sname}`,
                type: item.prop == 'num' ? 'pop_Btn' : 'Html',
                label:item.label,
                width:item.width,
                align:item.align,
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
              [`num_${item.sname}`]: item.num,
              [`percentage_${item.sname}`]: item.scale,
              [`maxScore_${item.sname}`]:item.maxScore,
              [`minScore_${item.sname}`]:item.minScore,
              sname: item.sname,
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      changeSetCritical(obj){

        this.criticalScale = obj.criticalScale
        this.floatScale = obj.floatScale

        this.parameter = {
          ...this.parameter,
          ...obj
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('criticalBirth/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {tid,criticalScale,floatScale} = this.parameter
        window.open(`${this.URL.ExportClassSubjectScoreCriticalityNum}?tid=${tid}&criticalScale=${criticalScale}&floatScale=${floatScale}`)
      },

      handelModify(){
        this.$refs.setCritical.openFrame()
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .card_item{
    span.font_12{
      font-size: 12px;
      margin-left: 40px;
      color: @font-888
    }
  }
  .mr_10{
    margin: 0 5px 0 10px
  }
  .left_modify{
    display: inline-block;
    width: 60px;
    text-indent: 0;
    margin: 0 15px 0 10px;

    button.el-button.el-button--primary.el-button--medium{
      width: 60px;
    }
  }
</style>

<style lang="less" scoped>

</style>

