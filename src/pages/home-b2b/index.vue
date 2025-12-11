<template>
  <div class="home-b2b-container">
    <!-- 头部导航 -->
    <div class="b2b-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="b2b-title">ER API 管理中心</h1>
          <p class="b2b-subtitle">企业级API监控、分析与运维平台</p>
        </div>
        <div class="header-actions">
          <t-button theme="primary" @click="handleSwitchToC">
            <template #icon><t-icon name="switch" /></template>
            切换到C端体验
          </t-button>
          <t-button theme="default" @click="handleRefreshData">
            <template #icon><t-icon name="refresh" /></template>
            刷新数据
          </t-button>
        </div>
      </div>
    </div>

    <!-- 实时监控概览 -->
    <div class="monitoring-overview">
      <t-row :gutter="16">
        <!-- API调用总量 -->
        <t-col :span="4">
          <div class="overview-card">
            <div class="overview-icon primary">
              <t-icon name="api" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ overviewStats.totalCalls.toLocaleString() }}</div>
              <div class="overview-label">总调用量</div>
              <div class="overview-trend">
                <t-icon name="trend" class="trend-up" />
                <span class="trend-text">+{{ overviewStats.callsGrowth }}%</span>
                <span class="trend-time">过去24小时</span>
              </div>
            </div>
          </div>
        </t-col>

        <!-- 平均响应时间 -->
        <t-col :span="4">
          <div class="overview-card">
            <div class="overview-icon warning">
              <t-icon name="time" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ overviewStats.avgResponseTime }}ms</div>
              <div class="overview-label">平均响应时间</div>
              <div class="overview-trend">
                <t-icon name="trend" class="trend-down" />
                <span class="trend-text">-{{ overviewStats.responseTimeImprovement }}%</span>
                <span class="trend-time">相比昨日</span>
              </div>
            </div>
          </div>
        </t-col>

        <!-- 成功率 -->
        <t-col :span="4">
          <div class="overview-card">
            <div class="overview-icon success">
              <t-icon name="check-circle" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ overviewStats.successRate }}%</div>
              <div class="overview-label">成功率</div>
              <div class="overview-trend">
                <t-icon name="trend" class="trend-up" />
                <span class="trend-text">+{{ overviewStats.successRateGrowth }}%</span>
                <span class="trend-time">相比上周</span>
              </div>
            </div>
          </div>
        </t-col>

        <!-- 错误率 -->
        <t-col :span="4">
          <div class="overview-card">
            <div class="overview-icon danger">
              <t-icon name="error-circle" />
            </div>
            <div class="overview-content">
              <div class="overview-value">{{ overviewStats.errorRate }}%</div>
              <div class="overview-label">错误率</div>
              <div class="overview-trend">
                <t-icon name="trend" class="trend-down" />
                <span class="trend-text">-{{ overviewStats.errorRateReduction }}%</span>
                <span class="trend-time">相比昨日</span>
              </div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- 主要监控图表区域 -->
    <div class="main-charts-area">
      <t-row :gutter="20">
        <!-- API调用量趋势图表 -->
        <t-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>API调用量趋势</h3>
              <div class="chart-actions">
                <t-select v-model="apiCallsTimeRange" size="small" style="width: 120px">
                  <t-option value="1h">最近1小时</t-option>
                  <t-option value="24h">最近24小时</t-option>
                  <t-option value="7d">最近7天</t-option>
                  <t-option value="30d">最近30天</t-option>
                </t-select>
              </div>
            </div>
            <div class="chart-container">
              <div id="apiCallsChart" ref="apiCallsChart" style="width: 100%; height: 300px"></div>
            </div>
          </div>
        </t-col>

        <!-- API响应时间分布 -->
        <t-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>API响应时间分布</h3>
              <div class="chart-actions">
                <t-select v-model="responseTimeSystem" size="small" style="width: 150px">
                  <t-option value="all">全部</t-option>
                  <t-option value="groupEmployment">集团用工</t-option>
                  <t-option value="informalEmployment">非正式用工</t-option>
                  <t-option value="compliance">合规</t-option>
                  <t-option value="jingman">敬满</t-option>
                </t-select>
              </div>
            </div>
            <div class="chart-container">
              <div id="responseTimeChart" ref="responseTimeChart" style="width: 100%; height: 300px"></div>
            </div>
          </div>
        </t-col>
      </t-row>

      <!-- 第二行图表 -->
      <t-row :gutter="20" style="margin-top: 20px">
        <!-- API成功率趋势 -->
        <t-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>API成功率趋势</h3>
              <div class="chart-actions">
                <t-select v-model="successRateType" size="small" style="width: 120px">
                  <t-option value="all">全部API</t-option>
                  <t-option value="critical">核心API</t-option>
                  <t-option value="highload">高负载API</t-option>
                </t-select>
              </div>
            </div>
            <div class="chart-container">
              <div id="successRateChart" ref="successRateChart" style="width: 100%; height: 280px"></div>
            </div>
          </div>
        </t-col>

        <!-- API错误分布 -->
        <t-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3>API错误分布分析</h3>
              <div class="chart-actions">
                <t-select v-model="errorDistributionView" size="small" style="width: 120px">
                  <t-option value="by-system">按分类</t-option>
                  <t-option value="by-error">按错误类型</t-option>
                  <t-option value="by-time">按时间分布</t-option>
                </t-select>
              </div>
            </div>
            <div class="chart-container">
              <div id="errorDistributionChart" ref="errorDistributionChart" style="width: 100%; height: 280px"></div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- API性能排行榜 -->
    <div class="api-performance-ranking">
      <div class="section-header">
        <h2>API性能排行榜</h2>
        <p>按响应时间和成功率排序的关键API性能指标</p>
      </div>
      
      <div class="ranking-table">
        <t-table
          :data="performanceRanking"
          :columns="rankingColumns"
          row-key="id"
          size="medium"
          stripe
          hover
        >
          <template #responseTime="{ row }">
            <div class="metric-cell">
              <div class="metric-value">{{ row.responseTime }}ms</div>
              <div class="metric-trend" :class="{ 'trend-up': row.responseTimeTrend === 'up', 'trend-down': row.responseTimeTrend === 'down' }">
                <t-icon :name="row.responseTimeTrend === 'up' ? 'trend' : 'trend-down'" />
                {{ row.responseTimeChange }}
              </div>
            </div>
          </template>
          
          <template #successRate="{ row }">
            <div class="metric-cell">
              <div class="metric-value">{{ row.successRate }}%</div>
              <div class="metric-trend" :class="{ 'trend-up': row.successRateTrend === 'up', 'trend-down': row.successRateTrend === 'down' }">
                <t-icon :name="row.successRateTrend === 'up' ? 'trend' : 'trend-down'" />
                {{ row.successRateChange }}
              </div>
            </div>
          </template>
          
          <template #callVolume="{ row }">
            <div class="metric-cell">
              <div class="metric-value">{{ row.callVolume.toLocaleString() }}</div>
              <t-progress
                :percentage="Math.min(row.callVolume / 10000 * 100, 100)"
                :color="{ from: '#13c2c2', to: '#52c41a' }"
                :show-label="false"
                size="small"
                style="margin-top: 4px"
              />
            </div>
          </template>
          
          <template #actions="{ row }">
            <t-button size="small" variant="text" @click="viewApiDetail(row)">
              详情
            </t-button>
            <t-button size="small" variant="text" @click="debugApi(row)">
              调试
            </t-button>
          </template>
        </t-table>
      </div>
    </div>

    <!-- 实时异常监控 -->
    <div class="real-time-exceptions">
      <div class="section-header">
        <div class="header-left">
          <h2>实时异常监控</h2>
          <p>最近发生的API异常和错误</p>
        </div>
        <div class="header-right">
          <t-button theme="default" size="small" @click="viewAllExceptions">
            查看全部
          </t-button>
        </div>
      </div>
      
      <div class="exceptions-list">
        <t-row :gutter="16">
          <t-col :span="8" v-for="exception in recentExceptions" :key="exception.id">
            <div class="exception-card" :class="exception.severity">
              <div class="exception-header">
                <div class="exception-severity">
                  <t-icon :name="getExceptionIcon(exception.severity)" />
                  <span class="severity-label">{{ getExceptionLabel(exception.severity) }}</span>
                </div>
                <div class="exception-time">{{ formatExceptionTime(exception.timestamp) }}</div>
              </div>
              <div class="exception-content">
                <div class="exception-title">{{ exception.apiName }}</div>
                <div class="exception-method" :class="exception.method">{{ exception.method }}</div>
                <div class="exception-error">
                  <t-icon name="error-circle" size="16px" />
                  {{ exception.errorCode }}: {{ exception.errorMessage }}
                </div>
                <div class="exception-stats">
                  <div class="stat-item">
                    <span class="stat-label">响应时间</span>
                    <span class="stat-value">{{ exception.responseTime }}ms</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">影响用户</span>
                    <span class="stat-value">{{ exception.affectedUsers }}人</span>
                  </div>
                </div>
              </div>
              <div class="exception-actions">
                <t-button size="small" variant="text" @click="viewExceptionDetail(exception)">
                  详情
                </t-button>
                <t-button size="small" variant="text" @click="markExceptionResolved(exception)">
                  已处理
                </t-button>
              </div>
            </div>
          </t-col>
        </t-row>
      </div>
    </div>

    <!-- 健康状态 -->
    <div class="system-health">
      <div class="section-header">
        <h2>健康状态</h2>
        <p>各API的实时健康状态监控</p>
      </div>
      
      <div class="health-grid">
        <div 
          class="health-card" 
          v-for="system in systemHealth" 
          :key="system.id"
          :class="system.status"
        >
          <div class="health-header">
            <div class="health-icon">
              <t-icon :name="system.icon" />
            </div>
            <div class="health-info">
              <h3>{{ system.name }}</h3>
              <div class="health-status">{{ getHealthStatusLabel(system.status) }}</div>
            </div>
          </div>
          
          <div class="health-metrics">
            <div class="metric-row">
              <div class="metric-label">响应时间</div>
              <div class="metric-value">{{ system.responseTime }}ms</div>
              <div class="metric-trend" :class="{ 'up': system.responseTimeTrend === 'down', 'down': system.responseTimeTrend === 'up' }">
                {{ system.responseTimeChange }}
              </div>
            </div>
            <div class="metric-row">
              <div class="metric-label">成功率</div>
              <div class="metric-value">{{ system.successRate }}%</div>
              <div class="metric-trend" :class="{ 'up': system.successRateTrend === 'up', 'down': system.successRateTrend === 'down' }">
                {{ system.successRateChange }}
              </div>
            </div>
            <div class="metric-row">
              <div class="metric-label">调用量</div>
              <div class="metric-value">{{ system.callVolume.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="health-actions">
            <t-button size="small" variant="text" @click="viewSystemDetail(system)">
              详情
            </t-button>
            <t-button size="small" variant="text" @click="viewSystemMetrics(system)">
              监控
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import * as echarts from 'echarts'

export default {
  name: 'HomeB2B',
  components: {
    TIcon
  },
  data() {
    return {
      // 实时监控概览数据
      overviewStats: {
        totalCalls: 2568472,
        callsGrowth: 12.5,
        avgResponseTime: 156,
        responseTimeImprovement: 8.3,
        successRate: 99.7,
        successRateGrowth: 0.8,
        errorRate: 0.3,
        errorRateReduction: 15.2
      },
      
      // 图表时间范围选择
      apiCallsTimeRange: '24h',
      responseTimeSystem: 'all',
      successRateType: 'all',
      errorDistributionView: 'by-system',
      
      // API性能排行数据
      performanceRanking: [
        {
          id: 'group-emp-list',
          rank: 1,
          apiName: '/api/group/employees',
          system: '集团用工',
          description: '获取集团员工列表',
          responseTime: 134,
          responseTimeTrend: 'down',
          responseTimeChange: '-12ms',
          successRate: 99.8,
          successRateTrend: 'up',
          successRateChange: '+0.2%',
          callVolume: 245623,
          status: 'excellent'
        },
        {
          id: 'temp-emp-list',
          rank: 2,
          apiName: '/api/temp/employees',
          system: '非正式用工',
          description: '获取临时工列表',
          responseTime: 89,
          responseTimeTrend: 'down',
          responseTimeChange: '-5ms',
          successRate: 99.9,
          successRateTrend: 'stable',
          successRateChange: '0%',
          callVolume: 187432,
          status: 'excellent'
        },
        {
          id: 'legal-check',
          rank: 3,
          apiName: '/api/compliance/legal',
          system: '合规',
          description: '法律合规检查',
          responseTime: 156,
          responseTimeTrend: 'up',
          responseTimeChange: '+8ms',
          successRate: 99.5,
          successRateTrend: 'down',
          successRateChange: '-0.1%',
          callVolume: 156789,
          status: 'good'
        },
        {
          id: 'sal-info',
          rank: 4,
          apiName: '/api/salary',
          system: '薪酬福利',
          description: '获取薪资信息',
          responseTime: 234,
          responseTimeTrend: 'down',
          responseTimeChange: '-15ms',
          successRate: 99.6,
          successRateTrend: 'up',
          successRateChange: '+0.3%',
          callVolume: 123456,
          status: 'good'
        },
        {
          id: 'perf-reviews',
          rank: 5,
          apiName: '/api/performance/reviews',
          system: '绩效管理',
          description: '获取绩效评估',
          responseTime: 278,
          responseTimeTrend: 'up',
          responseTimeChange: '+12ms',
          successRate: 98.8,
          successRateTrend: 'down',
          successRateChange: '-0.4%',
          callVolume: 98765,
          status: 'warning'
        }
      ],
      
      // 表格列配置
      rankingColumns: [
        { title: '排名', colKey: 'rank', width: 80, align: 'center' },
        { title: 'API名称', colKey: 'apiName', width: 200 },
        { title: '所属分类', colKey: 'system', width: 120 },
        { title: '功能描述', colKey: 'description', width: 180 },
        { title: '响应时间', colKey: 'responseTime', width: 150, cell: 'responseTime' },
        { title: '成功率', colKey: 'successRate', width: 150, cell: 'successRate' },
        { title: '调用量', colKey: 'callVolume', width: 150, cell: 'callVolume' },
        { title: '状态', colKey: 'status', width: 100, cell: (h, { row }) => {
          const statusMap = {
            'excellent': { label: '优秀', color: '#52c41a' },
            'good': { label: '良好', color: '#1890ff' },
            'warning': { label: '警告', color: '#faad14' },
            'error': { label: '异常', color: '#ff4d4f' }
          };
          const status = statusMap[row.status] || { label: '未知', color: '#d9d9d9' };
          return h('span', { 
            class: 'status-badge',
            style: { 
              color: status.color,
              backgroundColor: status.color + '10',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '12px'
            }
          }, status.label);
        }},
        { title: '操作', colKey: 'actions', width: 150, cell: 'actions' }
      ],
      
      // 实时异常数据
      recentExceptions: [
        {
          id: 'exc_001',
          severity: 'critical',
          apiName: '/api/group/employees',
          method: 'GET',
          errorCode: 500,
          errorMessage: '数据库连接超时',
          responseTime: 1234,
          affectedUsers: 45,
          timestamp: new Date(Date.now() - 300000) // 5分钟前
        },
        {
          id: 'exc_002',
          severity: 'warning',
          apiName: '/api/compliance/legal',
          method: 'POST',
          errorCode: 502,
          errorMessage: '合规检查服务异常',
          responseTime: 2345,
          affectedUsers: 28,
          timestamp: new Date(Date.now() - 600000) // 10分钟前
        },
        {
          id: 'exc_003',
          severity: 'warning',
          apiName: '/api/jingman/welfare',
          method: 'GET',
          errorCode: 408,
          errorMessage: '请求超时',
          responseTime: 567,
          affectedUsers: 12,
          timestamp: new Date(Date.now() - 900000) // 15分钟前
        }
      ],
      
      // 健康状态数据
      systemHealth: [
        {
          id: 'groupEmployment',
          name: '集团用工',
          icon: 'usergroup',
          status: 'healthy',
          responseTime: 134,
          responseTimeTrend: 'down',
          responseTimeChange: '-8ms',
          successRate: 99.8,
          successRateTrend: 'up',
          successRateChange: '+0.2%',
          callVolume: 245623
        },
        {
          id: 'informalEmployment',
          name: '非正式用工',
          icon: 'user',
          status: 'healthy',
          responseTime: 89,
          responseTimeTrend: 'down',
          responseTimeChange: '-5ms',
          successRate: 99.9,
          successRateTrend: 'stable',
          successRateChange: '0%',
          callVolume: 187432
        },
        {
          id: 'compliance',
          name: '合规',
          icon: 'secured',
          status: 'warning',
          responseTime: 156,
          responseTimeTrend: 'up',
          responseTimeChange: '+8ms',
          successRate: 99.5,
          successRateTrend: 'down',
          successRateChange: '-0.1%',
          callVolume: 156789
        },
        {
          id: 'jingman',
          name: '敬满',
          icon: 'heart',
          status: 'healthy',
          responseTime: 234,
          responseTimeTrend: 'down',
          responseTimeChange: '-15ms',
          successRate: 99.6,
          successRateTrend: 'up',
          successRateChange: '+0.3%',
          callVolume: 123456
        }
      ],
      
      // ECharts实例
      apiCallsChart: null,
      responseTimeChart: null,
      successRateChart: null,
      errorDistributionChart: null
    }
  },
  
  watch: {
    apiCallsTimeRange() {
      this.refreshApiCallsChart();
    },
    responseTimeSystem() {
      this.refreshResponseTimeChart();
    },
    successRateType() {
      this.refreshSuccessRateChart();
    },
    errorDistributionView() {
      this.refreshErrorDistributionChart();
    }
  },
  
  mounted() {
    // 页面加载完成后初始化所有图表
    this.$nextTick(() => {
      this.refreshAllCharts();
    });
    
    // 定时刷新数据
    this.dataRefreshTimer = setInterval(() => {
      this.refreshRealTimeData();
    }, 30000); // 每30秒刷新一次
  },
  
  beforeDestroy() {
    // 清理定时器
    if (this.dataRefreshTimer) {
      clearInterval(this.dataRefreshTimer);
    }
    
    // 销毁图表实例
    if (this.apiCallsChart) {
      this.apiCallsChart.dispose();
    }
    if (this.responseTimeChart) {
      this.responseTimeChart.dispose();
    }
    if (this.successRateChart) {
      this.successRateChart.dispose();
    }
    if (this.errorDistributionChart) {
      this.errorDistributionChart.dispose();
    }
  },
  
  methods: {
    // 页面交互方法
    handleSwitchToC() {
      this.$router.push('/');
      this.$message.success('已切换到C端体验版');
    },
    
    handleRefreshData() {
      this.$message.success('数据刷新中...');
      // 模拟数据刷新
      setTimeout(() => {
        this.refreshAllCharts();
        this.$message.success('数据已刷新');
      }, 1000);
    },
    
    viewApiDetail(api) {
      this.$router.push({
        path: '/api-detail',
        query: { 
          apiId: api.id,
          systemType: api.system === '集团用工' ? 'groupEmployment' : 
                     api.system === '非正式用工' ? 'informalEmployment' : 
                     api.system === '合规' ? 'compliance' : 
                     api.system === '敬满' ? 'jingman' : 'groupEmployment'
        }
      });
    },
    
    debugApi(api) {
      this.$router.push({
        path: '/api-debug',
        query: {
          url: `https://api.er.com/v1${api.apiName.replace('/api', '')}`,
          method: 'GET',
          apiName: api.description,
          apiId: api.id,
          locked: 'true'
        }
      });
    },
    
    viewAllExceptions() {
      this.$message.info('跳转到异常管理页面');
    },
    
    viewExceptionDetail(exception) {
      this.$message.info(`查看异常详情: ${exception.apiName}`);
    },
    
    markExceptionResolved(exception) {
      this.recentExceptions = this.recentExceptions.filter(e => e.id !== exception.id);
      this.$message.success('异常已标记为已处理');
    },
    
    viewSystemDetail(system) {
      this.$router.push({
        name: 'SystemDetail',
        query: { systemType: system.id }
      });
    },
    
    viewSystemMetrics(system) {
      this.$message.info(`查看${system.name}监控指标`);
    },
    
    // 异常处理辅助方法
    getExceptionIcon(severity) {
      return severity === 'critical' ? 'error-circle' : 'error-triangle';
    },
    
    getExceptionLabel(severity) {
      return severity === 'critical' ? '严重' : '警告';
    },
    
    formatExceptionTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return timestamp.toLocaleString('zh-CN', { 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    },
    
    // 健康状态辅助方法
    getHealthStatusLabel(status) {
      const statusMap = {
        'healthy': '健康',
        'warning': '警告',
        'error': '异常'
      };
      return statusMap[status] || '未知';
    },
    
    // 数据生成方法
    generateCallsData(timeRange) {
      let labels = [];
      let data = [];
      
      switch (timeRange) {
        case '1h':
          // 生成最近1小时每分钟的数据
          for (let i = 59; i >= 0; i--) {
            const time = new Date(Date.now() - i * 60000);
            labels.push(time.getMinutes().toString().padStart(2, '0'));
            data.push(Math.floor(Math.random() * 5000) + 1000);
          }
          break;
        case '24h':
          // 生成最近24小时每小时的数据
          for (let i = 23; i >= 0; i--) {
            const time = new Date(Date.now() - i * 3600000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
            data.push(Math.floor(Math.random() * 20000) + 50000);
          }
          break;
        case '7d':
          // 生成最近7天每天的数据
          const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
          labels = days;
          for (let i = 0; i < 7; i++) {
            data.push(Math.floor(Math.random() * 150000) + 300000);
          }
          break;
        case '30d':
          // 生成最近30天每天的数据（简化显示）
          for (let i = 29; i >= 0; i -= 3) {
            const date = new Date(Date.now() - i * 86400000);
            labels.push((date.getMonth() + 1) + '/' + date.getDate());
            data.push(Math.floor(Math.random() * 200000) + 400000);
          }
          break;
        default:
          labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
          data = [58000, 62000, 75000, 89000, 72000, 63000];
      }
      
      return { labels, data };
    },
    
    generateResponseTimeData(system) {
      const systems = ['集团用工', '非正式用工', '合规', '敬满'];
      const apis = [
        '/api/employees',
        '/api/departments', 
        '/api/attendance/records',
        '/api/salary',
        '/api/performance/reviews',
        '/api/training/courses'
      ];
      
      let labels = [];
      let values = [];
      
      if (system === 'all') {
        labels = systems;
        values = [134, 89, 156, 234, 278, 189];
      } else {
        // 生成指定分类下的API响应时间
        const systemApis = {
          'employee': ['/api/employees', '/api/employees/{id}', '/api/employees/search'],
          'organization': ['/api/departments', '/api/positions', '/api/organizations'],
          'attendance': ['/api/attendance/records', '/api/attendance/checkin', '/api/attendance/summary'],
          'compensation': ['/api/salary', '/api/salary/calculate', '/api/benefits']
        };
        
        labels = systemApis[system] || ['API1', 'API2', 'API3'];
        values = labels.map(() => Math.floor(Math.random() * 300) + 100);
      }
      
      return { labels, values };
    },
    
    generateSuccessRateData(type) {
      let labels = [];
      let data = [];
      
      // 生成最近7天的成功率数据
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      labels = days;
      
      switch (type) {
        case 'all':
          data = [99.2, 99.3, 99.5, 99.6, 99.7, 99.8, 99.7];
          break;
        case 'critical':
          data = [99.0, 99.1, 99.2, 99.3, 99.4, 99.5, 99.6];
          break;
        case 'highload':
          data = [99.5, 99.6, 99.7, 99.8, 99.7, 99.8, 99.9];
          break;
        default:
          data = [99.2, 99.3, 99.5, 99.6, 99.7, 99.8, 99.7];
      }
      
      return { labels, data };
    },
    
    generateErrorDistributionOption(view) {
      switch (view) {
        case 'by-system':
          return {
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              top: 'center',
              data: ['集团用工', '非正式用工', '合规', '敬满']
            },
            series: [{
              name: '错误分布',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                formatter: '{b}: {c} ({d}%)'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              data: [
                { value: 45, name: '集团用工', itemStyle: { color: '#1890ff' } },
                { value: 28, name: '非正式用工', itemStyle: { color: '#52c41a' } },
                { value: 67, name: '合规', itemStyle: { color: '#faad14' } },
                { value: 35, name: '敬满', itemStyle: { color: '#722ed1' } }
              ]
            }]
          };
          
        case 'by-error':
          return {
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              top: 'center',
              data: ['500: 服务器错误', '502: 网关错误', '408: 请求超时', '429: 请求频率过高', '其他错误']
            },
            series: [{
              name: '错误类型',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                formatter: '{b}: {c} ({d}%)'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              data: [
                { value: 58, name: '500: 服务器错误', itemStyle: { color: '#ff4d4f' } },
                { value: 34, name: '502: 网关错误', itemStyle: { color: '#faad14' } },
                { value: 27, name: '408: 请求超时', itemStyle: { color: '#1890ff' } },
                { value: 19, name: '429: 请求频率过高', itemStyle: { color: '#52c41a' } },
                { value: 12, name: '其他错误', itemStyle: { color: '#722ed1' } }
              ]
            }]
          };
          
        case 'by-time':
          return {
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '12%',
              top: '10%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ['0-2点', '2-4点', '4-6点', '6-8点', '8-10点', '10-12点', '12-14点', '14-16点', '16-18点', '18-20点', '20-22点', '22-24点'],
              axisLine: {
                lineStyle: { color: '#d9d9d9' }
              },
              axisLabel: {
                color: '#666',
                rotate: 45
              }
            },
            yAxis: {
              type: 'value',
              name: '错误次数',
              axisLine: {
                lineStyle: { color: '#d9d9d9' }
              },
              axisLabel: {
                color: '#666'
              }
            },
            series: [{
              name: '错误分布',
              type: 'bar',
              barWidth: '60%',
              itemStyle: {
                color: '#ff4d4f'
              },
              data: [2, 1, 0, 3, 8, 12, 15, 18, 22, 16, 9, 4]
            }]
          };
          
        default:
          return {};
      }
    },
    
    // 实时数据刷新
    refreshRealTimeData() {
      // 模拟实时数据更新
      this.overviewStats.totalCalls += Math.floor(Math.random() * 1000);
      
      // 更新图表数据
      this.refreshApiCallsChart();
    },
    
    // 图表初始化方法
    refreshAllCharts() {
      this.initApiCallsChart();
      this.initResponseTimeChart();
      this.initSuccessRateChart();
      this.initErrorDistributionChart();
    },
    
    refreshApiCallsChart() {
      if (this.apiCallsChart) {
        this.apiCallsChart.dispose();
      }
      this.initApiCallsChart();
    },
    
    refreshResponseTimeChart() {
      if (this.responseTimeChart) {
        this.responseTimeChart.dispose();
      }
      this.initResponseTimeChart();
    },
    
    refreshSuccessRateChart() {
      if (this.successRateChart) {
        this.successRateChart.dispose();
      }
      this.initSuccessRateChart();
    },
    
    refreshErrorDistributionChart() {
      if (this.errorDistributionChart) {
        this.errorDistributionChart.dispose();
      }
      this.initErrorDistributionChart();
    },
    
    initApiCallsChart() {
      const chartDom = this.$refs.apiCallsChart;
      if (!chartDom) return;
      
      this.apiCallsChart = echarts.init(chartDom);
      
      // 根据选择的时间范围生成数据
      const timeRange = this.apiCallsTimeRange;
      const { labels, data } = this.generateCallsData(timeRange);
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = params[0].axisValue + '<br/>';
            params.forEach(item => {
              result += `${item.marker} ${item.seriesName}: ${item.value.toLocaleString()} 次<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['API调用量'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          name: '调用量（次）',
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666',
            formatter: function(value) {
              if (value >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value;
            }
          }
        },
        series: [{
          name: 'API调用量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#1890ff'
          },
          itemStyle: {
            color: '#1890ff',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            opacity: 0.1,
            color: '#1890ff'
          },
          data: data
        }]
      };
      
      this.apiCallsChart.setOption(option);
      
      // 添加resize监听
      window.addEventListener('resize', () => {
        this.apiCallsChart.resize();
      });
    },
    
    initResponseTimeChart() {
      const chartDom = this.$refs.responseTimeChart;
      if (!chartDom) return;
      
      this.responseTimeChart = echarts.init(chartDom);
      
      const system = this.responseTimeSystem;
      const data = this.generateResponseTimeData(system);
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['响应时间'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.labels,
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666',
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '响应时间（ms）',
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: '响应时间',
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: function(params) {
              const value = params.data;
              if (value > 500) return '#ff4d4f';
              if (value > 300) return '#faad14';
              if (value > 200) return '#1890ff';
              return '#52c41a';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}ms'
          },
          data: data.values
        }]
      };
      
      this.responseTimeChart.setOption(option);
      
      window.addEventListener('resize', () => {
        this.responseTimeChart.resize();
      });
    },
    
    initSuccessRateChart() {
      const chartDom = this.$refs.successRateChart;
      if (!chartDom) return;
      
      this.successRateChart = echarts.init(chartDom);
      
      const type = this.successRateType;
      const { labels, data } = this.generateSuccessRateData(type);
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['成功率'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          name: '成功率（%）',
          min: 95,
          max: 100,
          axisLine: {
            lineStyle: { color: '#d9d9d9' }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          }
        },
        series: [{
          name: '成功率',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#52c41a'
          },
          itemStyle: {
            color: '#52c41a',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            opacity: 0.1,
            color: '#52c41a'
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: '#ff4d4f',
              type: 'dashed'
            },
            data: [{
              yAxis: 99,
              label: {
                formatter: '目标线: 99%'
              }
            }]
          },
          data: data
        }]
      };
      
      this.successRateChart.setOption(option);
      
      window.addEventListener('resize', () => {
        this.successRateChart.resize();
      });
    },
    
    initErrorDistributionChart() {
      const chartDom = this.$refs.errorDistributionChart;
      if (!chartDom) return;
      
      this.errorDistributionChart = echarts.init(chartDom);
      
      const view = this.errorDistributionView;
      const option = this.generateErrorDistributionOption(view);
      
      this.errorDistributionChart.setOption(option);
      
      window.addEventListener('resize', () => {
        this.errorDistributionChart.resize();
      });
    }
  }
}
</script>

<style scoped>
.home-b2b-container {
  padding: 0;
  background-color: var(--td-bg-color-container);
  min-height: 100vh;
}

/* 头部样式 */
.b2b-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 36px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.b2b-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.b2b-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 监控概览样式 */
.monitoring-overview {
  max-width: 1400px;
  margin: -24px auto 32px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.overview-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.overview-icon.primary { 
  background: linear-gradient(135deg, #1890ff 0%, #69c0ff 100%); 
  color: white; 
}
.overview-icon.warning { 
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%); 
  color: white; 
}
.overview-icon.success { 
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%); 
  color: white; 
}
.overview-icon.danger { 
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%); 
  color: white; 
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--td-text-color-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin-bottom: 8px;
}

.overview-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #ff4d4f;
  transform: rotate(180deg);
}

.trend-text {
  font-weight: 500;
}

.trend-time {
  color: var(--td-text-color-secondary);
  margin-left: 4px;
}

/* 主图表区域 */
.main-charts-area {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  height: 100%;
}

.chart-card:hover {
  transform: translateY(-2px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--td-text-color-primary);
}

.chart-actions {
  display: flex;
  gap: 12px;
}

.chart-container {
  position: relative;
}

/* 通用区块样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--td-text-color-primary);
}

.section-header p {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

/* API性能排行榜 */
.api-performance-ranking {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

.ranking-table {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metric-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.metric-trend.trend-up {
  color: #52c41a;
}

.metric-trend.trend-down {
  color: #ff4d4f;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* 实时异常监控 */
.real-time-exceptions {
  max-width: 1400px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

.exceptions-list {
  margin-top: 24px;
}

.exception-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: transform 0.2s;
  border-left: 4px solid;
}

.exception-card:hover {
  transform: translateY(-2px);
}

.exception-card.critical {
  border-left-color: #ff4d4f;
}

.exception-card.warning {
  border-left-color: #faad14;
}

.exception-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--td-component-border);
}

.exception-severity {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.exception-card.critical .exception-severity {
  color: #ff4d4f;
}

.exception-card.warning .exception-severity {
  color: #faad14;
}

.severity-label {
  font-size: 14px;
}

.exception-time {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.exception-content {
  margin-bottom: 16px;
}

.exception-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--td-text-color-primary);
}

.exception-method {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
}

.exception-method.GET { 
  background: #e6fffb; 
  color: #13c2c2; 
}
.exception-method.POST { 
  background: #f6ffed; 
  color: #52c41a; 
}
.exception-method.PUT { 
  background: #fff7e6; 
  color: #fa8c16; 
}

.exception-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--td-text-color-secondary);
  margin-bottom: 16px;
}

.exception-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.exception-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 健康状态 */
.system-health {
  max-width: 1400px;
  margin: 0 auto 48px;
  padding: 0 24px;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.health-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.health-card:hover {
  transform: translateY(-2px);
}

.health-card.healthy {
  border-color: #52c41a;
}

.health-card.warning {
  border-color: #faad14;
}

.health-card.error {
  border-color: #ff4d4f;
}

.health-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.health-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, #f6f6f6 0%, #e9e9e9 100%);
  color: var(--td-text-color-primary);
}

.health-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.health-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.health-card.healthy .health-status {
  background: #f6ffed;
  color: #52c41a;
}

.health-card.warning .health-status {
  background: #fffbe6;
  color: #faad14;
}

.health-card.error .health-status {
  background: #fff1f0;
  color: #ff4d4f;
}

.health-metrics {
  margin-bottom: 16px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--td-component-border);
}

.metric-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.metric-label {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 8px;
}

.metric-trend.up {
  background: #f6ffed;
  color: #52c41a;
}

.metric-trend.down {
  background: #fff1f0;
  color: #ff4d4f;
}

.health-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .health-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .monitoring-overview {
    margin-top: 0;
  }
  
  .overview-card {
    margin-bottom: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .health-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .b2b-header {
    padding: 24px 16px;
  }
  
  .b2b-title {
    font-size: 24px;
  }
  
  .overview-value {
    font-size: 22px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
}
</style>