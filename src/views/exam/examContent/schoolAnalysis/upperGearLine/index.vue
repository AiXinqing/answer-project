<template>
  <!-- 总体情况汇总分析 -->
  <div class="class_content">

    <div class="card_contetn">
      <div class="card_item">
        <i></i>
        <span>总分分档上线人数分布</span>
        <span class="font_12">总分分档上线学生人数分布, 可得到统考下各班级在学业综合水平上的分层表现</span>
      </div>
    </div>

    <div class="binning_box">
      <div class="card_item">
        <span>分档分数线</span>
        <span class="font_12">分档分数线按比例分为三档, 分别对应学生总数的前{{parameterInfo.lineScale}}</span>
      </div>
      <div class="card_item">
        <span class="font_12 binning_font">本次考试满分{{parameterInfo.fullScore}}分, 最高分{{parameterInfo.maxScore}}分,</span>
        <span
          v-for="(item,i) in  binningData"
          :key="i"
          class="font_12 binning_font"
        >{{item.name}} {{item.score}} 分<span v-if="binningData.length - 1 != i">,</span></span>
      </div>
      <exam-button class="binning_setting" type="primary" @click="setBinParameter" ><i class="el-icon-setting"></i>设置分档参数</exam-button>
    </div>

    <div class="total_score">
      <div class="title_box">
        <div class="title_left">各班级的上线情况见下表</div>
        <div class="title_right">
          <exam-button type="primary" @click="basisDownTable">下载表格</exam-button>
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
    <binning-bullet-frame
      ref="binningBullet"
      @change-set-binning-bullet="changeSetBinningBullet"
    />
  </div>
</template>

<script>
  import { mapState} from 'vuex'
  import binningBulletFrame from './_binningBulletFrame'
  export default {
    components: {
      binningBulletFrame,
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
            minWidth:'85',
            align:'center',
            type:'Html'
          },
          {
            prop:'cumulativeNum',
            label:'累计人数',
            minWidth:'90',
            align:'center',
            type:'Html'
          },
          {
            prop:'cumulativeRate',
            label:'累计上线率',
            minWidth:'90',
            align:'center',
            type:'Html'
          }
        ],

        parameter:{ // 总分上档线分析
          tid: '',
          url:this.URL.GetClassTotalScoreLine
        },

        getBinLineParameter:{ //  获取上档线设置表格数据
          tid: '',
          url:this.URL.GetASAnalyseScoreLine
        }
      }
    },

    computed: {
      ...mapState('binningAnalysis', ['tableLoading','TableList',
      'headerTable','binningData','parameterInfo']),
    
      tableColumn(){
        // 动态表头
        return this.headerTable.length ? [
          ...this.fixedHeader,
          ...this.headerTable.map(ele => ({
            ...ele,
            label:`${ele.name}(${ele.score})`,
            align:'center',
            childen:this.columnMultiLine.map(item => {
              return {
                ...item,
                prop:`${item.prop}_${ele.name}`,
                label:item.label,
                width:item.width,
                align:item.align,
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
              [`num_${item.name}`]: item.num == '' ? null : item.num,
              [`cumulativeNum_${item.name}`]: item.cumulativeNum == '' ? null : item.cumulativeNum ,
              [`cumulativeRate_${item.name}`]: item.cumulativeScale == '' ? null : item.cumulativeScale ,
              sname: item.sname,
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
      if(this.prmTid != ''){
        this.parameter.tid = this.prmTid
        this.getTable()
      }
    },

    methods: {

      getTable() {
        // 获取table
        this.$store.dispatch('binningAnalysis/GetStuResults', this.parameter)
        this.$store.dispatch('binningAnalysis/getUpperGearLine', this.getBinLineParameter)
      },

      basisDownTable(){
        // 下载表格
        const {tid} = this.parameter
        window.open(`${this.URL.ExportClassTotalScoreLine}?tid=${tid}`)
      },

      setBinParameter(){// 设置分档参数
        this.$refs.binningBullet.openFrame(this.binningData)
      },

      changeSetBinningBullet(){
        this.getTable()
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .binning_box{
    background-color: @main;
    color: @white;
    position: relative;
    width: calc(100% - 90px);
    padding: 10px 15px;
    margin: 20px 0 20px 30px;
    .card_item{
      color: @white;
      margin-top: 10px;

      .font_12{
        color: @white;
        &.binning_font{
          margin-left: 10px;
          font-size: 14px;
        }
      }
    
    }

    .binning_setting{
      position:absolute;
      top:20px;
      right:40px;
      
      .el-button--primary{
        background-color: @white !important;
        color:@font-888 !important;
      }
    }
  }
</style>


