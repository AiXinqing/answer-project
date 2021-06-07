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
        <div class="search_left" style="width:auto">
          <span class="titile_14">分数区间：</span>
          <hj-input class="indent_model" style="width:60px;" type="number" v-model="step" placeholder="50" />
          <span class="titile_14"> 分/段</span>

          <exam-button type="primary" class="grades_btn" @click="handelScoreInterval">确定</exam-button>
        </div>
        <div class="search_right">
          <exam-button type="primary" @click="downTable">下载表格</exam-button>
        </div>
      </div>

      <div class="el_table_wapper" :style="{'max-height':theight +'px'}">
        <exam-table
          :tablecols="gradersTableColumn"
          :tableData="gradersTableData"
          :isIndex="false"
          :isPagination="false"
          :theight="theight"
          :difference-height="differenceHeight"
          :loading="tableLoading"
          @hanlde-pop-func="hanldePopFunc"
        ></exam-table>
      </div>
    </div>

  </div>
</template>

<script>
  // import { mapState} from 'vuex'
  export default {
    data() {
      return {
        stretchBox: [],
        step:20,
        gradersTableColumn:[],
        gradersTableData:[],
        theight:0,
        differenceHeight:-10,
        tableLoading:false
      }
    },

    computed: {
      name() {
        return this.data
      }
    },

    methods: {
      handleStretch() {

      },

      handleCheckAllChange(){},

      singleChange(){},

      handelScoreInterval(){},

      downTable(){},

      hanldePopFunc(){}
    },
  }
</script>

<style lang="less">

</style>