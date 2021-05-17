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
        <div class="title_right">
          <exam-button type="primary" @click="totalScoreDownTable">下载表格</exam-button>
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
            :tablecols="tableColumn"
            :tableData="tableData"
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
        theight:0
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
      },

      tableColumn(){
        // 动态表头

        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `scale_${ele.subname}`,
            type:'Html',
            sortable:true,
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
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
            avgScoreRate: item.avgScoreRate,
            cid: item.cid,
            cname: item.cname,
            maxScore: item.maxScore,
            minScore: item.minScore,
            rank: item.rank,
            referenceNumber: item.referenceNumber,
            teacher: item.teacher,
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

      totalScoreDownTable() {
        // 下载表格
        const {tid,tsid} = this.parameter
        window.open(`${this.URL.ExportClassScoreScaleNum}?tid=${tid}&tsid=${tsid}`)
      },

      basisDownTable(){
        // 下载表格
        const {tid,tsid} = this.parameter
        window.open(`${this.URL.ExportClassScoreScaleNum}?tid=${tid}&tsid=${tsid}`)
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

