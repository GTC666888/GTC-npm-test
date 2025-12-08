<template>
  <div :id="chartId" class="chart-container" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BaseChart',
  props: {
    chartId: {
      type: String,
      required: true,
      default: 'chart'
    },
    options: {
      type: Object,
      required: true,
      default: () => ({})
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    theme: {
      type: String,
      default: ''
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler(newOptions) {
        if (this.chart) {
          this.chart.setOption(newOptions, true)
        }
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.addResizeListener()
    }
  },
  beforeDestroy() {
    this.removeResizeListener()
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId), this.theme)
      if (this.options) {
        this.chart.setOption(this.options)
      }
      
      // 添加点击事件
      this.chart.on('click', (params) => {
        this.$emit('chart-click', params)
      })
    },
    addResizeListener() {
      window.addEventListener('resize', this.handleResize)
    },
    removeResizeListener() {
      window.removeEventListener('resize', this.handleResize)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    // 对外暴露的方法
    refresh() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    getChartInstance() {
      return this.chart
    }
  }
}
</script>

<style scoped>
.chart-container {
  min-height: 200px;
}
</style>