<template>
  <section>
    <ve-histogram
      class="myve"
      :data="chartData"
      :extend="option"
      v-if="chartData.columns != undefined"
    />
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

    data() {
      return {

        fullscreenLoading:false,

        option:{
          grid: {
            show: true,
            top: 80,
            bottom: 20,
            left: '3%',
            right: 120,
            containLabel: true,
            backgroundColor: 'transparent',
            borderColor: 'transparent'
          },
          xAxis: {
            name:'班级',
            nameGap:10,
            nameLocation: 'end',
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
            },
            axisLine:{
              true:false
            }
          },

          yAxis: {
            // show:true
            name:'分',
            axisLine:{
              show:true,
              lineStyle:{
                color:'#888'
              }
            }
          },
          series:{
            barWidth : 20,
            color: '#1ab394',
            markLine : {
              data : [
                {
                  type : 'average',
                  name : '年级平均值',
                  label: {
                      normal: {
                        position: 'end',
                        formatter: '{b} {c}',
                        color: '#1ab394',
                      }
                  }

                }
              ]
            }
          }
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
    color:#888
  }
</style>