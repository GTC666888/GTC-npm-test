<template>
  <div class="api-detail-container">
    <!-- 头部信息 -->
    <div class="api-header">
      <t-button theme="default" variant="text" @click="$router.back()" class="back-btn">
        <t-icon name="left" />返回系统详情
      </t-button>
      <div class="api-title-section">
        <h1 class="api-title">{{ apiInfo.name }}</h1>
        <div class="api-meta">
          <span class="api-method" :class="apiInfo.method">{{ apiInfo.method }}</span>
          <span class="api-path">{{ apiInfo.path }}</span>
          <span class="api-status" :class="{ 'active': apiInfo.status === 'active' }">
            {{ apiInfo.status === 'active' ? '活跃' : '停用' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tab-container">
      <t-tabs v-model="activeTab" class="api-tabs">
        <t-tab-panel value="call" label="调用模块">
          <!-- 调用模块内容 -->
          <div class="call-module">
            <!-- API基本信息 -->
            <div class="api-basic-info">
              <h2>API基本信息</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>接口名称</label>
                  <span>{{ apiInfo.name }}</span>
                </div>
                <div class="info-item">
                  <label>请求方法</label>
                  <span class="method-tag" :class="apiInfo.method">{{ apiInfo.method }}</span>
                </div>
                <div class="info-item">
                  <label>接口路径</label>
                  <code class="api-path">{{ apiInfo.path }}</code>
                </div>
                <div class="info-item">
                  <label>状态</label>
                  <span class="status-tag" :class="{ 'active': apiInfo.status === 'active' }">
                    {{ apiInfo.status === 'active' ? '活跃' : '停用' }}
                  </span>
                </div>
                <div class="info-item">
                  <label>创建时间</label>
                  <span>{{ apiInfo.createTime || '2024-01-01' }}</span>
                </div>
                <div class="info-item">
                  <label>最后更新</label>
                  <span>{{ apiInfo.updateTime || '2024-12-08' }}</span>
                </div>
              </div>
            </div>

            <!-- 请求参数 -->
            <div class="request-params">
              <h2>请求参数</h2>
              <t-table :columns="paramColumns" :data="apiInfo.params || []" row-key="index">
                <template #required="{ row }">
                  <t-tag v-if="row.required" theme="danger" variant="light">必选</t-tag>
                  <t-tag v-else theme="default" variant="light">可选</t-tag>
                </template>
                <template #type="{ row }">
                  <code>{{ row.type }}</code>
                </template>
              </t-table>
            </div>

            <!-- 响应示例 -->
            <div class="response-example">
              <h2>响应示例</h2>
              <div class="code-block">
                <pre><code>{{ formatResponseExample(apiInfo.responseExample) }}</code></pre>
              </div>
            </div>

            <!-- 调用测试 -->
            <div class="api-test">
              <h2>API调用测试</h2>
              <div class="test-panel">
                <div class="test-controls">
                  <t-button @click="testApiCall" :loading="testing">
                    <t-icon name="play-circle" />测试调用
                  </t-button>
                  <t-button variant="outline" @click="resetTest">重置</t-button>
                </div>
                
                <div class="test-result" v-if="testResult">
                  <h3>测试结果</h3>
                  <div class="result-info">
                    <div class="result-item">
                      <label>状态码:</label>
                      <span :class="{ 'success': testResult.status === 200, 'error': testResult.status >= 400 }">
                        {{ testResult.status }}
                      </span>
                    </div>
                    <div class="result-item">
                      <label>响应时间:</label>
                      <span>{{ testResult.duration }}ms</span>
                    </div>
                    <div class="result-item">
                      <label>响应数据:</label>
                      <pre class="response-data">{{ JSON.stringify(testResult.data, null, 2) }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </t-tab-panel>

        <t-tab-panel value="monitor" label="检测模块">
          <!-- 检测模块内容 -->
          <div class="monitor-module">
            <!-- 实时监测面板 -->
            <div class="monitoring-panel">
              <div class="section-header">
                <h2>实时监测</h2>
                <div class="monitoring-controls">
                  <t-button-group>
                    <t-button :variant="timeRange === '1h' ? 'base' : 'outline'" @click="changeTimeRange('1h')">
                      1小时
                    </t-button>
                    <t-button :variant="timeRange === '6h' ? 'base' : 'outline'" @click="changeTimeRange('6h')">
                      6小时
                    </t-button>
                    <t-button :variant="timeRange === '24h' ? 'base' : 'outline'" @click="changeTimeRange('24h')">
                      24小时
                    </t-button>
                  </t-button-group>
                  <t-switch v-model="autoRefresh" :label="['自动刷新']" />
                  <t-button @click="refreshData" :loading="refreshing">
                    <t-icon name="refresh" />刷新
                  </t-button>
                </div>
              </div>

              <!-- 关键指标卡片 -->
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-icon success">
                    <t-icon name="check-circle" />
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ realTimeData.successRate }}%</div>
                    <div class="metric-label">成功率</div>
                    <div class="metric-trend" :class="{ 'up': realTimeData.successRateTrend > 0, 'down': realTimeData.successRateTrend < 0 }">
                      {{ realTimeData.successRateTrend > 0 ? '+' : '' }}{{ realTimeData.successRateTrend }}%
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-icon warning">
                    <t-icon name="time" />
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ realTimeData.avgResponseTime }}ms</div>
                    <div class="metric-label">平均响应时间</div>
                    <div class="metric-trend" :class="{ 'up': realTimeData.responseTimeTrend > 0, 'down': realTimeData.responseTimeTrend < 0 }">
                      {{ realTimeData.responseTimeTrend > 0 ? '+' : '' }}{{ realTimeData.responseTimeTrend }}ms
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-icon primary">
                    <t-icon name="rocket" />
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ realTimeData.requestCount }}</div>
                    <div class="metric-label">请求量</div>
                    <div class="metric-trend" :class="{ 'up': realTimeData.requestTrend > 0, 'down': realTimeData.requestTrend < 0 }">
                      {{ realTimeData.requestTrend > 0 ? '+' : '' }}{{ realTimeData.requestTrend }}
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-icon error">
                    <t-icon name="error-circle" />
                  </div>
                  <div class="metric-content">
                    <div class="metric-value">{{ realTimeData.errorCount }}</div>
                    <div class="metric-label">错误数</div>
                    <div class="metric-trend" :class="{ 'up': realTimeData.errorTrend > 0, 'down': realTimeData.errorTrend < 0 }">
                      {{ realTimeData.errorTrend > 0 ? '+' : '' }}{{ realTimeData.errorTrend }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 性能图表 -->
              <div class="charts-section">
                <div class="chart-container">
                  <h3>响应时间趋势</h3>
                  <div class="chart" ref="responseTimeChart"></div>
                </div>
                <div class="chart-container">
                  <h3>成功率趋势</h3>
                  <div class="chart" ref="successRateChart"></div>
                </div>
                <div class="chart-container">
                  <h3>请求量分布</h3>
                  <div class="chart" ref="requestChart"></div>
                </div>
                <div class="chart-container">
                  <h3>错误类型分布</h3>
                  <div class="chart" ref="errorChart"></div>
                </div>
              </div>

              <!-- 实时数据流 -->
              <div class="data-stream">
                <div class="section-header">
                  <h2>实时数据流</h2>
                </div>
                
                <div class="stream-container">
                  <div v-for="item in realTimeStream" :key="item.id" class="stream-item" :class="item.type">
                    <div class="stream-time">{{ formatTime(item.timestamp) }}</div>
                    <div class="stream-content">
                      <span class="stream-method" :class="item.method">{{ item.method }}</span>
                      <span class="stream-path">{{ item.path }}</span>
                      <span class="stream-status" :class="{ 'success': item.status === 200, 'error': item.status >= 400 }">
                        {{ item.status }}
                      </span>
                      <span class="stream-duration">{{ item.duration }}ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 错误详情 -->
              <div class="error-details">
                <div class="section-header">
                  <h2>错误详情</h2>
                  <t-button @click="exportErrorReport">导出报告</t-button>
                </div>
                
                <div class="error-list">
                  <div v-for="error in errorDetails" :key="error.id" class="error-item">
                    <div class="error-header">
                      <span class="error-code">{{ error.code }}</span>
                      <span class="error-message">{{ error.message }}</span>
                      <span class="error-count">{{ error.count }}次</span>
                    </div>
                    <div class="error-info">
                      <span class="error-time">最近发生: {{ formatTime(error.lastOccurred) }}</span>
                      <span class="error-rate">占比: {{ error.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'
import * as echarts from 'echarts'

export default {
  name: 'ApiDetail',
  components: {
    TIcon
  },
  data() {
    return {
      activeTab: 'call', // 默认激活调用模块
      apiInfo: {
        name: '',
        method: '',
        path: '',
        status: 'active',
        params: [],
        responseExample: null
      },
      
      // 调用模块相关数据
      paramColumns: [
        { title: '参数名', colKey: 'name', width: 120 },
        { title: '类型', colKey: 'type', width: 100 },
        { title: '是否必选', colKey: 'required', width: 100 },
        { title: '描述', colKey: 'description', width: 200 },
        { title: '示例值', colKey: 'example', width: 150 }
      ],
      testing: false,
      testResult: null,
      
      // 检测模块相关数据
      timeRange: '1h',
      refreshing: false,
      autoRefresh: true,
      realTimeData: {
        successRate: 0,
        successRateTrend: 0,
        avgResponseTime: 0,
        responseTimeTrend: 0,
        requestCount: 0,
        requestTrend: 0,
        errorCount: 0,
        errorTrend: 0
      },
      realTimeStream: [],
      errorDetails: [],
      charts: {},
      refreshTimer: null
    }
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 'monitor') {
        // 切换到监测模块时，延迟初始化图表
        this.$nextTick(() => {
          setTimeout(() => {
            this.initCharts()
          }, 100)
        })
      }
    },
    timeRange() {
      this.loadMonitoringData()
    },
    autoRefresh(val) {
      if (val) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    }
  },
  mounted() {
    this.loadApiInfo()
    this.loadMonitoringData()
    
    // 延迟初始化图表，确保DOM已经渲染
    this.$nextTick(() => {
      setTimeout(() => {
        this.initCharts()
      }, 100)
    })
    
    this.startAutoRefresh()
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    this.stopAutoRefresh()
    Object.values(this.charts).forEach(chart => chart && chart.dispose())
    
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    loadApiInfo() {
      const apiId = this.$route.query.apiId
      const systemType = this.$route.query.systemType
      
      // 模拟API信息加载
      const mockApiData = {
        'emp-list': {
          name: '获取员工列表',
          method: 'GET',
          path: '/api/employees',
          status: 'active',
          params: [
            { name: 'page', type: 'number', required: false, description: '页码', example: '1' },
            { name: 'size', type: 'number', required: false, description: '每页大小', example: '20' },
            { name: 'keyword', type: 'string', required: false, description: '搜索关键词', example: '张三' }
          ],
          responseExample: {
            code: 200,
            message: 'success',
            data: {
              total: 100,
              list: [
                { id: 1, name: '张三', department: '技术部', position: '工程师' },
                { id: 2, name: '李四', department: '产品部', position: '产品经理' }
              ]
            }
          }
        },
        'emp-create': {
          name: '创建新员工',
          method: 'POST',
          path: '/api/employees',
          status: 'active',
          params: [
            { name: 'name', type: 'string', required: true, description: '员工姓名', example: '王五' },
            { name: 'department', type: 'string', required: true, description: '部门', example: '技术部' },
            { name: 'position', type: 'string', required: true, description: '职位', example: '工程师' }
          ],
          responseExample: {
            code: 200,
            message: 'success',
            data: { id: 123, name: '王五', department: '技术部', position: '工程师' }
          }
        }
      }
      
      this.apiInfo = mockApiData[apiId] || {
        name: '未知API',
        method: 'GET',
        path: '/api/unknown',
        status: 'inactive',
        params: [],
        responseExample: null
      }
    },
    
    // 调用模块方法
    formatResponseExample(example) {
      return example ? JSON.stringify(example, null, 2) : '暂无示例数据'
    },
    
    testApiCall() {
      this.testing = true
      // 模拟API调用测试
      setTimeout(() => {
        this.testResult = {
          status: 200,
          duration: Math.floor(Math.random() * 200) + 50,
          data: this.apiInfo.responseExample || { code: 200, message: 'success', data: {} }
        }
        this.testing = false
      }, 1000)
    },
    
    resetTest() {
      this.testResult = null
    },
    
    // 检测模块方法
    initCharts() {
      const chartRefs = ['responseTimeChart', 'successRateChart', 'requestChart', 'errorChart']
      chartRefs.forEach(ref => {
        const chartDom = this.$refs[ref]
        if (chartDom && chartDom instanceof HTMLElement) {
          // 确保容器有尺寸
          if (chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
            console.warn(`图表容器尺寸为0: ${ref}`, chartDom.offsetWidth, chartDom.offsetHeight)
            return
          }
          
          // 如果已存在实例，先销毁
          if (this.charts[ref]) {
            this.charts[ref].dispose()
          }
          
          this.charts[ref] = echarts.init(chartDom)
          this.setChartOption(ref)
          console.log(`图表初始化成功: ${ref}`)
        } else {
          console.warn(`图表容器未找到: ${ref}`, chartDom)
        }
      })
    },
    
    updateCharts() {
      Object.keys(this.charts).forEach(chartKey => {
        if (this.charts[chartKey]) {
          this.setChartOption(chartKey)
        }
      })
    },
    
    setChartOption(chartKey) {
      if (!this.charts[chartKey]) {
        console.warn(`图表实例未找到: ${chartKey}`)
        return
      }
      
      const baseData = this.generateChartData(chartKey)
      
      const options = {
        responseTimeChart: {
          title: { text: '响应时间趋势', left: 'center', textStyle: { fontSize: 14 } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: baseData.xAxis,
            axisLabel: { fontSize: 10 }
          },
          yAxis: {
            type: 'value',
            name: '响应时间(ms)',
            axisLabel: { fontSize: 10 }
          },
          series: [{
            data: baseData.series,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: { color: '#1890ff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
              ])
            }
          }]
        },
        successRateChart: {
          title: { text: '成功率趋势', left: 'center', textStyle: { fontSize: 14 } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: baseData.xAxis,
            axisLabel: { fontSize: 10 }
          },
          yAxis: {
            type: 'value',
            name: '成功率(%)',
            max: 100,
            min: 0,
            axisLabel: { fontSize: 10 }
          },
          series: [{
            data: baseData.series.map(v => Math.min(v * 10, 100)),
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: { color: '#52c41a' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
              ])
            }
          }]
        },
        requestChart: {
          title: { text: '请求量分布', left: 'center', textStyle: { fontSize: 14 } },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            axisLabel: { fontSize: 10 }
          },
          yAxis: { 
            type: 'value', 
            name: '请求量',
            axisLabel: { fontSize: 10 }
          },
          series: [{
            data: [1200, 800, 600, 300, 100],
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#36cfc9' }
              ])
            }
          }]
        },
        errorChart: {
          title: { text: '错误类型分布', left: 'center', textStyle: { fontSize: 14 } },
          tooltip: { 
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: { 
            orient: 'vertical', 
            right: 10, 
            top: 'center',
            textStyle: { fontSize: 10 }
          },
          series: [{
            name: '错误类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: '500错误', itemStyle: { color: '#ff4d4f' } },
              { value: 25, name: '400错误', itemStyle: { color: '#fa8c16' } },
              { value: 20, name: '401错误', itemStyle: { color: '#faad14' } },
              { value: 15, name: '404错误', itemStyle: { color: '#fadb14' } },
              { value: 5, name: '其他错误', itemStyle: { color: '#d9d9d9' } }
            ]
          }]
        }
      }
      
      const option = options[chartKey]
      if (option) {
        this.charts[chartKey].setOption(option, true)
        this.charts[chartKey].resize()
      } else {
        console.warn(`未找到图表配置: ${chartKey}`)
      }
    },
    
    generateChartData(chartKey) {
      const hours = 24
      const xAxis = []
      const series = []
      
      for (let i = hours - 1; i >= 0; i--) {
        const hour = new Date(Date.now() - i * 60 * 60 * 1000)
        xAxis.push(hour.getHours() + ':00')
        
        // 生成模拟数据
        let baseValue = 0
        if (chartKey === 'responseTimeChart') {
          baseValue = Math.random() * 100 + 50 // 50-150ms
        } else if (chartKey === 'successRateChart') {
          baseValue = Math.random() * 5 + 95 // 95-100%
        } else {
          baseValue = Math.random() * 100 + 50
        }
        series.push(Math.round(baseValue))
      }
      
      return { xAxis, series }
    },
    
    loadMonitoringData() {
      this.refreshing = true
      
      setTimeout(() => {
        this.realTimeData = {
          successRate: Math.random() * 10 + 90,
          successRateTrend: Math.random() * 4 - 2,
          avgResponseTime: Math.random() * 200 + 100,
          responseTimeTrend: Math.random() * 40 - 20,
          requestCount: Math.floor(Math.random() * 1000) + 500,
          requestTrend: Math.floor(Math.random() * 100) - 50,
          errorCount: Math.floor(Math.random() * 10),
          errorTrend: Math.floor(Math.random() * 5) - 2
        }
        
        this.updateRealTimeStream()
        this.updateErrorDetails()
        this.updateCharts()
        this.refreshing = false
      }, 500)
    },
    
    updateRealTimeStream() {
      const methods = ['GET', 'POST', 'PUT', 'DELETE']
      const statuses = [200, 400, 401, 403, 404, 500, 502, 503]
      
      const newItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        timestamp: new Date(),
        method: methods[Math.floor(Math.random() * methods.length)],
        path: this.apiInfo.path,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        duration: Math.floor(Math.random() * 500) + 50,
        type: Math.random() > 0.9 ? 'error' : 'success'
      }
      
      if (!this.realTimeStream) this.realTimeStream = []
      this.realTimeStream.unshift(newItem)
      if (this.realTimeStream.length > 50) {
        this.realTimeStream = this.realTimeStream.slice(0, 50)
      }
    },
    
    updateErrorDetails() {
      this.errorDetails = [
        { id: 1, code: 500, message: '内部服务器错误', count: 12, lastOccurred: new Date(), percentage: 35 },
        { id: 2, code: 400, message: '请求参数错误', count: 8, lastOccurred: new Date(Date.now() - 300000), percentage: 23 },
        { id: 3, code: 401, message: '未授权访问', count: 5, lastOccurred: new Date(Date.now() - 600000), percentage: 15 },
        { id: 4, code: 404, message: '资源不存在', count: 3, lastOccurred: new Date(Date.now() - 900000), percentage: 9 }
      ]
    },
    
    changeTimeRange(range) {
      this.timeRange = range
    },
    
    refreshData() {
      this.loadMonitoringData()
    },
    
    startAutoRefresh() {
      if (this.autoRefresh) {
        this.refreshTimer = setInterval(() => {
          this.loadMonitoringData()
        }, 5000)
      }
    },
    
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    },
    
    exportErrorReport() {
      MessagePlugin.success('错误报告导出成功')
    },
    
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        chart && chart.resize()
      })
    }
  }
}
</script>

<style scoped>
.api-detail-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.api-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  color: #1890ff;
}

.api-title-section {
  flex: 1;
}

.api-title {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 24px;
}

.api-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.api-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.api-method.GET { background: #e6fffb; color: #13c2c2; }
.api-method.POST { background: #f6ffed; color: #52c41a; }
.api-method.PUT { background: #fff7e6; color: #fa8c16; }
.api-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.api-path {
  font-family: 'Monaco', 'Consolas', monospace;
  color: #8c8c8c;
}

.api-status {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.api-status.active { background: #f6ffed; color: #52c41a; }
.api-status.inactive { background: #fff1f0; color: #ff4d4f; }

.tab-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.api-tabs {
  padding: 0;
}

/* 调用模块样式 */
.call-module {
  padding: 24px;
}

.api-basic-info,
.request-params,
.response-example,
.api-test {
  margin-bottom: 32px;
}

.api-basic-info h2,
.request-params h2,
.response-example h2,
.api-test h2 {
  margin-bottom: 16px;
  color: #262626;
  font-size: 18px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.info-item label {
  font-weight: 600;
  color: #595959;
  min-width: 80px;
  margin-right: 12px;
}

.method-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.method-tag.GET { background: #e6fffb; color: #13c2c2; }
.method-tag.POST { background: #f6ffed; color: #52c41a; }
.method-tag.PUT { background: #fff7e6; color: #fa8c16; }
.method-tag.DELETE { background: #fff1f0; color: #ff4d4f; }

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag.active { background: #f6ffed; color: #52c41a; }
.status-tag.inactive { background: #fff1f0; color: #ff4d4f; }

.code-block {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.test-panel {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.test-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.test-result {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: flex-start;
}

.result-item label {
  font-weight: 600;
  color: #595959;
  min-width: 100px;
}

.result-item .success { color: #52c41a; }
.result-item .error { color: #ff4d4f; }

.response-data {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

/* 检测模块样式 */
.monitor-module {
  padding: 24px;
}

.monitoring-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  color: #262626;
  font-size: 20px;
}

.monitoring-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-icon.success { background: #f6ffed; color: #52c41a; }
.metric-icon.warning { background: #fffbe6; color: #faad14; }
.metric-icon.primary { background: #e6f7ff; color: #1890ff; }
.metric-icon.error { background: #fff1f0; color: #ff4d4f; }

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #8c8c8c;
  margin: 4px 0;
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.up { color: #52c41a; }
.metric-trend.down { color: #ff4d4f; }

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-container {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #262626;
  font-weight: 600;
}

.chart {
  height: 300px;
  width: 100%;
  min-height: 300px;
  position: relative;
}

.data-stream, .error-details {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.stream-container {
  max-height: 300px;
  overflow-y: auto;
}

.stream-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stream-item.error {
  background: #fff1f0;
}

.stream-time {
  width: 80px;
  font-size: 12px;
  color: #8c8c8c;
}

.stream-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stream-method {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.stream-method.GET { background: #e6fffb; color: #13c2c2; }
.stream-method.POST { background: #f6ffed; color: #52c41a; }
.stream-method.PUT { background: #fff7e6; color: #fa8c16; }
.stream-method.DELETE { background: #fff1f0; color: #ff4d4f; }

.stream-path {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #262626;
}

.stream-status {
  font-size: 12px;
  font-weight: 600;
}

.stream-status.success { color: #52c41a; }
.stream-status.error { color: #ff4d4f; }

.stream-duration {
  font-size: 12px;
  color: #8c8c8c;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-item {
  background: #fafafa;
  border-radius: 6px;
  padding: 16px;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.error-code {
  background: #fff1f0;
  color: #ff4d4f;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.error-message {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

.error-count {
  font-size: 12px;
  color: #8c8c8c;
}

.error-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}
</style>