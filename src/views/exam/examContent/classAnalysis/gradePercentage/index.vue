<template>
  <!-- 学科等级占比 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>各等级人数占比比较</span>
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
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],

        tsid:0,
        parameter:{
          tid: '',
          tsid:'',
          url:this.URL.GetClassScoreScaleNum
        },
        maxHeight: document.body.clientHeight - 200
      }
    },

    computed: {
      ...mapState('gradePercentage', ['tableLoading','headerTable','TableList']),

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
    width:82.5%;
  }
  .search_right{
    display:flex;

    .search_select{
      margin-right:10px;
    }
  }
</style>

<style lang="less">
  .search_style{
    width:80px;

    .hj-select{
      width:80px;
    }
  }
</style>


