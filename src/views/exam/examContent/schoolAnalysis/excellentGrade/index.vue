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
        />
      </div>
    </div>

    <after-excellent-grade
      :prmTid="prmTid"
    />

  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import afterExcellentGrade from './afterExcellentGrade'
  export default {

    components: {
      afterExcellentGrade,
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
            width:'85',
            align:'center',
            type:'Html'
          },
          {
            prop:'avgScoreString',
            label:'平均分',
            width:'90',
            align:'center',
            type:'Html'
          }
        ],

        tsid:0,
        topRank:50,
        parameter:{ // 前
          tid: '',
          type:'top',
          rank:50,
          url:this.URL.GetClassScoreRankNum
        },

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
              return {
                ...item,
                prop:`${item.prop}_${ele.sname}`,
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
</style>


