<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>学科分档上线情况</span>
        <span class="font_12">运用大数据算法将总分的分档分数精确的分解到各学科中, 得出各学科的分档分数线。 各学科分档上线人数分布, 可反映出全体学生在各学科的上线情况。</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">各班级的上线情况见下表</div>
        <div class="title_right">
          <exam-button type="primary" @click="basisDownTable">下载表格</exam-button>
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
            prop:'cumulativeNum',
            label:'累计人数',
            minWidth:'90',
            align:'center',
            type:'Html'
          },
          {
            prop:'cumulativeRate',
            label:'累计上线率',
            minWidth:'90',
            align:'center',
            type:'Html'
          }
        ],

        parameter:{ // 总分上档线分析
          tid: '',
          url:this.URL.GetClassTotalScoreLine
        },

      }
    },

    computed: {
      ...mapState('binningAnalysis', ['tableLoading','TableList',
      'headerTable','binningData','parameterInfo']),
    
      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:`${ele.name}(${ele.score})`,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {
                type:'Html'
              }
              if(item.prop == 'num' || item.prop == 'cumulativeNum'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,ele) => {
                        let obj = {
                          tid:ele.tid,
                          lineName:ele.lineName,
                          cid:row.cid,
                          type:item.prop == 'num' ? 0 : 1,
                          tsid:ele.tsid
                        }
                       this.hanldePopFunc(obj)
                      }
                    }
                  ]
                }
              }
              return {
                ...item,
                prop:`${item.prop}_${ele.name}`,
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
              [`num_${item.name}`]: item.num == '' ? null : item.num,
              [`cumulativeNum_${item.name}`]: item.cumulativeNum == '' ? null : item.cumulativeNum ,
              [`cumulativeRate_${item.name}`]: item.cumulativeScale == '' ? null : item.cumulativeScale ,
              sname: item.sname,
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
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      getTable() {
        // 获取table
        this.$store.dispatch('binningAnalysis/GetStuResults', this.parameter)
      },

      basisDownTable(){
        // 下载表格
        const {tid} = this.parameter
        window.open(`${this.URL.ExportClassTotalScoreLine}?tid=${tid}`)
      },

      setBinParameter(){// 设置分档参数
        this.$refs.binningBullet.openFrame(this.binningData)
      },

      changeSetBinningBullet(){
        this.getTable()
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }
    },
  }
</script>

<style lang="less">
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
</style>


