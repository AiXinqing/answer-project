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
        <exam-table
          :style="{'max-height':theight+ tableH +'px'}"
          :tablecols="subTableColumn"
          :tableData="subTableData"
          :isIndex="false"
          :pagination="page"
          :theight="theight"
          :loading="tableLoading"
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
            width:'120',
            align:'center',
            fixed:'left',
            type:'Html'
          },
          {
            prop:'stuname',
            label:'姓名',
            minWidth:'80',
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
            type:'Text',
            url:this.URL.BrowsescoreAnsw
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

        // 参数
        tsid:'',
        keyWords:'',
        cidStr:'',
        theight: document.body.clientHeight - 350 || 0,
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
        tableH:51
      }
    },

    computed: {
      ...mapState('getExam', ['tableLoading','subjectsArr','classesArr']),
      ...mapState('subTable', ['headerTable','TableList','pagination',]),

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
        let tsid_s = this.subjectsArr.find((element,i) => i == 1).tsid
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
            tsid: this.tsid == '' ? tsid_s : this.tsid,
            tid: this.prmTid,
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
      classIdsArr: {
        immediate: true,
        handler () {
          this.cidStr = this.classIdsArr
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
      handleStretch(){
        this.$nextTick(() =>{
          let height = this.$refs.stretch.offsetHeight
          this.theight = document.body.clientHeight - 258 - height // 258 = 页面高度 - height  除条件以外的高度
        })
      },

      initTable(){
        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
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

      handleSizeChange(val){
        // 分页每页显示数量
        this.page.pageSize = val
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })

      },
      handleCurrentChange(val){
        // 分页起始页
        this.page.pageNum = val
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      handleCheckAllChange(cidStr){
        // 班级查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        this.cidStr = cidStr
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      singleChange(tsid){
        // 科目查询
        this.tsid = tsid
        this.$nextTick(()=>{
          this.getDynamicHeader(this.tsid)
          this.getTable()
        })
      },

      handleInquire(){
        // 输入框查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 1).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      downTable(){
        // 下载表格
        const {cids,keyWords,tid,tsid} = this.parameter
        const { pageSize , pageNum} = this.pagination
        window.open(`${this.URL.ExportStuResults}?tid=${tid}&tsid=${tsid}&cids=${cids}&keyWords=&${keyWords}pageIndex=${pageNum}&pageSize=${pageSize}`)
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

<style lang="less">
  @import '~@/assets/css/variables.less';
</style>