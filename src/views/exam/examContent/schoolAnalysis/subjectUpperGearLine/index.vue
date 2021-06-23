<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>学科分档上线情况</span>
        <span class="font_12">运用大数据算法将总分的分档分数精确的分解到各学科中, 得出各学科的分档分数线。 各学科分档上线人数分布, 可反映出全体学生在各学科的上线情况。</span>
      </div>
      <div class="card_box">
        <span>学科分档上线人数分布</span>
        <div class="font_12">对每个档次而言, 学科提供的上线人数越多, 可以视为该学科对总分上线提供了更大的可能性， 促进作用大。反之，学科上线人数越少，该学科对总分
        上线提供的促进作用较小。下面各表分别显示各个学科的上线人数：</div>
      </div>
    </div>

    <div class="total_score">
      <div class="tabs_box">
        <div
          v-for="(item, i) in binningData"
          :key="i"
          @click="changeActiveName(item.name)"
          :class="{'active':activeName == item.name}"
        >
          {{item.name}}上线人数分布
        </div>
      </div>
      <exam-button class="basisDown_style" type="primary" @click="downTable">下载表格</exam-button>

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
    <student-details
      ref="studentDetails"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_details'
  export default {
    components: {
      studentDetails
    },

    props: {
      prmTid: {
        type: String,
        default: ''
      },
    },

    data(){
      return{
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
            minWidth:'90',
            align:'center',
            type:'Html'
          },
          {
            prop:'cumulativeNum',
            label:'累计人数',
            minWidth:'90',
            align:'center',
            type:'Html'
          },
          {
            prop:'cumulativeRate',
            label:'累计上线率',
            minWidth:'120',
            align:'center',
            type:'Html'
          }
        ],

        parameter:{ // 总分上档线分析
          tid: '',
          lineName:'一档',
          url:this.URL.GetClassSubjectScoreLine
        },

        getBinLineParameter:{ //  获取上档线设置表格数据
          tid: '',
          url:this.URL.GetASAnalyseScoreLine
        },

        activeName:'一档'
      }
    },
    
    computed: {
      ...mapState('binningAnalysis', ['binningData']),
      ...mapState('subjectUpperGearLineState', ['tableLoading','TableList','headerTable']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:`${ele.sname}`,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {}
              if(item.prop == 'num' || item.prop == 'cumulativeNum'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,element) => {
                        let obj = {
                          tid:this.prmTid,
                          lineName:this.activeName,
                          cid:row.cid,
                          type:item.prop == 'num' ? 0 : 1,
                          tsid:row['tsid_'+ ele.sname]
                        }

                        this.hanldePopFunc(obj)
                      }
                    }
                  ]
                }
              }
              return {
                ...item,
                ...obj,
                prop:`${item.prop}_${ele.sname}`,
                type: item.prop == 'num' || item.prop == 'cumulativeNum' ? 'pop_Btn' : 'Html',
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
              [`num_${item.sname}`]: item.num == '' ? null : item.num,
              [`cumulativeNum_${item.sname}`]: item.cumulativeNum == '' ? null : item.cumulativeNum ,
              [`cumulativeRate_${item.sname}`]: item.cumulativeScale == '' ? null : item.cumulativeScale ,
              sname: item.sname,
              [`tsid_${item.sname}`]:item.tsid
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

    mounted (){
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.getBinLineParameter.tid = this.prmTid
        this.getTable()
        this.getBinLineParameterFunc()
      }
    },
    
    methods:{
      changeActiveName(name){
        this.activeName = name
        this.parameter.lineName = name
        this.getTable()
      },

      getTable() {
        // 获取table
        this.$store.dispatch('subjectUpperGearLineState/GetStuResults', this.parameter)
      },

      getBinLineParameterFunc(){
        this.$store.dispatch('binningAnalysis/getUpperGearLine', this.getBinLineParameter)
      },

      downTable(){
        const {tid,lineName} = this.parameter
        window.open(`${this.URL.ExportClassSubjectScoreLine}?tid=${tid}&lineName=${lineName}`)
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    }
    
  }
</script>

<style lang="less" >
  @import '~@/assets/css/variables.less';
  .binning_box{
    background-color: @main;
    color: @white;
    position: relative;
    width: calc(100% - 90px);
    padding: 10px 15px;
    margin: 20px 0 20px 30px;
    .card_item{
      color: @white;
      margin-top: 10px;

      .font_12{
        color: @white;
        &.binning_font{
          margin-left: 10px;
          font-size: 14px;
        }
      }
    
    }

    .binning_setting{
      position:absolute;
      top:20px;
      right:40px;
      
      .el-button--primary{
        background-color: @white !important;
        color:@font-888 !important;
      }
    }
  }

  .card_box {
    margin-left: 30px;
    margin-top: 10px;

    div.font_12 {
      font-size: 12px;
      margin-top: 10px;
      color: @font-909;
    }
  }

  .total_score {
    position: relative;

    .basisDown_style{
      position: absolute;
      right: 30px;
      top: 7px;
    }

    margin-top: 10px;
    .tabs_box {
      display: flex;
      color: #333;
      margin-left: 30px;

      >div {
        padding: 0 10px;
        font-size: 14px;
        line-height: 35px;
        border: 1px solid #999;
        border-right: none;
        cursor: pointer;
      }

      div.active {
        color: @main;
        border-bottom: none;
      }

      div:last-child{
        border-right: 1px solid #999;
        border-top-right-radius: 4px;
      }

      div:first-child{
        border-top-left-radius: 4px;
      }
    }
  }

</style>

<style lang="less" scoped>
  .card_contetn{
    display: initial;
  }
</style>