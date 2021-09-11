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
        <div class="search_left" style="min-width:79%">
          <span class="titile_18">等级详情</span>
          <span class="font_sizeLvle" style="margin:0 10px">等级说明</span>
          <span
              v-for="item in LvlList"
              :key="item.tid"
              class="font_sizeLvle"
            >
            {{item.lvlRangeStr}}
          </span>
          <span  class="set_parameter" @click="setParameterFunc" >设置参数</span>
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
          :tablecols="tableColumn"
          :tableData="tableData"
          :isIndex="false"
          :pagination="page"
          :loading="tableLoading"
          :theight="theight"
          @hanlde-page-size="handlePageSize"
        />

      </div>
    </div>
    <parameter-settings
      ref="parameterSet"
      :lvle-list="LvlList"
      :lvle-type="lvleType"
      @change-set="changeSet"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import parameterSettings from './_parameterSettings'
  export default {
    components: {
      parameterSettings
    },
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
        stretchArr:[],
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
        ],
        // 参数
        tsid:'',
        keyWords:'',
        cidStr:'',
        theight: 500,
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
          url:this.URL.GetStuLvlResults
        },
        LvlParameter:{
          type:2, // 1:单科，2：总分
          tid: '',
          tsid:'',
          url:this.URL.GetASAnalyseLvlList
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        headeUrl:this.URL.GetTableHeadeSubject,
        tableH:51,
        lvleType:{
          tid: '',
          type: 2,
          tsid:''
        }
      }
    },

    computed: {
      ...mapState('getExam', ['subjectsArr','headerTable',
        'TableList','classesArr','pagination',
        'tableLoading'
      ]),
      ...mapState('setLvlList', ['LvlList']),


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

      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            type: 'Html',
            label:ele.sname,
						prop: `lvl_${ele.sname}`,
            align:'center',
          }))
        ] : []
      },

      tableData(){
        return this.TableList.length ? this.TableList.map(item =>{
          const detail = item.DynamicDetail.reduce((acc, ele) => {
            return {
              ...acc,
							[`lvl_${ele.sname}`]:ele.lvl,
            }
          }, {})

          return {
            cid: item.cid,
						cname:item.cname,
            scname: item.cname,
            snumber: item.snumber,
            stuname: item.stuname,
            tmid: item.tmid,
            tnumber: item.tnumber,
            totalScore: item.totalScore,
            ...detail
          }
        }) : []
      }
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

    created () {
      window.addEventListener('resize', this.getHeight)
    },
    destroyed () {
      window.removeEventListener('resize', this.getHeight)
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

      initTable() {
        this.theight = document.body.clientHeight - 300

        this.$nextTick(()=>{
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
          // 班级数组
          this.cidStr = this.classIdsArr
          // 获取动态表头
          this.getDynamicHeader(this.tsid)
          this.getTable()
          this.getLvleList()
        })
      },

      handlePageSize({page, size}){
        // 分页起始页
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
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
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
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
          this.getLvleList()
        })
      },

      handleInquire(){
        // 输入框查询
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        this.$nextTick(()=>{
          this.getTable()
        })
      },

      downTable(){
        // 下载表格
        if(this.tsid == ''){
          this.tsid = this.subjectsArr.find((element,i) => i == 0).tsid
        }
        window.open(`${this.URL.ExportStuLvlResults}?tid=${this.prmTid}&tsid=${this.tsid}&cids=${this.cidStr}&keyWords=&${this.keyWords}`)
      },

      handleClear(){
        this.keyWords= ''
      },


      getDynamicHeader(tsid){
        // 获取动态表头
        this.$store.dispatch('getExam/dynamicHeader', {
          tid: this.prmTid,tsid:tsid,url:this.headeUrl
        })
      },

      getTable() {
        // 获取table
        const { pageSize , pageNum} = this.page
        this.parameter = {
            ...this.parameter,
            cids:this.cidStr,
            tid: this.prmTid,
            tsid:this.tsid,
            keyWords:this.keyWords,
            pageIndex: pageNum,
            pageSize: pageSize,
          }

        this.$store.dispatch('getExam/GetStuResults', this.parameter)
        this.$nextTick(()=>{
          this.theight = document.body.clientHeight - 300
        })
      },

      // 获取等级详情
      getLvleList(){
        this.LvlParameter = {
          ...this.LvlParameter,
          type:this.tsid === 'totalScore' ? 2: 1,
          tid: this.prmTid,
          tsid:this.tsid,
        }
        this.lvleType = {
          type:this.tsid === 'totalScore' ? 2: 1,
          tid: this.prmTid,
          tsid: this.tsid,
        }
        this.$store.dispatch('setLvlList/GetASAnalyseLvlList', this.LvlParameter)
      },

      setParameterFunc(){
        this.$refs.parameterSet.openFrame()
      },

      changeSet(){
        // 保存得分率后更新数据
        this.getTable()
        this.getLvleList()
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .font_sizeLvle{
    font-size: 14px;
    color: @font-666;
  }
  .set_parameter{
    color: @main;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
  }

</style>