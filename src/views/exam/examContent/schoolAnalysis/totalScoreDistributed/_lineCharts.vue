<template>
  <section style="width:100%">
    <ve-line
      style="width:100%"
      :data="chartData"
      :extend="option"
      v-if="chartData.columns != undefined"
    ></ve-line>
    <div
      v-else
      class="chart_style"
      v-loading.fullscreen.lock="fullscreenLoading"
    > 暂无数据 </div>
  </section>

</template>

<script>
  export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
  },

  data () {
    return {
      fullscreenLoading:false,
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
  },

  watch: {
    chartData: {
      immediate: true,
      handler () {
        if(this.chartData.columns != undefined){
          this.fullscreenLoading = false
        }else{
          this.fullscreenLoading = false
        }
      },
    },
  },
}
</script>

<style lang="less" >
  .chart_style {
    text-align: center;
    line-height: 22em;
  }
</style>