<template>
  <div class="overall_overview">
    <div class="title_name">
      <span>整体概况</span>
    </div>

    <div class="el_table_wapper">
      <exam-table
        :tablecols="tableColumn"
        :tableData="tableData"
        :isIndex="false"
        :isPagination="false"
        :autoHeight="true"
        :loading="tableLoading"
      ></exam-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        parameter:{
          tid: '',
          tsid: '',
          cid: '',
          url:this.URL.GetGeneralSituation
        },
        fixedHeader:[
          {
            prop:'cname',
            label:'范围',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'referenceNumber',
            label:'参考人数',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'avgScore',
            label:'平均分/满分',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'maxScore',
            label:'最高/最低分',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          }
        ],
        empty:false
      }
    },

    computed: {
      ...mapState('profileInfo',['tableLoading','headerTable','TableList']),
      ...mapState('questionAnalysis', ['classList']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length && this.classList.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `num_${ele.subname}`,
            type:'Html',
            minWidth:'120',
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length && this.classList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              ...item,
              [`num_${item.name}`]:item.num,
            }
          })

          return {
            avgScore: `${item.avgScore} / ${item.fullScore}`,
            avgScoreRate: item.avgScoreRate,
            cid: item.cid,
            cname: item.cname,
            fullScore: item.fullScore,
            maxScore: `${item.maxScore} / ${item.minScore}`,
            minScore: item.minScore,
            rank: item.rank,
            rankTopNum: item.rankTopNum,
            referenceNumber: `${item.referenceNumber}人`,
            teacher: item.teacher,
            ...dynamic,
          }
        }) : []
      }
    },

    methods: {

      initTable(obj) {
        this.empty = true
        this.parameter = {
          ...this.parameter,
          ...obj
        }

        this.$nextTick(()=>{
          if(this.classList.length){
            this.$store.dispatch('profileInfo/getProfileInfo', this.parameter)
          }
        })
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .overall_overview{
    background-color: @white;
    padding:20px 0;
    width: 100%;

    &>div{
      margin:0 15px 10px 15px;
    }
  }
</style>