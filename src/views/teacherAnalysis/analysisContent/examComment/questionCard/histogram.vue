<template>
  <div class="echarts">
    <ve-histogram
      :extend="extend"
      :height="questionOptions.length ? questionOptions.length * 40 + 'px' : '100px'"
      :events="chartEvents"
      :id="'histogram_'+idTqid"
      :init-options="{'dom':'histogram'+idTqid}"
    />
    <individual-results
      ref="IndividualResults"
    />
  </div>
</template>

<script>
  import IndividualResults from './IndividualResults'
  export default {
    components: {
      IndividualResults
    },

    props: {

      questionOptions: {
        type: Array,
        default:()=>[]
      },

      idTqid:{
        type:String,
        default:''
      }
    },

    data() {
      return {
        chartEvents: {
          click: (obj) => {
            this.lookDetails(obj)
          }
        }
      }
    },

    computed: {

      extend() {
        return this.questionOptions.length ? {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (res){
              return `${res[0].name}<br /> 该选项人数: ${res[0].value}`
            }
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
            data: this.questionOptions.map(item => item.optionsName),
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
                formatter: function (res) {
                  return '' + res.data.num + '人,占比 : '  + res.data.numScale;
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
              data: this.questionOptions.map(item => ({...item,value:item.num}))
            },
          ]
        } : {}
      }
    },

    methods: {
      lookDetails(obj) {
        this.$refs.IndividualResults.openFrame(obj)
      }
    },
  }
</script>

<style lang="less">

</style>