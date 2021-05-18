<template>
  <section style="width:100%">
    <ve-line
      style="width:100%"
      :data="chartData"
      :extend="option"></ve-line>
    <!-- <ve-histogram
      class="myve"
      :data="chartData"
      :extend="option"
      v-if="chartData.columns != undefined"
    />
    <div
      v-else
      class="chart_style"
      v-loading.fullscreen.lock="fullscreenLoading"
    > 暂无数据 </div> -->
  </section>

</template>

<script>
  export default {
  data () {
    return {
      chartData: {
        columns: ['日期', '全体'],
        rows: [
          { '日期': '57', '全体': 1393 },
          { '日期': '114', '全体': 3530 },
          { '日期': '171', '全体': 2923 },
          { '日期': '228', '全体': 1723 },
          { '日期': '285', '全体': 3792},
          { '日期': '512', '全体': 4593 }
        ]
      },
      option:{
        grid: {
          show: true,
          top: 40,
          bottom: 20,
          left: 70,
          right: 40,
          containLabel: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        },
        xAxis: {
          name:'分数',
          nameGap:10,
          nameLocation: 'end',
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        },

        yAxis: {
          // show:true
          name:'人数',
          nameTextStyle:{
            color:'#666'
          },
          axisLine:{
            show:true,
            lineStyle:{
              color:'#DDD',
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#666666'
            }
          },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          }
        },
      }
    }
  }
}
</script>

<style lang="less" >
  .chart_style {
    text-align: center;
    line-height: 22em;
  }
</style>