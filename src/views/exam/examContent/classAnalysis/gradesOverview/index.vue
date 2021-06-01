<template>
  <!-- 班级成绩概况 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>班级成绩概况</span>
      </div>
      <div class="search_right">
        <exam-button type="primary" @click="downTable">下载表格</exam-button>
      </div>
    </div>
    <div class="el_table_wapper">
      <exam-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :isPagination="false"
        :theight="theight"
        :loading="tableLoading"
      ></exam-table>
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
            type:'Html',
          }
        ],
        rankArr:[
          {
            prop:'maxScore',
            label:'最高分',
            width:'90',
            align:'center',
          },
          {
            prop:'minScore',
            label:'最低分',
            width:'90',
            align:'center',
          },
          {
            prop:'avgScore',
            label:'平均分',
            width:'90',
            align:'center',
          },
          {
            prop:'referenceNumber',
            label:'考试人数',
            width:'90',
            align:'center',
          },
        ],
        parameter:{
          tid: '',
          url:this.URL.GetClassScoreSurvey
        },
        theight:0,
      }
    },

    computed: {
      ...mapState('gradesOverview', ['tableLoading','headerTable','TableList',]),

      tableColumn(){
        // 动态表头

        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.sname,
            align:'center',
            childen:this.rankArr.map((item) =>{
              return {
                ...ele,
                ...item,
                label:item.label,
                type:'Html',
                prop:`${item.prop}_${ele.sname}`,
                tid:this.prmTid
              }
            })
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`maxScore_${element.sname}`]:element.maxScore,
              [`minScore_${element.sname}`]:element.minScore,
              [`avgScore_${element.sname}`]:element.avgScore,
              [`referenceNumber_${element.sname}`]:element.referenceNumber,
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

    methods:{

      downTable(){
        // 下载表格
        const {tid} = this.parameter
        window.open(`${this.URL.ExportClassScoreSurvey}?tid=${tid}`)
      },

      getTable() {
        // 获取table
        this.$store.dispatch('gradesOverview/GetStuResults', this.parameter)
      },
    }
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .class_content{
    min-height: 450px;
    background-color: @white;
    padding-bottom: 10px;

    .el_table_wapper{
      margin: 15px 30px 20px 30px
    }

    .card_item,
    .search_right{
      margin-top:20px;
    }
  }
</style>