<template>
  <!-- 单一折线图 -->
  <div
    ref="cardItem"
    class="row-charts-item"
    :style="{width:width}"
  >
    <!-- <div ref="explanationInfo">
      <div class="row-title">{{ titleName }}</div>
      <el-row
        v-show="cahrtLabel.length > 0"
        class="row-tableBox"
      >
        <el-col
          v-for="(item, i) in cahrtLabel"
          :key="i"
          class="row-year"
          :span="Math.ceil(24/cahrtLabel.length)"
        >
          <div
            v-if="item.length >= 2"
            class="title-row row-col2"
          >
            <span class="name">{{ item[0].desTitle }} </span>
            <div>
              <span class="num-name">{{ item[0].val }}</span>
              <span class="name">{{ unit }}</span>
              <span class="num-compareCon"> {{ item[1].desTitle }} </span>
              <span
                class="num-compare"
              >
                <i class="el-icon-caret-top" /> {{ item[1].val }}{{ item[1].val ==='∞'?'': percentSign }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <chart
      v-if="chartData.datas.length > 0 && chartHeight > 0"
      id="chartLines"
      ref="chartLine"
      style="width: 100%;"
      :style="{ height: chartHeight + 'px' }"
      :options="option"
    />
    <div v-else class="no-data">
      <div class="icon" />
      <div>暂无数据</div>
    </div>
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
      cardHeight: 263,
      chartHeight: 0,
      clientHeight: 0
    }
  },
  computed: {
    cahrtLabel() {
      return this.group(this.chartData.describes, 2)
    },
    option() {
      const { datas } = this.chartData
      if (datas.length > 0) {
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
            name: this.unit,
            data: datas.map((item) => ({
              value: item.itemArray[0],
              textStyle: item.itemArray[2] === 1 ? { color: '#52A3FF' } : { color: '#666' }
            })),
            nameLocation: 'start',
            nameGap: 15,
            nameTextStyle: {
              fontSize: 12,
              color: '#666',
              padding: [25, 0, 0, 0]
            },
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            },
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            }
          },
          series: [{
            data: datas.map((item) => ({ value: item.itemArray[1], flag: item.itemArray[2] })),
            type: 'line',
            color: '#52A3FF',
            symbolSize: function(item) {
              const lineItem = datas.filter(item => item.itemArray[2] === 1)
              if (lineItem[0] !== undefined && lineItem[0].itemArray[1] === item) {
                return 10
              } else {
                return 4
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              },
              label: {
                formatter: '{d}%'
              }
            }
          }]
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler() { // newValue, oldValue
        this.$nextTick(() => {
          if (this.cahrtLabel.length >= 0) {
            this.clientHeight = this.$refs.explanationInfo.offsetHeight
            this.cardHeight = this.$refs.cardItem.offsetHeight
            this.chartHeight = this.cardHeight - this.clientHeight - 20
            if (this.chartHeight <= 0) {
              this.chartHeight = 150
            }
          }
        })
      },
      deep: true
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

<style lang="less">
  .row-year:nth-child(n+2) {
    position: relative;
    left: 14px;
  }
  .row-tableBox{
    padding-left: 0px !important;
  }
</style>

