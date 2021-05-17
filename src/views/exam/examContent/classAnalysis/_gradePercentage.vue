<template>
  <!-- 学科等级占比 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>各等级人数占比比较</span>
      </div>
      <div class="search_right">
        <div class="search_select">
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
            prop:'cname',
            label:'班级',
            minWidth:'140',
            align:'center',
            fixed:'left',
            type:'Html',
            sortable:true,
          }
        ],

        tsid:0,
        parameter:{
          tid: '',
          tsid:'',
          url:this.URL.GetClassScoreScaleNum
        },
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading']),
      ...mapState('gradePercentage', ['headerTable','TableList']),

      subjects(){
        return this.subjectsArr.length ? this.subjectsArr.filter(item => item.tsid != "totalScore" ) : []
      },

      options(){
        return this.subjects.length ? this.subjects.map(item => ({
          label:item.sname,
          value:item.tsid,
        })) : []
      }
    },

    watch: {
      subjectsArr: {
        immediate: true,
        handler () {
          this.tsid = this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 1).tsid :0
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
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('gradePercentage/GetStuResults', this.parameter)
      },

      downTable() {
        // 下载表格
        const {tid,tsid} = this.parameter
        window.open(`${this.URL.ExportClassScoreScaleNum}?tid=${tid}&tsid=${tsid}`)
      }
    },
  }
</script>

<style lang="less" scoped>
  .card_item{
    width:78%;
  }
  .search_right{
    display:flex;

    .search_select{
      margin-right:10px;
    }
  }
</style>

