<template>
  <div class="system-detail-container">
    <!-- 头部信息 -->
    <div class="system-header">
      <a-button type="link" @click="$router.back()" class="back-btn">
        <t-icon name="left" />返回首页
      </a-button>
      <h1 class="system-title">{{ systemInfo.name }}系统</h1>
      <div class="system-stats">
        <span class="api-count">API总数: {{ systemInfo.count }}</span>
      </div>
    </div>

    <!-- API列表 -->
    <div class="api-list-section">
      <h2 class="section-title">API列表</h2>
      
      <div class="api-table">
        <div v-for="api in systemInfo.apis" :key="api.id" class="api-row">
          <div class="api-method" :class="api.method.toLowerCase()">{{ api.method }}</div>
          <div class="api-info">
            <div class="api-name">{{ api.name }}</div>
            <div class="api-desc">{{ api.description }}</div>
            <div class="api-metrics">
              <span class="response-time">{{ api.avgResponseTime }}ms</span>
              <span class="success-rate" :class="{ 'high': api.successRate > 95, 'medium': api.successRate > 80 }">{{ api.successRate }}%</span>
            </div>
          </div>
          <t-button size="small" @click="viewApiDetail(api)">查看详情</t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'

export default {
  name: 'SystemDetail',
  components: {
    TIcon
  },
  data() {
    return {
      systemInfo: {
        name: '',
        type: '',
        apis: [],
        count: 0
      }
    }
  },
  mounted() {
    this.loadSystemData()
  },
  watch: {
    '$route.query.systemType': {
      handler: 'loadSystemData',
      immediate: true
    }
  },
  methods: {
    loadSystemData() {
      const systemType = this.$route.query.systemType
      console.log('加载系统数据:', systemType)
      
      if (!systemType) {
        this.$message.error('系统类型参数缺失')
        this.$router.back()
        return
      }

      const systemNames = {
        employee: '员工管理',
        organization: '组织架构', 
        attendance: '考勤管理',
        compensation: '薪酬福利',
        performance: '绩效管理',
        training: '培训发展'
      }

      const apiData = {
        employee: {
          name: '员工管理',
          apis: [
            { id: 'emp-list', method: 'GET', name: '/api/employees', description: '获取员工列表', avgResponseTime: 156, successRate: 99.2 },
            { id: 'emp-create', method: 'POST', name: '/api/employees', description: '创建新员工', avgResponseTime: 234, successRate: 98.8 },
            { id: 'emp-update', method: 'PUT', name: '/api/employees/{id}', description: '更新员工信息', avgResponseTime: 189, successRate: 99.5 }
          ],
          count: 15
        },
        organization: {
          name: '组织架构',
          apis: [
            { id: 'dept-list', method: 'GET', name: '/api/departments', description: '获取部门列表', avgResponseTime: 134, successRate: 99.6 },
            { id: 'pos-list', method: 'GET', name: '/api/positions', description: '获取职位信息', avgResponseTime: 128, successRate: 99.8 },
            { id: 'dept-create', method: 'POST', name: '/api/departments', description: '创建新部门', avgResponseTime: 267, successRate: 98.2 }
          ],
          count: 8
        },
        attendance: {
          name: '考勤管理',
          apis: [
            { id: 'att-records', method: 'GET', name: '/api/attendance/records', description: '获取考勤记录', avgResponseTime: 189, successRate: 98.9 },
            { id: 'att-checkin', method: 'POST', name: '/api/attendance/checkin', description: '员工打卡', avgResponseTime: 145, successRate: 99.1 },
            { id: 'att-summary', method: 'GET', name: '/api/attendance/summary', description: '考勤统计', avgResponseTime: 278, successRate: 97.8 }
          ],
          count: 12
        },
        compensation: {
          name: '薪酬福利',
          apis: [
            { id: 'sal-info', method: 'GET', name: '/api/salary', description: '获取薪资信息', avgResponseTime: 234, successRate: 99.4 },
            { id: 'sal-calc', method: 'POST', name: '/api/salary/calculate', description: '计算薪资', avgResponseTime: 456, successRate: 97.5 },
            { id: 'benefits-info', method: 'GET', name: '/api/benefits', description: '获取福利信息', avgResponseTime: 198, successRate: 99.0 }
          ],
          count: 10
        },
        performance: {
          name: '绩效管理',
          apis: [
            { id: 'perf-reviews', method: 'GET', name: '/api/performance/reviews', description: '获取绩效评估', avgResponseTime: 267, successRate: 98.3 },
            { id: 'perf-evaluate', method: 'POST', name: '/api/performance/evaluate', description: '提交绩效评估', avgResponseTime: 334, successRate: 96.9 },
            { id: 'perf-goals', method: 'GET', name: '/api/performance/goals', description: '获取目标管理', avgResponseTime: 145, successRate: 99.2 }
          ],
          count: 7
        },
        training: {
          name: '培训发展',
          apis: [
            { id: 'train-courses', method: 'GET', name: '/api/training/courses', description: '获取培训课程', avgResponseTime: 189, successRate: 98.7 },
            { id: 'train-enroll', method: 'POST', name: '/api/training/enroll', description: '报名培训', avgResponseTime: 223, successRate: 97.8 },
            { id: 'train-records', method: 'GET', name: '/api/training/records', description: '培训记录', avgResponseTime: 156, successRate: 99.1 }
          ],
          count: 9
        }
      }

      if (apiData[systemType]) {
        this.systemInfo = { ...apiData[systemType] }
        this.$message.success(`已加载${this.systemInfo.name}系统API列表`)
      } else {
        this.$message.error('系统类型不存在')
        this.$router.back()
      }
    },
    
    viewApiDetail(api) {
      this.$message.info(`查看API详情: ${api.name}`)
    }
  }
}
</script>

<style scoped>
.system-detail-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.system-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  color: #1890ff;
  font-size: 14px;
}

.system-title {
  margin: 0;
  color: #262626;
  font-size: 24px;
}

.system-stats {
  color: #8c8c8c;
}

.api-count {
  font-size: 16px;
  font-weight: 500;
}

.api-list-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.section-title {
  margin-bottom: 16px;
  color: #262626;
  font-size: 18px;
}

.api-table {
  margin-top: 16px;
}

.api-row {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.api-row:last-child {
  border-bottom: none;
}

.api-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.api-method.get { background: #e6fffb; color: #13c2c2; }
.api-method.post { background: #f6ffed; color: #52c41a; }
.api-method.put { background: #fff7e6; color: #fa8c16; }
.api-method.delete { background: #fff1f0; color: #ff4d4f; }

.api-info {
  flex: 1;
}

.api-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.api-desc {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 4px;
}

.api-metrics {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.response-time {
  color: #8c8c8c;
}

.success-rate {
  color: #ff4d4f;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 77, 79, 0.1);
}

.success-rate.medium {
  color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

.success-rate.high {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}
</style>