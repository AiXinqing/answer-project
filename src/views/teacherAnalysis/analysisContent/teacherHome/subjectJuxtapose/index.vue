<template>
  <div class="overall_overview">
    <div class="title_name">
      <span>学科等级分布</span>
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

    <!-- 弹出框 -->
    <subject-detail
      ref="subjectDetail"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import subjectDetail from './_subjectDetail'
  export default {

    components: {
      subjectDetail,
    },

    data() {
      return {
        parameter:{
          tid: '',
          tsid: '',
          cid: '',
          url:this.URL.GetClassScoreLvlAnalysis
        },
        tableColumn:[
          {
            prop:'lvlName',
            label:'等级',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'scaleRange',
            label:'得分率区间',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'classNum',
            label:'班级人数',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'gradeNum',
            label:'年级人数',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'scale',
            label:'占比',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            label:'操作',
            minWidth:'120',
            align:'center',
            fixed:'left',
            type:'operateBtn',
            btnList:[
              {
                label:'查看班级详情',
                handle: row => {
                  const {tid,tsid,cid} = this.parameter
                  let obj = {
                    ...row,
                    tid: tid,
                    tsid: tsid,
                    cid: cid,
                  }

                  this.hanldePopFunc(obj)
                }
              }
            ]
          }
        ]
      }
    },

    computed: {
      ...mapState('getExam',['tableLoading']),
      ...mapState('subjectJuxtapose',['TableList']),

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{

          return {
          asid: item.asid,
          cid: item.classNum,
          classNum: `${item.classNum}`,
          gradeNum: `${item.gradeNum}`,
          lvlName: item.lvlName,
          scale: item.scale,
          scaleRange: item.scaleRange,
          scoreRange: item.scoreRange,
          tsid: item.tsid,
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
          this.$store.dispatch('subjectJuxtapose/getSubjectJuxtapose', this.parameter)
        })
      },

      hanldePopFunc(row){
        this.$refs.subjectDetail.openDetails(row)
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
      margin:0 10px 10px 10px;
    }
  }
</style>