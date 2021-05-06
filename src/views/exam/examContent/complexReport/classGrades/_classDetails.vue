<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="table-description">
      <div class="table_left">
        <span>人数：30</span>
        <span>平均分：621.72</span>
        <span>最高分：637.5</span>
        <sapn>最低分：612</sapn>
      </div>
      <div class="table_right">
        <exam-button type="primary" @click="downTable">下载表格</exam-button>
      </div>
    </div>
</el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        parameter:{
          cid:'',
          tid: '',
          tsid:'',
          asid:''
        },
      }
    },

    computed: {
      title() {
        return '学生名单详情'
      }
    },

    methods: {
      openDetails(){
        this.dialogVisible = true
      },

      handleClose(done) {
        console.log(done)
      },

      downTable(){
        // 下载表格
        const {cids,tid,tsid} = this.parameter
        window.open(`${this.URL.ExportQuestionSummary}?tid=${tid}&tsid=${tsid}&cids=${cids}`)
      },
    },
  }
</script>

<style lang="less">
  .table-description{
    display: flex;

    .table_left{
      width: 87%;
      span{
        margin-right: 10px;
      }
    }

    .table_right{
      // width: 30%;
    }
  }
</style>