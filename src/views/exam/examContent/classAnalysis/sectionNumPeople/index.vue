<template>
  <!-- 分段人数分布 -->
  <div class="class_content">
    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>分数段的人数分布</span>
      </div>
      <div class="search_right">

        <div class="input_box">
          <div class="label_font">分段分数 :</div>
          <hj-input
            v-model="step"
            type="number"
            class="search_input"
            placeholder="50"
          />
        </div>

        <div class="search_select search_style">
          <hj-select
            :items="options"
            size="mini"
            :value="tsid"
            @change="handelChange"
          ></hj-select>
        </div>
        <exam-button type="primary" @click="handelSearch" style="margin-right: 10px;">确定</exam-button>
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
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html',
          }
        ],
        rankArr:{
          prop:'minute',
          label:'最高分',
          minWidth:'90',
          align:'center',
          type:'Html',
        },
        step:20,
        tsid:0,
        parameter:{
          tid: '',
          tsid:'',
          step:20,
          showGrade:false,
          url:this.URL.GetClassScoreSegmentNum
        }
      }
    },

    computed: {
      ...mapState('sectionNumPeople', ['tableLoading','headerTable','TableList',]),

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
            ...this.rankArr,
            prop:`${this.rankArr.prop}_${ele}`,
            label:ele
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
              [`minute_${element.name}`]:element.num,
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

    watch: {
      subjectsArr: {
        immediate: true,
        handler () {
          this.tsid =  this.subjectsArr.length ? this.subjectsArr.find((element,i) => i == 1).tsid :0
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

    methods:{

      handelSearch(){
        // 设置搜索
        this.parameter.step = this.step
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handelChange(val){
        this.parameter.tsid = val
        this.tsid = val
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      getTable() {
        // 获取table
        this.$store.dispatch('sectionNumPeople/GetStuResults', this.parameter)
      },

      downTable(){
        // 下载表格
        const {tid,tsid,step,showGrade} = this.parameter
        window.open(`${this.URL.ExportClassScoreSegmentNum}?tid=${tid}&tsid=${tsid}&step=${step}&showGrade=${showGrade}`)
      },

    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/variables.less';
  .card_item{
    width:682px;
  }
  .search_right{
    display:flex;

    .search_select{
      margin-right:10px;
    }
  }
  .input_box{
    display: flex;
    font-size: 14px;
    margin-right: 10px;

    .label_font{
      margin-right: 10px;
      line-height: 28px;
    }

    .hj-input.el-input{
      width: 120px;
      margin-top: -5px;
    }
  }
  .label_box{
    display: flex;
    font-size: 14px;

    .search_input{
      margin-top: -5px;
    }

    .radio_model{
      display: flex;

      .el-radio{
        line-height: 28px;
        margin-right: 20px;
        color: @font-333;
      }
    }

    .label_font{
      line-height: 28px;
      margin-right: 10px;
    }
  }

</style>