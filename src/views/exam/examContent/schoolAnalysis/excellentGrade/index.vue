<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>优秀生学困生</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">
          <span>优秀学生人数分布: </span>
          <span class="top_b">年级前</span>
          <el-input
            type="number"
            v-model="topRank"
            placeholder="30"
            class="rank_style"
          />
          <span>名</span>
          <exam-button
            type="primary"
            class="left_modify"
            @click="handelTopDetermine"
          >确定</exam-button>
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
          :maxHeight="maxHeight"
        />
      </div>
    </div>

    <after-excellent-grade
      :prmTid="prmTid"
    />

    <student-details
      ref="studentDetails"
    />

  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import afterExcellentGrade from './afterExcellentGrade'
  import studentDetails from './_details'
  export default {

    components: {
      afterExcellentGrade,
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
            prop:'avgScoreString',
            label:'平均分',
            minWidth:'90',
            align:'center',
            type:'Html'
          }
        ],

        tsid:0,
        topRank:10,
        parameter:{ // 前
          tid: '',
          type:'top',
          rank:10,
          url:this.URL.GetClassScoreRankNum
        },
        maxHeight: document.body.clientHeight - 200

      }
    },

    computed: {
      ...mapState('excellentGrade', ['tableLoading','headerTable','TableList']),

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
                          tsid:ele.tsid,
                          type:'top',
                          rank:this.parameter.rank
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
              [`num_${item.sname}`]: item.num == '' ? null : item.num,
              [`avgScoreString_${item.sname}`]: item.avgScoreString == '' ? null : item.avgScoreString ,
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

      getTable() {
        // 获取table
        this.$store.dispatch('excellentGrade/GetStuResults', this.parameter)
      },

      downTable() {
        // 下载表格
        const {tid,type,rank} = this.parameter
        window.open(`${this.URL.ExportClassScoreRankNum}?tid=${tid}&type=${type}&rank=${rank}`)
      },

      handelTopDetermine(){

        this.parameter.rank = this.topRank

        this.$nextTick(()=>{
          this.getTable()
        })
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .title_box{
    display: flex;
    justify-content:space-between;

    .title_left{
      font-size: 14px;
      line-height: 30px;
      text-indent: 2em;
    }

    .title_right{
      margin-right: 32px;
    }
  }

  .top_b{
    margin-left: 20px;
  }

  .rank_style{
    width: 60px !important;
    font-size: 14px !important;
    text-indent:0;
    margin: 0 10px;
  }
  .el-table__body-wrapper.is-scrolling-left+div.el-table__fixed{
    height: calc(100% - 15px) !important;
  }
</style>


