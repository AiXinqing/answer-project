<template>
  <div class="complex_content">
    <hj-stretch
      v-for="(choose,i) in subjectsArr"
      :key="i"
      :choose-list="choose"
      @handle-stretch="handleStretch"
      @handle-checkAll-change="handleCheckAllChange"
      @single-change="singleChange"
      >
    </hj-stretch>
    <div class="table_wapper">
      <div class="table_search">
        <div class="search_left">
          <span class="titile_18">分数详情</span>
          <i>(点击学科的分数，可查看学生的答题卡)</i>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
          <exam-button type="primary" @click="handleInquire">查询</exam-button>
          <div class="input_box">
            <span class="clear_box">
              <i class="el-icon-circle-close" @click="handleClear"></i>
            </span>
            <hj-input
              v-model="keyWords"
              class="search_input"
              placeholder="输入姓名/考号/学号进行搜索"
              :iSlot="iSlot"
            />
          </div>
        </div>
      </div>

      <div class="el_table_wapper">
        <exam-table
          :style="{'max-height':theight+'px'}"
          :tablecols="tableColumn"
          :tableData="tableData"
          :isIndex="false"
          :pagination="pagination"
          :loading="loading"
          :theight="500"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        ></exam-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  export default {
    props: {
      stretchBox: {
        type: Array,
        default: () => []
      },

      activeName:{
        type: String,
        default: ''
      },

    },
    data() {
      return {
        stretch: true,
        stretchArr:[],
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
            prop:'stuname',
            label:'姓名',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'snumber',
            label:'学号',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            minWidth:'100',
            align:'center',
            type:'Html'
          },
          {
            prop:'totalscore',
            label:'总分',
            minWidth:'120',
            sortable:true,
            align:'center',
            type:'Text'
          },
          {
            prop:'ObjectiveScore',
            label:'客观题',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'SubjectiveScore',
            label:'主观题',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'classRank',
            label:'班级排名',
            minWidth:'120',
            align:'center',
            type:'Html'
          },
        ],
        objective:[ // 客观
          {
            prop:'fullScore',
            label:'客观',
            width:'90',
            align:'center',
          },
          {
            prop:'answer',
            label:'客观',
            width:'90',
            align:'center',
          },
        ],
        subjective:[ // 主观
          {
            prop:'fullScore',
            label:'主',
            width:'100',
            align:'center',
          },
        ],
        prmTid: '',
        tsid:'',
        keyWords:'',
        theight: document.body.clientHeight - 350,
        loading:false,
        iSlot:[
          {
            type:'prefix',
            icon:'el-icon-search'
          }
        ],
        parameter:{
          cids:'',
          keyWords:'',
          tid: '',
          tsid:'',
          url:this.URL.GetStuSmallScore
        },
        pagination: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetStuSmallScoreHeade,
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','headerTable','TableList']),

      subjectsArr() {
        return this.stretchArr.map(item =>{
          return item.subject == '科目' ? {
            ...item,
            subjectList:item.subjectList.filter(ele => ele.sid != 'totalScore').map((ele,index) => {
              return index == 0 ? {...ele,check:!ele.check} : ele
            })
          } : item
        })
      },

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:ele.title,
            align:'center',
            // 0 客观题 objective 1 主观题 subjective
            childen:ele.type == '0' ? this.objective.map((item,index) =>{
              let obj = {
                type:'Html'
              }
              return index == 0 ? {
                ...item,
                label:`得分/共${ele.fullScore}分`,
                ...obj,
                type:'Text',
                prop:`${item.prop}_${ele.title}`,
              }: {
                ...item,
                label:`作答/答案${ele.answer}`,
                ...obj,
                prop:`${item.prop}_${ele.title}`,
              }
            }) : this.subjective.map(item =>{
              return {
                ...item,
                label:`得分/共${ele.fullScore}分`,
                type:'Html',
                prop:`${item.prop}_${ele.title}`
              }
            })
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(item => {
            dynamic = {
              ...dynamic,
              [`classRank_${item.sname}`]: item.classRank,
              [`gradeRank_${item.sname}`]: item.gradeRank,
              ord: item.ord,
              sname: item.sname,
              [`tscore_${item.sname}`]: item.tscore,
              tsid: item.tsid,
              tid: this.prmTid,
              jump:1
            }
          })

          return {
            cid: item.cid,
            cname: item.cname,
            snumber: item.snumber,
            stuname: item.stuname,
            tmid: item.tmid,
            tnumber: item.tnumber,
            totalscore: item.totalscore,
            ...dynamic
          }
        }) : []
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.theight = document.body.clientHeight - 350
      })
    },

    watch: {
      stretchBox: {
        immediate: true,
        handler () {
          this.stretchArr = this.stretchBox
        }
      },
    },
    methods: {
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable(prmTid,tsid,classIdsArr){
        this.prmTid = prmTid
        this.tsid = tsid
        this.parameter = {
          ...this.parameter,
          tid: prmTid,
          tsid:this.tsid,
          cids:classIdsArr
        }

        this.getDynamicHeader(prmTid,tsid)
        this.getTable()
      },

      getDynamicHeader(prmTid,tsid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: prmTid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        this.loading = true
        const { pageSize , pageNum} = this.pagination
        //Qs.stringify
        this.$store.dispatch('getExam/GetStuResults', {
          ...this.parameter,
          pageIndex: pageNum,
          pageSize: pageSize,
        }).then((res)=>{
          if(res.ResponseCode =="Success"){
            this.loading = false
            const {count,pageIndex,pageSize} = res.ResponseContent
            this.pagination = {
              pageSize: pageSize,
              pageNum: pageIndex,
              total: count
            }
          }
        })
      },

      handleSizeChange(val){
        console.log(val)
        // this.$emit('handle-size-change',val)
      },
      handleCurrentChange(val){
        console.log(val)
        // this.$emit('handle-current-change',val)
      },

      handleCheckAllChange(cidStr){
        // 班级查询
        console.log(cidStr)
        this.$emit('handle-checkAll-change',cidStr)
      },

      singleChange(tsid){
        // 科目查询
        console.log(tsid)
        // this.$emit('single-change',tsid)
      },

      handleInquire(){
        // 输入框查询
        // this.$emit('handle-inquire',this.keyWords)
      },

      downTable(){
        // 下载表格
        // this.$emit('handel-down-table')
      },

      handleClear(){
        this.keyWords= ''
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>