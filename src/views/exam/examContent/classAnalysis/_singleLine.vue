<template>
  <ve-histogram
    class="myve"
    :data="chartData"
    :extend="option"
  />
</template>

<script>
  export default {
    data() {
      return {

        chartData: {
          columns: ['班级', '语文'],
          rows: [
            { '班级': '1班', '语文': 120 },
            { '班级': '2班', '语文': 89 },
            { '班级': '3班', '语文': 116 },
            { '班级': '4班', '语文': 80 },
            { '班级': '5班', '语文': 92 },
            { '班级': '6班', '语文': 96 },
          ]
        },

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
            nameLocation: 'end',
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
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
  }
</script>

<style lang="less" >

</style>