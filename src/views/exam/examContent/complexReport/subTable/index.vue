<template>
  <div class="complex_content">
    <div ref="stretch">
      <hj-stretch
        v-for="(choose,i) in stretchBox"
        :key="i"
        :choose-list="choose"
        @handle-stretch="handleStretch"
        @handle-checkAll-change="handleCheckAllChange"
        @single-change="singleChange"
        >
      </hj-stretch>
    </div>
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
        <umy-table
          :tablecols="subTableColumn"
          :tableData="subTableData"
          :isIndex="false"
          :pagination="page"
          :theight="theight"
          :loading="tableLoading"
          @hanlde-page-size="handlePageSize"
        />
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
        stretch: true,
        fixedHeader:[
          {
            prop:'cname',
            label:'班级',
            width:'130',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            width:'80',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'tnumber',
            label:'考号',
            width:'100',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'totalscore',
            label:'总分',
            width:'120',
            align:'center',
            type:'Text',
            url:this.URL.BrowsescoreAnsw
          },
          {
            prop:'ObjectiveScore',
            label:'客观题',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'SubjectiveScore',
            label:'主观题',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'gradeRank',
            label:'学校排名',
            width:'120',
            align:'center',
            type:'Html'
          },
          {
            prop:'classRank',
            label:'班级排名',
            width:'120',
            align:'center',
            type:'Html'
          },
        ],
        objective:[ // 客观
          {
            prop:'fullScore',
            label:'客观',
            minWidth:'110',
            align:'center',
          },
          {
            prop:'answer',
            label:'客观',
            minWidth:'110',
            align:'center',
          },
        ],
        subjective:[ // 主观
          {
            prop:'fullScore',
            label:'主',
            minWidth:'110',
            align:'center',
          },
        ],

        // 参数
        keyWords:'',
        cidStr:'',
        theight: document.body.clientHeight - 300 || 0,
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
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetStuSmallScoreHeade,
        tableH:51,
        tsid:'',
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','classesArr']),
      ...mapState('subTable', ['tableLoading','headerTable','TableList','pagination']),

      classIdsArr(){
        return this.classesArr.length ? this.classesArr.filter(item => item.check && item.cid != 'all')
                .map(ele => ele.cid).toString() : ''
      },

      stretchBox(){
        return this.examInfo.length ? this.examInfo.map(element =>{
          return element.subject == '科目' ? {
            ...element,
            subjectList:element.subjectList.filter(item => item.tsid != 'totalScore').map((item,index) => {
              return index == 0 ? {...item,check:true} : {...item,check:false}
            })
          } : {
            ...element,
            subjectList:this.classesArr
          }
        }) :[]
      },

      subTableColumn(){
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
                // type:'Text',
                type:'Html',
                prop:`${item.prop}_${ele.title}`,
                fontSize:true,
                fullScore:ele.fullScore,
                typeIndex:ele.type
              }: {
                ...item,
                label:`作答/答案${ele.answer}`,
                ...obj,
                prop:`${item.prop}_${ele.title}`,
                answer:ele.answer,
                typeIndex:ele.type
              }
            }) : this.subjective.map(item =>{
              return {
                ...item,
                label:`得分/共${ele.fullScore}分`,
                type:'Html',
                prop:`${item.prop}_${ele.title}`,
                fontSize:true,
                fullScore:ele.fullScore,
                typeIndex:ele.type
              }
            })
          }))
        ] : []
      },

      subTableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          let dynamic = {}
          item.DynamicDetail.forEach(element => {
            switch (element.type) {
              case '0':
                  dynamic = {
                    ...dynamic,
                    [`answer_${element.title}`]:element.selected,
                    [`fullScore_${element.title}`]:element.score,
                    score: element.score,
                    selected: element.selected,
                    title: element.title,
                    type: element.type,
                  }
                break;
              default:
                  dynamic = {
                    ...dynamic,
                    [`fullScore_${element.title}`]:element.score,
                    score: element.score,
                    selected: element.selected,
                    title: element.title,
                    type: element.type,
                    answer: null,
                  }
                break;
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
            ObjectiveScore: item.ObjectiveScore,
            SubjectiveScore: item.SubjectiveScore,
            classRank: item.classRank,
            gradeRank: item.gradeRank,
            ...dynamic,
            jump:1,
            tsid: this.tsid == '' ? this.subjectsArr.find((element,i) => i == 1).tsid : this.tsid,
            tid: this.prmTid,
          }
        }) : []
      }
    },

    created () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
    },

    watch: {
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
          this.$nextTick(()=>{
            this.getHeight()
          })
        },
      },
      pagination:{
        immediate: true,
        handler () {
          this.page = this.pagination
        },
      },

    },
    methods: {
      getHeight () {
        this.theight = document.body.clientHeight - 300
      },

      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 208 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable(){

        if(this.tsid == ''){
          this.tsid = this.subjectsArr.filter(item => item.tsid != 'totalScore').find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          this.getDynamicHeader(this.tsid)
          let _this = this
          setTimeout(function(){
            _this.getTable()
          },400)
        })
      },

      handlePageSize({page, size}){
        // 分页起始页
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.filter(item => item.tsid != 'totalScore').find((element,i) => i == 0).tsid
        }
        this.page.pageNum = page
        this.page.pageSize = size
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handleCheckAllChange(cidStr){
        // 班级查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.filter(item => item.tsid != 'totalScore').find((element,i) => i == 0).tsid
        }
        this.page = {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
        this.cidStr = cidStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        this.page = {
          pageSize: 15,
          pageNum: 1,
          total: 0
        }
        this.$nextTick(()=>{
          this.getDynamicHeader(this.tsid)
          this.getTable()
        })
      },

      handleInquire(){
        // 输入框查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.filter(item => item.tsid != 'totalScore').find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      downTable(){
        // 小题分数报表下载
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }

        window.open(`${this.URL.ExportStuSmallScore}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}&keyWords=&${this.keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },

      getDynamicHeader(tsid){
        // 获取动态表头
        this.$store.dispatch('subTable/dynamicHeader', {
          tid: this.prmTid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.filter(item => item.tsid != 'totalScore').find((element,i) => i == 0).tsid
        }
        //Qs.stringify
        this.parameter = {
          ...this.parameter,
          cids:this.cidStr,
          tid: this.prmTid,
          tsid:this.tsid,
          keyWords:this.keyWords,
          pageIndex: pageNum,
          pageSize: pageSize,
        }
        this.$store.dispatch('subTable/GetStuResults', this.parameter)
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/variables.less';
  .el-table__fixed-body-wrapper{
    top: 74px!important;
  }
</style>