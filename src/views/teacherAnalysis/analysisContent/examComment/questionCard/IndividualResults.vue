<template>
  <hj-dialog
    class="newAdd-content"
    :title="'单项成绩详情'"
    :visible.sync="openedFrame"
    :before-close="closeFrame"
    :show-close="true"
    :append-to-body="true"
    width="60%"
  >
    <div class="card-title">
      <span>第</span>
      <span class="low">{{data.name}}</span>
      <span>题 共有</span>
      <span class="score_style"> {{data.fullScoreNum}}</span>
      <span>人选择答案</span>
      <span class="score_style"> {{data.optionsName}}</span>
      <span>,占比:</span>
      <span class="score_style"> {{data.numScale}}</span>
    </div>

    <div
      class="score-detail-list"
      v-loading="tableLoading"
    >
      <template v-if="data.type == '客观题'">
        <div
          v-for="item in examCommentData"
          :key="item.tmid"
          class="list-item"
        >{{item.stuname}}</div>
      </template>
      <template v-else>
        <div
          v-for="(item,i) in examCommentData"
          :key="item.tmid"
          :class="['list-item',{'active':itemActive == i}]"
          @click="changeImgFunc(item,i)"
        >{{item.stuname}}({{item.score}})</div>
      </template>
    </div>
    <template v-if="data.type == '主观题'">
      <div class="card_img">
        <img alt="题目图片" :src="cardImg"/>
      </div>
    </template>

  </hj-dialog>
</template>

<script>

  import { mapState} from 'vuex'

  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:{},
        fullscreenLoading:false,
        subject:'',
        parameter:{
          tid:'',
          tsid:'',
          cid:'',
          tqid:'',
          scoreOrOptions:'',
          url:this.URL.GetExaminationPaperCommentStuDetails
        },
        itemActive:0,
        cardImg:''
      }
    },

    computed: {
      ...mapState('examCommentDetail', ['tableLoading','examCommentData']),

    },

    watch: {
      examCommentData:{
        immediate: true,
        handler () {
          if(this.examCommentData.length){
            this.cardImg = this.examCommentData.filter((item,i) => i == this.itemActive)[0].files
          }
        },
      },
    },

    methods: {
      openFrame(obj){
        this.data = obj
        const {tid,tsid,cid,tqid,optionsName} = obj
        this.parameter = {
          ...this.parameter,
          tid:tid,
          tsid:tsid,
          cid:cid,
          tqid:tqid,
          scoreOrOptions:optionsName,
          url:this.URL.GetExaminationPaperCommentStuDetails
        },

        this.openedFrame = true

        this.$nextTick(()=>{
          this.getDetailFunc()
        })
      },

      closeFrame() {
        this.openedFrame = false
      },

      getDetailFunc(){
        this.$store.dispatch('examCommentDetail/getExamCommentDetail', this.parameter)
      },

      handelDetermine(){
        // 保存
      },
      changeImgFunc(item,i){
        // 切换图片
        this.itemActive = i
        this.cardImg = item.files
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .card-title{
    height: 30px;
    line-height: 30px;
    border-bottom: 1px dashed @ece;

    .low,
    .score_style{
      color: @main
    }
  }
  .score-detail-list{
    padding: 10px 0;
    margin: 5px -20px 5px 0;
    min-height: 40px;

    .list-item{
      display: inline-block;
      width: 18%;
      height: 28px;
      margin-right: 13px;
      margin-bottom: 5px;
      overflow: hidden;
      font-size: 12px;
      line-height: 28px;
      color: @6a6a;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid @eeefef;
      border-radius: 5px;
      cursor: pointer;

      &.active,
      &:hover{
        color: @main;
        background: @bf-f7;
      }
    }
  }
  .card_img{
    img{
      width: 100%;
    }
  }
  .el-loading-spinner .path{
    stroke: @main !important
  }
</style>
