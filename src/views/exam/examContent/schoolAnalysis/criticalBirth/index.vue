<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>临界生分析</span>
        <span class="font_12">临界生分析，通过设置临界分数值来计算全校及各班级的总分以及各科分数在临界分数左右徘徊的人数分布。</span>
      </div>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left" style="margin:5px 0">
          <span>临界分: <span class="mr_10">{{criticalScale}}%</span> 浮动分: <span class="mr_10">{{floatScale}}%</span> </span>
          <exam-button
            type="primary"
            class="left_modify"
            @click="handelModify"
          >修改</exam-button>
        </div>
        <div class="title_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
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
    <set-critical
      ref="setCritical"
      @change-set-critical="changeSetCritical"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import setCritical from './_setCritical'
  export default {
    components: {
      setCritical,
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
            prop:'percentage',
            label:'占比',
            width:'90',
            align:'center',
            type:'Html'
          }
        ],

        criticalScale:56,
        floatScale:8,
        parameter:{
          tid: '',
          criticalScale:56,
          floatScale:8,
          url:this.URL.GetClassSubjectScoreCriticalityNum
        },

        theight:0
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading']),
      ...mapState('criticalBirth', ['TableList','headerTable']),

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.sname,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              return {
                ...item,
                prop:`${item.prop}_${ele.sname}`,
                label:item.label,
                width:item.width,
                align:item.align,
                sortable:true,
              }
            }),
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`num_${item.sname}`]: item.num,
              [`percentage_${item.sname}`]: item.scale,
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
        this.parameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      changeSetCritical(obj){

        this.criticalScale = obj.criticalScale
        this.floatScale = obj.floatScale

        this.parameter = {
          ...this.parameter,
          ...obj
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('criticalBirth/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {tid,criticalScale,floatScale} = this.parameter
        window.open(`${this.URL.ExportClassSubjectScoreCriticalityNum}?tid=${tid}&criticalScale=${criticalScale}&floatScale=${floatScale}`)
      },

      handelModify(){
        this.$refs.setCritical.openFrame()
      },

    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .card_item{
    span.font_12{
      font-size: 12px;
      margin-left: 40px;
      color: @font-888
    }
  }
  .mr_10{
    margin: 0 5px 0 10px
  }
  .left_modify{
    display: inline-block;
    width: 60px;
    text-indent: 0;
    margin: 0 15px 0 10px;

    button.el-button.el-button--primary.el-button--medium{
      width: 60px;
    }
  }
</style>

<style lang="less" scoped>

</style>

