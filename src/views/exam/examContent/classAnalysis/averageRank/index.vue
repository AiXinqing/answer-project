<template>
  <!-- 学科平均分排名 -->
  <div class="average_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>学科平均分排名</span>
      </div>
      <div class="search_right">
        <div class="search_select search_style" style="margin-left:10px;">
          <hj-select
            :items="options"
            size="mini"
            :value="tsid"
            @change="handelChange"
          ></hj-select>
        </div>
      </div>
    </div>

    <singleLine
      :title-name="'学科平均分排名'"
      :is-label="true"
      :unit="''"
      :chart-data="chartData"
    />
  </div>
</template>

<script>

  import singleLine from './_singleLine'
  import { mapState , mapGetters} from 'vuex'
  export default {
    components: {
      singleLine,
    },

    props: {
      prmTid: {
        type: String,
        default: ''
      },

      subjectsArr:{
        type: Array,
        default:()=>[]
      }
    },

    data() {
      return {
        tsid:0,
        tsidName:'',
        parameter:{
          tid: '',
          tsid:'',
          url:this.URL.GetClassAvgScore
        },
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading']),
      ...mapGetters('getClassAvgScore', ['echartsData']),

      subjects(){
        return this.subjectsArr.length ? this.subjectsArr.filter(item => item.tsid != "totalScore" ) : []
      },

      options(){
        return this.subjects.length ? this.subjects.map(item => ({
          label:item.sname,
          value:item.tsid,
        })) : []
      },

      chartData(){
        let name = this.tsidName
        return this.echartsData.length ? {
          columns:['班级', this.tsidName],
          rows:this.echartsData.filter(item => item.cid !="all")
                    .map(element =>({
                      '班级': element.cname,
                      [name]: element.avgScore
                    }))
        } : {}
      }
    },

    watch: {
      subjectsArr: {
        immediate: true,
        handler () {
          this.tsid = this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 1).tsid : 0
          this.tsidName = this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 1).sname : ''
          if(this.tsid != 0){
            this.$nextTick(() => {
              this.parameter.tsid = this.tsid
              this.getTable()
            })
          }
        },
      },
    },

    mounted () {
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
      }
    },

    methods: {

      handelChange(val){
        this.parameter.tsid = val
        this.tsid = val
        this.tsidName = this.subjectsArr.find((element) => element.tsid == val).sname
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('getClassAvgScore/GetStuResults', this.parameter)
      },
    },

  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .average_content{
    min-height: 450px;
    background-color: @white;
    border-radius: 4px;
    padding-top: 20px;
  }

  .card_contetn{
    display:flex;

    .card_item{
      width: 90%;
    }
    .search_right{
      margin-top: 5px;
    }
  }

  .card_item{

    line-height: 35px;
    height: 35px;
    font-size: 18px;

    i{
      width: 4px;
      border-radius: 3px;
      height: 22px;
      background-color: @main;
      display: inline-block;
      position: relative;
      top: 4px;
      margin-left: 30px;
    }

    span{
      margin-left: 10px;
    }
  }
</style>