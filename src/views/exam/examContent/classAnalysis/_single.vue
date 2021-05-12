<template>
  <div>
    <chart
      id="chartLines"
      ref="chartLine"
      style="width: 100%;height:300px;"
      :options="option"
    />

  </div>
</template>

<script>

  export default {

    props: {
      chartData: {
        type: Object,
        default() {
          return {}
        }
      },
      titleName: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '364px'
      },
      percentSign: {
        type: String,
        default: '%'
      }
    },

    data() {
      return {
        chartHeight: 263,
      }
    },

    computed: {
      option() {
        return {
          grid: {
            top: 20,
            left: 0,
            right: 20,
            bottom: 5,
            containLabel: true
          },
          tooltip: {
            trigger: 'item'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            }
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            color: '#1ab394',
            barWidth : 30,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              },
              label: {
                formatter: '{d}%'
              }
            },
            markLine : {
              data : [
                {type : 'average', name : '平均值'}
              ]
            }
          }]
        }
      }
    },

    mounted() {
      window.addEventListener('resize', this.resizeTheChart)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeTheChart)
    },
    methods: {
      group(array, subGroupLength) {
        let index = 0
        const newArray = []
        while (index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength))
        }
        return newArray
      },
      resizeTheChart() {
        if (this.$refs.chartLine) {
          this.$refs.chartLine.resize()
        }
      }
    }
  }
</script>

<style lang="less" >

</style>