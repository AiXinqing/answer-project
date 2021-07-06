<template>
  <div class="echarts">
    <ve-histogram
      :extend="extend"
      :axis-visible="false"
      :height="'200px'"
      :events="chartEvents"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        extend:{
          tooltip: {
            show:false,
          },
          grid: {
            left: 50,
            right: 180,
            bottom: 0,
            top:10,
            containLabel: true
          },

          xAxis: {
            type: 'value',
            show: false,
            boundaryGap: true,
          },
          yAxis: {
            type: 'category',
            show: true,
            data: ['A', 'B', 'C', 'D'],
            boundaryGap: true,
            position: 'left',
            axisLabel :{
              interval:0
            },
          },
          series: [
            {
              type: 'bar',
              barWidth: 20,
              barMinHeight: 20,
              stack: 'total',
              label: {
                show: true,
                position: 'right',
                formatter: function (data) {
                  return '' + data.value + '人,占比 : '  + data.name + '%';
                },
                labelLine: { show: false },
                color:'#333'
              },
              itemStyle: {
                normal: {
                  color: function () {
                    let colorList = [
                      '#22bd97', '#cbe9ce', '#f7e083', '#f5be92', '#7ddde9',
                      '#fb997f', '#a0ca6d', '#f4da7f', '#c3f2c8', '#60C0DD',
                      '#e8a79c', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                    ]
                    let num = Math.floor(Math.random() * 15)
                    return colorList[num]
                  }
                },
              },
              data: [
                {name:'t1',value:320,text:'R1'},
                {name:'t2',value:302,text:'R2'},
                {name:'t3',value:301,text:'R3'},
                {name:'t4',value:334,text:'R4'},
              ]
            },
          ]
        },

        chartEvents: {
          click: (item) => {
            console.log(item)

          }
        }
      }
    },

  }
</script>

<style lang="less">

</style>