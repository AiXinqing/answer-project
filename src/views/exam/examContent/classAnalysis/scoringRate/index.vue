<template>
  <!-- 学科试题得分率 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>学科试题得分率对比</span>
      </div>
      <div class="search_right">
        <div class="search_select search_style">
          <hj-select
            :items="options"
            size="mini"
            :value="tsid"
            @change="handelChange"
          ></hj-select>
        </div>
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

      subjectsArr:{
        type: Array,
        default:()=>[]
      }
    },

    data() {
      return {
        fixedHeader:[
          {
            prop:'name',
            label:'题号',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],

        rankArr:{
          prop:'cname',
          label:'最高分',
          minWidth:'140',
          align:'center',
          type:'Html',
        },

        tsid:0,
        parameter:{
          tid: '',
          tsid:'',
          url:this.URL.GetClassQuestionScoringRate
        },
        maxHeight: document.body.clientHeight - 200
      }
    },

    computed: {
      ...mapState('scoringRate', ['tableLoading','headerTable','TableList']),

      subjects(){
        return this.subjectsArr.length ? this.subjectsArr.filter(item => item.tsid != "totalScore" ) : []
      },

      options(){
        return this.subjects.length ? this.subjects.map(item => ({
          label:item.sname,
          value:item.tsid,
        })) : []
      },

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...this.rankArr,
            prop:`${this.rankArr.prop}_${ele.cname}`,
            label:ele.cname
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
              [`cname_${element.cname}`]:element.avgScoreScale,
            }
          })

          return {
            answer: item.answer,
            fullScore: item.fullScore,
            name: item.name,
            tqid: item.tqid,
            type: item.type,
            ...dynamic
          }
        }) : []
      }
    },

    watch: {
      subjectsArr: {
        immediate: true,
        handler () {
          this.tsid = this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 1).tsid :0
          if(this.tsid != 0){
            this.$nextTick(() => {
              if(this.parameter.tsid != this.tsid){
                this.parameter.tsid = this.tsid
                this.getTable()
              }
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
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('scoringRate/GetStuResults', this.parameter)
      },

      downTable() {
        const {tid,tsid} = this.parameter
        window.open(`${this.URL.ExportClassQuestionScoringRate}?tid=${tid}&tsid=${tsid}`)
      }
    },
  }
</script>

<style lang="less" scoped>
  .card_item{
    width:82.1%;
  }
  .search_right{
    display:flex;

    .search_select{
      margin-right:10px;
    }
  }
</style>