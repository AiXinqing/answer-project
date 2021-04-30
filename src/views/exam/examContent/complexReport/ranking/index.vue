<template>
  <div class="complex_content">
    <div ref="stretch">
      <hj-stretch
        v-for="(choose,i) in stretchBox"
        :key="i"
        :choose-list="choose"
        @handle-stretch="handleStretch"
      >
      </hj-stretch>
    </div>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left">
          <span class="titile_14">您可以设置</span>
          <hj-input class="indent_model" style="width:60px;" v-model="step" placeholder="50" />
          <span class="titile_14">名，查看不同名次段的人数分布及详情。</span>

          <exam-button type="primary">确定</exam-button>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table
          :tablecols="gradersTableColumn"
          :tableData="gradersTableData"
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

      examInfo:{
        type:Array,
        default:() => []
      }
    },

    data() {
      return {
        stretch: false,
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            minWidth:'140',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'referenceNumber',
            label:'参考人数',
            minWidth:'100',
            sortable:true,
            align:'center',
            type:'Html'
          },
        ],

        rankArr:[
          {
            prop:'num',
            label:'人数',
            width:'90',
            align:'center',
            sortable:true,
          },
          {
            prop:'scale',
            label:'比例',
            width:'90',
            align:'center',
            sortable:true,
          },
        ],

        // 参数
        step:50,
        tsid:'',
        cidStr:'',
        theight: document.body.clientHeight - 285 || 0,
        placing:'10,20,30,40,50',
        parameter:{
          cids:'',
          tid: '',
          tsid:'',
          step:50,
          type: '前', //统计类型：0:分段统计，1：累计统计
          placing:'10,20,30,40,50',
          url:this.URL.GetPlacingSegment
        },
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading','subjectsArr','classesArr']),
      ...mapState('ranking', ['headerTable','TableList',]),

      classIdsArr(){
        return this.classesArr.length ? this.classesArr.filter(item => item.check && item.cid != 'all')
                .map(ele => ele.cid).toString() : ''
      },

      stretchBox(){
        return this.examInfo.length ? this.examInfo.map(element =>{
          return element.subject == '科目' ? {
            ...element,
            subjectList:element.subjectList.map((item,index) => {
              return index == 0 ? {...item,check:true} : {...item,check:false}
            })
          } : {
            ...element,
            subjectList:this.classesArr
          }
        }) :[]
      },

      gradersTableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            label:ele,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:this.rankArr.map((item,index) =>{
              return {
                ...item,
                label:item.label,
                type: index == 0 ? 'Text' : 'Html',
                prop:`${item.prop}_${ele}`,
              }
            })
          }))
        ] : []
      },

      gradersTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            dynamic = {
              ...dynamic,
              ...element,
              [`num_${element.name}`]:element.num,
              [`scale_${element.name}`]:element.scale,
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            referenceNumber: item.referenceNumber,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 285
      })
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
        },
      },

      gradersTableColumn: {
        immediate: true,
        handler () {
          console.log(this.gradersTableColumn)
          console.log(this.gradersTableData)
        },
      },

    },

    methods: {
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 208 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable() {
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.parameter = {
          ...this.parameter,
          cids:this.cidStr,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.$store.dispatch('ranking/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {cids,tid,tsid,step,type,placing} = this.parameter
        window.open(`${this.URL.ExportPlacingSegment}?tid=${tid}&tsid=${tsid}&cids=${cids}&step=${step}&type=${type}&placing=${placing}`)
      },
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>