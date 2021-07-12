<template>
  <div class="echarts">
    <ve-histogram
      :extend="extend"
      :height="questionOptions.length ? questionOptions.length == 1 ? '70px' : questionOptions.length * 40 + 'px' : '100px'"
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
              type: 'none'
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
            data: this.questionOptions.map(item => item.optionsName), //.reverse()
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
                  color: function (res) {
                    return  res.data.rightFlg ? '#22bd97' : '#F0805A'
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
        this.$refs.IndividualResults.openFrame(obj.data)
      }
    },
  }
</script>

<style lang="less">

</style>