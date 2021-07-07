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
      <span class="low">1-3</span>
      <span> 优秀答案</span>
      <span class="score_style"> (得分：10/满分：10)</span>
    </div>

    <div class="score-detail-list">
      <div class="list-item active">代溪(8)</div>
      <div class="list-item">代溪(8)</div>
      <div class="list-item">代溪(8)</div>
      <div class="list-item">代溪(8)</div>
      <div class="list-item">代溪(8)</div>
      <div class="list-item">代溪(8)</div>
    </div>

    <div class="card_img"></div>

  </hj-dialog>
</template>

<script>

  import { mapState} from 'vuex'

  export default {
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:[],
        fullscreenLoading:false,
        subject:'',
        parameter:{},
        tid:''
      }
    },

    computed: {
      ...mapState('parameterSet', ['tableLoading','TableList']),
    },

    watch: {
      TableList:{
        immediate: true,
        handler () {
          this.data = this.TableList
        },
      },
    },

    methods: {
      openFrame(){
        this.openedFrame = true
      },

      closeFrame() {
        this.openedFrame = false
      },

      handelDetermine(){
        // 保存
      },
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
    margin: 5px -6px 5px 0;

    .list-item{
      display: inline-block;
      width: 18%;
      height: 28px;
      margin-right: 13px;
      margin-bottom: 5px;
      overflow: hidden;
      font-size: 12px;
      line-height: 28px;
      color: #6a6a6a;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid #eeefef;
      border-radius: 5px;
      cursor: pointer;

      &.active,
      &:hover{
        color: @main;
        background: #f7f8fa;
      }
    }
  }
</style>
