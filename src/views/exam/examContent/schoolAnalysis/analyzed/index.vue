<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>总体情况汇总分析</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">总分基本情况成绩分析</div>
        <!-- <div class="title_right">
          <exam-button type="primary" @click="totalScoreDownTable">下载表格</exam-button>
        </div> -->
      </div>
      <div class="el_table_wapper">
        <exam-table
          :tablecols="totalHeader"
          :tableData="TotalTable"
          :isIndex="false"
          :isPagination="false"
          :autoHeight="true"
          :loading="tableLoading"
        />
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">各学科基本数据对比情况</div>
        <div class="title_right">
          <exam-button type="primary" @click="basisDownTable">下载表格</exam-button>
        </div>
        </div>
        <div class="el_table_wapper">
          <exam-table
            :tablecols="fixedHeader"
            :tableData="TableList"
            :isIndex="false"
            :isPagination="false"
            :theight="theight"
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
        totalHeader:[
          {
            prop:'referenceNumber',
            label:'参考总人数',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html',
          },
          {
            prop:'classNum',
            label:'班级数',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'fullScore',
            label:'满分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'maxScore',
            label:'最高分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'minScore',
            label:'最低分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'avgScore',
            label:'平均分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'stdDeviation',
            label:'标准差',
            minWidth:'120',
            align:'center',
            type:'Html',
          }
        ],

        fixedHeader:[
          {
            prop:'sname',
            label:'学科',
            minWidth:'80',
            align:'center',
            fixed:'left',
            type:'Html',
          },
          {
            prop:'referenceNumber',
            label:'参考总人数',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'fullScore',
            label:'满分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'maxScore',
            label:'最高分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'minScore',
            label:'最低分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'avgScore',
            label:'平均分',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'stdDeviation',
            label:'标准差',
            minWidth:'120',
            align:'center',
            type:'Html',
          },
          {
            prop:'difficulty',
            label:'难度',
            minWidth:'120',
            align:'center',
            type:'Html',
          }
        ],

        tsid:0,
        parameter:{
          tid: '',
          url:this.URL.GetSubjectScoreContrast
        },
        totalParameter:{
          tid: '',
          url:this.URL.GetTotalScoreSituation
        }
      }
    },

    computed: {
      ...mapState('analyzed', ['tableLoading','TableList','TotalTable']),
    },

    mounted () {
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.totalParameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      getTable() {
        // 获取table
        this.$store.dispatch('analyzed/GetStuResults', this.parameter)
        this.$store.dispatch('analyzed/getTotalScoreResults', this.totalParameter)
      },

      basisDownTable(){
        // 下载表格
        const {tid} = this.parameter
        window.open(`${this.URL.ExportSubjectScoreContrast}?tid=${tid}`)
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
</style>

<style lang="less" scoped>

</style>

