<template>
  <!-- 学科试题得分率 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>班级成绩概况</span>
      </div>
      <div class="search_right">
        <div class="search_select">
          <hj-select
            :items="options"
            size="mini"
            :value="tsid"
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

        tsid:'5350',
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
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
          if(this.tsid != ''){
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

      getTable() {
        // 获取table
        this.$store.dispatch('gradePercentage/GetStuResults', this.parameter)
      },

      downTable() {

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