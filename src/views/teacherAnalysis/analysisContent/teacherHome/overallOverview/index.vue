<template>
  <div class="overall_overview">
    <div class="title_name">
      <span>整体概况</span>
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
            prop:'cname',
            label:'应考人数',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'实考人数',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'平均分/满分',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'cname',
            label:'最高/最低分',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          }
        ]
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading']),
      ...mapState('profileInfo', ['headerTable','TableList']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele.subname,
            align:'center',
            prop: `num_${ele.subname}`,
            type:'Html',
            sortable:true,
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              ...element,
              [`num_${element.name}`]:element.num,
            }
          })

          return {
            avgScore: item.avgScore,
            avgScoreRate: item.avgScoreRate,
            cid: item.cid,
            cname: item.cname,
            fullScore: item.fullScore,
            maxScore: item.maxScore,
            minScore: item.minScore,
            rank: item.rank,
            rankTopNum: item.rankTopNum,
            referenceNumber: item.referenceNumber,
            teacher: item.teacher,
            ...dynamic
          }
        }) : []
      }
    },

    methods: {
      initTable(obj) {
        this.parameter = {
          ...this.parameter,
          ...obj
        }

        this.$nextTick(()=>{
          this.$store.dispatch('profileInfo/getProfileInfo', this.parameter)
        })
      }
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
      margin:0 10px;
    }
  }
</style>