<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>总分分布</span>
      </div>
    </div>

    <div class="charts_wapper">
      <div class="charts_left">
        <lineCharts
          :title-name="'学科平均分排名'"
          :is-label="true"
          :unit="''"
          :chart-data="chartData"
        />
      </div>
      <div class="charts_table">
        <div
          class="table_list"
          v-for="(item,i) in TableList"
          :key="i"
        >
          <div class="table_list_left">{{item.name}}分区间</div>
          <div class="table_list_center">{{item.peopleNum}}</div>
          <div class="table_list_right">人</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import lineCharts from './_lineCharts'
  export default {
    components: {
      lineCharts,
    },
    props: {
      prmTid: {
        type: String,
        default: ''
      },
    },

    data() {
      return {

        tsid:0,
        parameter:{
          tid: '',
          url:this.URL.GetTotalScoreDistribution
        },
        theight:0
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading']),
      ...mapState('totalScoreDistributed', ['TableList']),

      chartData(){
        return this.TableList.length ? {
          columns:['区间', '全体'],
          rows:this.TableList.map(element =>({
                      '区间': element.name,
                      '全体': element.peopleNum
                    }))
        } : {}
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
        this.$store.dispatch('totalScoreDistributed/GetStuResults', this.parameter)
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .charts_box{
    display: flex;

    .charts_item{
      flex-shrink:1;
      width: 359px;
      margin-left: 29px;
      text-align: center;
      border-radius: 4px;
      border: 1px solid @font-dcd;
      padding: 20px 0;
      margin-top: 13px;
      background-color: @bc_f5;

      p{
        padding: 0 0;
        margin: 0 0;
        height: 30px;
        line-height: 30px;
      }

      .p1{
        font-size: 26px;
        font-weight: 600
      }

      .p2{
        font-size: 14px;
      }

      .max_style{
        color: @main
      }

      .min_style{
        color: @warning
      }

      .average_style{
        color: @average
      }
    }
  }
  .charts_wapper{
    display: flex;
    margin: 20px 0;

    .charts_left{
      width: 872px;
    }

    .charts_table{
      width: 273px;
      box-shadow: -7px 4px 16px -2px rgba(187,184,184,0.63);
      -webkit-box-shadow: -7px 4px 16px -2px rgba(187,184,184,0.63);
      -moz-box-shadow: -7px 4px 16px -2px rgba(187,184,184,0.63);
      border-radius: 4px;
      background-color: @white;
      margin-right: 32px;
      margin-left: 30px;
      height: 360px;
      margin-top: 20px;
      overflow: auto;
      padding: 10px 0 15px 0;
    }
  }
  .table_list{
    display: flex;
    border-bottom: 1px dashed @bc_c0c;
    line-height: 40px;
    margin: 0 15px;
    font-size: 14px;

    .table_list_left {
      width: 150px;
    }

    .table_list_center {
      width: 70px;
    }
  }
</style>

<style lang="less" scoped>

</style>

