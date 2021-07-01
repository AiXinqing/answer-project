<template>
  <div class="total_score">
    <div class="title_box">
      <div class="title_left">
        <span>待提高学生人数分布: </span>
        <span class="top_b">年级后</span>
        <el-input
          type="number"
          v-model="afterRank"
          placeholder="30"
          class="rank_style"
        />
        <span>名</span>
        <exam-button
          type="primary"
          class="left_modify"
          @click="handelAfterDetermine"
        >确定</exam-button>
      </div>
      <div class="title_right">
        <exam-button type="primary" @click="afterDownTable">下载表格</exam-button>
      </div>
    </div>
    <div class="el_table_wapper">
      <exam-table
        :tablecols="afterTableColumn"
        :tableData="afterTableData"
        :isIndex="false"
        :isPagination="false"
        :autoHeight="true"
        :loading="tableLoading"
      />
    </div>
    <student-details
      ref="studentDetails"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import studentDetails from './_details'
  export default {
    components: {
      studentDetails
    },
    props: {
      prmTid: {
        type: String,
        default: ''
      },
    },

    data() {
      return {
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          }
        ],
        columnMultiLine:[
          {
            prop:'num',
            label:'人数',
            width:'85',
            align:'center',
            type:'Html'
          },
          {
            prop:'avgScoreString',
            label:'平均分',
            width:'90',
            align:'center',
            type:'Html'
          }
        ],

        afterRank:10,
        afterParameter:{ // 前
          tid: '',
          type:'after',
          rank:10,
          url:this.URL.GetClassScoreRankNum
        },

      }
    },

    computed: {
      ...mapState('afterExcellentGrade', ['headerTable','TableList','tableLoading']),

      afterTableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.sname,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              let obj = {}
              if(item.prop == 'num'){
                obj = {
                  ...obj,
                  btnList:[
                    {
                      label:'',
                      handle: (row,element) => {
                        let obj = {
                          tid:this.prmTid,
                          cid:row.cid,
                          tsid:ele.tsid,
                          type:'after',
                          rank:this.afterParameter.rank
                        }
                        // 详情数值为0时不弹出详情框
                        if(row[element.prop] != 0){
                          this.hanldePopFunc(obj)
                        }

                      }
                    }
                  ]
                }
              }
              return {
                ...item,
                ...obj,
                prop:`${item.prop}_${ele.sname}`,
                type: item.prop == 'num' ? 'pop_Btn' : 'Html',
                label:item.label,
                width:item.width,
                align:item.align,
              }
            }),
          }))
        ] : []
      },

      afterTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`num_${item.sname}`]: item.num  == '' ? null : item.num,
              [`avgScoreString_${item.sname}`]: item.avgScoreString == '' ? null : item.avgScoreString,
              sname: item.sname,
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      if(this.prmTid != ''){
        this.afterParameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      getTable() {
        // 获取table
        this.$store.dispatch('afterExcellentGrade/GetStuResults', this.afterParameter)
      },

      afterDownTable() {
        // 下载表格
        const {tid,type,rank} = this.afterParameter
        window.open(`${this.URL.ExportClassScoreRankNum}?tid=${tid}&type=${type}&rank=${rank}`)
      },

      handelAfterDetermine(){

        this.afterParameter.rank = this.afterRank

        this.$nextTick(()=>{
          this.getTable()
        })
      },

      hanldePopFunc(row){
        this.$refs.studentDetails.openDetails(row)
      }

    },
  }
</script>

<style lang="less" >

</style>