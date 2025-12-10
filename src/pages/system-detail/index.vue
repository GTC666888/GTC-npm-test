<template>
  <div class="system-detail-container">
    <!-- 头部信息 -->
    <div class="system-header">
      <a-button type="link" @click="$router.back()" class="back-btn">
        <t-icon name="left" />返回首页
      </a-button>
      <h1 class="system-title">{{ systemInfo.name }}</h1>
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
      console.log('加载数据:', systemType)
      
      if (!systemType) {
        this.$message.error('类型参数缺失')
        this.$router.back()
        return
      }

      const systemNames = {
        groupEmployment: '集团用工',
        informalEmployment: '非正式用工', 
        compliance: '合规',
        jingman: '敬满'
      }

      const apiData = {
        groupEmployment: {
          name: '集团用工',
          apis: [
            { id: 'group-emp-list', method: 'GET', name: '/api/group/employees', description: '获取集团员工列表', avgResponseTime: 156, successRate: 99.2 },
            { id: 'group-emp-create', method: 'POST', name: '/api/group/employees', description: '创建集团员工', avgResponseTime: 234, successRate: 98.8 },
            { id: 'group-contract', method: 'GET', name: '/api/group/contracts', description: '集团劳动合同管理', avgResponseTime: 189, successRate: 99.5 },
            { id: 'group-transfer', method: 'POST', name: '/api/group/transfer', description: '集团内部调动', avgResponseTime: 267, successRate: 98.3 },
            { id: 'group-onboard', method: 'POST', name: '/api/group/onboard', description: '入职办理', avgResponseTime: 178, successRate: 99.1 },
            { id: 'group-offboard', method: 'POST', name: '/api/group/offboard', description: '离职办理', avgResponseTime: 198, successRate: 98.9 },
            { id: 'group-dispatch', method: 'POST', name: '/api/group/dispatch', description: '派驻管理', avgResponseTime: 212, successRate: 99.0 },
            { id: 'group-alumni', method: 'GET', name: '/api/group/alumni', description: '校友会管理', avgResponseTime: 145, successRate: 99.4 },
            { id: 'group-position', method: 'GET', name: '/api/group/positions', description: '职位信息查询', avgResponseTime: 123, successRate: 99.6 },
            { id: 'group-dept', method: 'GET', name: '/api/group/departments', description: '部门信息查询', avgResponseTime: 134, successRate: 99.5 },
            { id: 'group-rank', method: 'GET', name: '/api/group/ranks', description: '职级信息查询', avgResponseTime: 118, successRate: 99.7 },
            { id: 'group-probation', method: 'POST', name: '/api/group/probation', description: '试用期管理', avgResponseTime: 187, successRate: 98.8 },
            { id: 'group-regular', method: 'POST', name: '/api/group/regular', description: '转正办理', avgResponseTime: 203, successRate: 99.2 },
            { id: 'group-renew', method: 'POST', name: '/api/group/renew', description: '合同续签', avgResponseTime: 225, successRate: 98.7 },
            { id: 'group-history', method: 'GET', name: '/api/group/history', description: '员工履历查询', avgResponseTime: 167, successRate: 99.3 },
            { id: 'group-cert', method: 'GET', name: '/api/group/certificates', description: '证书资质查询', avgResponseTime: 145, successRate: 99.4 },
            { id: 'group-edu', method: 'GET', name: '/api/group/education', description: '学历信息查询', avgResponseTime: 128, successRate: 99.6 },
            { id: 'group-family', method: 'GET', name: '/api/group/family', description: '家庭成员信息', avgResponseTime: 136, successRate: 99.5 },
            { id: 'group-emergency', method: 'GET', name: '/api/group/emergency', description: '紧急联系人', avgResponseTime: 112, successRate: 99.8 },
            { id: 'group-bank', method: 'GET', name: '/api/group/bank', description: '银行卡信息', avgResponseTime: 98, successRate: 99.9 },
            { id: 'group-social', method: 'GET', name: '/api/group/social', description: '社保公积金信息', avgResponseTime: 156, successRate: 99.2 },
            { id: 'group-leave-type', method: 'GET', name: '/api/group/leave-types', description: '假期类型查询', avgResponseTime: 89, successRate: 99.9 },
            { id: 'group-org-change', method: 'POST', name: '/api/group/org-change', description: '组织架构变更', avgResponseTime: 278, successRate: 98.5 },
            { id: 'group-batch-import', method: 'POST', name: '/api/group/batch-import', description: '批量导入员工', avgResponseTime: 456, successRate: 97.8 },
            { id: 'group-batch-export', method: 'GET', name: '/api/group/batch-export', description: '批量导出员工', avgResponseTime: 345, successRate: 98.2 },
            { id: 'group-photo', method: 'POST', name: '/api/group/photo', description: '员工照片上传', avgResponseTime: 234, successRate: 99.0 },
            { id: 'group-sign', method: 'POST', name: '/api/group/sign', description: '电子签名管理', avgResponseTime: 189, successRate: 99.3 },
            { id: 'group-archive', method: 'GET', name: '/api/group/archive', description: '档案管理', avgResponseTime: 167, successRate: 99.4 },
            { id: 'group-blacklist', method: 'GET', name: '/api/group/blacklist', description: '黑名单查询', avgResponseTime: 98, successRate: 99.8 },
            { id: 'group-rehire', method: 'POST', name: '/api/group/rehire', description: '返聘管理', avgResponseTime: 245, successRate: 98.6 },
            { id: 'group-secondment', method: 'POST', name: '/api/group/secondment', description: '借调管理', avgResponseTime: 223, successRate: 98.9 },
            { id: 'group-report', method: 'GET', name: '/api/group/report', description: '人事报表', avgResponseTime: 312, successRate: 98.4 }
          ],
          count: 32
        },
        informalEmployment: {
          name: '非正式用工',
          apis: [
            { id: 'temp-emp-list', method: 'GET', name: '/api/temp/employees', description: '获取临时工列表', avgResponseTime: 134, successRate: 99.6 },
            { id: 'temp-contract', method: 'POST', name: '/api/temp/contracts', description: '临时工合同管理', avgResponseTime: 128, successRate: 99.8 },
            { id: 'outsource-manage', method: 'GET', name: '/api/outsource/manage', description: '外包人员管理', avgResponseTime: 267, successRate: 98.2 },
            { id: 'flexible-work', method: 'POST', name: '/api/flexible/work', description: '灵活用工管理', avgResponseTime: 189, successRate: 98.9 },
            { id: 'oa-account-create', method: 'POST', name: '/api/oa/account/create', description: 'OA账号创建', avgResponseTime: 156, successRate: 99.3 },
            { id: 'oa-account-disable', method: 'POST', name: '/api/oa/account/disable', description: 'OA账号禁用', avgResponseTime: 112, successRate: 99.7 },
            { id: 'oa-account-query', method: 'GET', name: '/api/oa/account/query', description: 'OA账号查询', avgResponseTime: 89, successRate: 99.9 },
            { id: 'func-perm-grant', method: 'POST', name: '/api/permission/grant', description: '功能权限授予', avgResponseTime: 178, successRate: 99.1 },
            { id: 'func-perm-revoke', method: 'POST', name: '/api/permission/revoke', description: '功能权限撤销', avgResponseTime: 145, successRate: 99.4 },
            { id: 'func-perm-query', method: 'GET', name: '/api/permission/query', description: '功能权限查询', avgResponseTime: 98, successRate: 99.8 },
            { id: 'site-access-grant', method: 'POST', name: '/api/site/access/grant', description: '站点访问授权', avgResponseTime: 167, successRate: 99.2 },
            { id: 'site-access-revoke', method: 'POST', name: '/api/site/access/revoke', description: '站点访问撤销', avgResponseTime: 134, successRate: 99.5 },
            { id: 'site-access-query', method: 'GET', name: '/api/site/access/query', description: '站点访问查询', avgResponseTime: 112, successRate: 99.7 },
            { id: 'restrict-list-add', method: 'POST', name: '/api/restrict/add', description: '限制性名单添加', avgResponseTime: 189, successRate: 98.9 },
            { id: 'restrict-list-remove', method: 'DELETE', name: '/api/restrict/remove', description: '限制性名单移除', avgResponseTime: 156, successRate: 99.2 },
            { id: 'restrict-list-query', method: 'GET', name: '/api/restrict/query', description: '限制性名单查询', avgResponseTime: 98, successRate: 99.8 },
            { id: 'blacklist-add', method: 'POST', name: '/api/blacklist/add', description: '黑名单添加', avgResponseTime: 178, successRate: 99.0 },
            { id: 'blacklist-remove', method: 'DELETE', name: '/api/blacklist/remove', description: '黑名单移除', avgResponseTime: 145, successRate: 99.3 },
            { id: 'blacklist-query', method: 'GET', name: '/api/blacklist/query', description: '黑名单查询', avgResponseTime: 89, successRate: 99.9 },
            { id: 'subsidiary-emp-list', method: 'GET', name: '/api/subsidiary/employees', description: '直管子公司员工列表', avgResponseTime: 198, successRate: 98.8 },
            { id: 'subsidiary-emp-sync', method: 'POST', name: '/api/subsidiary/sync', description: '直管子公司数据同步', avgResponseTime: 345, successRate: 97.9 },
            { id: 'q-outsource-list', method: 'GET', name: '/api/q-outsource/list', description: 'Q外包人员列表', avgResponseTime: 156, successRate: 99.4 },
            { id: 'q-outsource-create', method: 'POST', name: '/api/q-outsource/create', description: 'Q外包人员创建', avgResponseTime: 234, successRate: 98.7 },
            { id: 'q-outsource-update', method: 'PUT', name: '/api/q-outsource/update', description: 'Q外包人员更新', avgResponseTime: 189, successRate: 99.1 },
            { id: 'q-outsource-delete', method: 'DELETE', name: '/api/q-outsource/delete', description: 'Q外包人员删除', avgResponseTime: 145, successRate: 99.5 },
            { id: 'intern-manage', method: 'GET', name: '/api/intern/manage', description: '实习生管理', avgResponseTime: 167, successRate: 99.3 },
            { id: 'intern-convert', method: 'POST', name: '/api/intern/convert', description: '实习生转正', avgResponseTime: 223, successRate: 98.9 },
            { id: 'labor-dispatch', method: 'GET', name: '/api/labor/dispatch', description: '劳务派遣管理', avgResponseTime: 198, successRate: 99.0 }
          ],
          count: 28
        },
        compliance: {
          name: '合规',
          apis: [
            { id: 'legal-check', method: 'GET', name: '/api/compliance/legal', description: '法律合规检查', avgResponseTime: 189, successRate: 98.9 },
            { id: 'audit-report', method: 'POST', name: '/api/compliance/audit', description: '合规审计报告', avgResponseTime: 145, successRate: 99.1 },
            { id: 'risk-assess', method: 'GET', name: '/api/compliance/risk', description: '风险评估管理', avgResponseTime: 278, successRate: 97.8 },
            { id: 'policy-check', method: 'POST', name: '/api/compliance/policy', description: '政策合规验证', avgResponseTime: 234, successRate: 99.4 },
            { id: 'appeal-submit', method: 'POST', name: '/api/appeal/submit', description: '申诉提交', avgResponseTime: 156, successRate: 99.3 },
            { id: 'appeal-query', method: 'GET', name: '/api/appeal/query', description: '申诉查询', avgResponseTime: 112, successRate: 99.7 },
            { id: 'appeal-process', method: 'PUT', name: '/api/appeal/process', description: '申诉处理', avgResponseTime: 198, successRate: 98.8 },
            { id: 'appeal-close', method: 'POST', name: '/api/appeal/close', description: '申诉关闭', avgResponseTime: 134, successRate: 99.5 },
            { id: 'labor-law-check', method: 'GET', name: '/api/labor-law/check', description: '劳动法合规检查', avgResponseTime: 267, successRate: 98.2 },
            { id: 'contract-compliance', method: 'GET', name: '/api/contract/compliance', description: '合同合规审查', avgResponseTime: 223, successRate: 98.9 },
            { id: 'salary-compliance', method: 'GET', name: '/api/salary/compliance', description: '薪资合规检查', avgResponseTime: 189, successRate: 99.1 },
            { id: 'overtime-compliance', method: 'GET', name: '/api/overtime/compliance', description: '加班合规检查', avgResponseTime: 156, successRate: 99.4 },
            { id: 'leave-compliance', method: 'GET', name: '/api/leave/compliance', description: '休假合规检查', avgResponseTime: 134, successRate: 99.6 },
            { id: 'social-insurance-check', method: 'GET', name: '/api/social-insurance/check', description: '社保合规检查', avgResponseTime: 178, successRate: 99.2 },
            { id: 'tax-compliance', method: 'GET', name: '/api/tax/compliance', description: '税务合规检查', avgResponseTime: 198, successRate: 98.9 },
            { id: 'data-privacy-check', method: 'GET', name: '/api/data-privacy/check', description: '数据隐私合规', avgResponseTime: 145, successRate: 99.5 },
            { id: 'gdpr-compliance', method: 'GET', name: '/api/gdpr/compliance', description: 'GDPR合规检查', avgResponseTime: 212, successRate: 98.7 },
            { id: 'audit-log', method: 'GET', name: '/api/audit/log', description: '审计日志查询', avgResponseTime: 89, successRate: 99.9 },
            { id: 'compliance-report', method: 'GET', name: '/api/compliance/report', description: '合规报告生成', avgResponseTime: 345, successRate: 98.1 },
            { id: 'violation-record', method: 'GET', name: '/api/violation/record', description: '违规记录查询', avgResponseTime: 123, successRate: 99.6 },
            { id: 'violation-handle', method: 'POST', name: '/api/violation/handle', description: '违规处理', avgResponseTime: 234, successRate: 98.8 },
            { id: 'compliance-train', method: 'GET', name: '/api/compliance/training', description: '合规培训记录', avgResponseTime: 156, successRate: 99.3 },
            { id: 'ethics-report', method: 'POST', name: '/api/ethics/report', description: '道德举报', avgResponseTime: 178, successRate: 99.1 },
            { id: 'compliance-cert', method: 'GET', name: '/api/compliance/certificate', description: '合规证书管理', avgResponseTime: 134, successRate: 99.5 }
          ],
          count: 24
        },
        jingman: {
          name: '敬满',
          apis: [
            { id: 'jm-employee', method: 'GET', name: '/api/jingman/employees', description: '敬满员工管理', avgResponseTime: 234, successRate: 99.4 },
            { id: 'jm-welfare', method: 'POST', name: '/api/jingman/welfare', description: '敬满福利管理', avgResponseTime: 456, successRate: 97.5 },
            { id: 'jm-service', method: 'GET', name: '/api/jingman/service', description: '敬满服务管理', avgResponseTime: 198, successRate: 99.0 },
            { id: 'jm-support', method: 'POST', name: '/api/jingman/support', description: '敬满支持服务', avgResponseTime: 189, successRate: 98.7 },
            { id: 'jm-satisfaction', method: 'GET', name: '/api/jingman/satisfaction', description: '员工满意度调查', avgResponseTime: 156, successRate: 99.3 },
            { id: 'jm-feedback', method: 'POST', name: '/api/jingman/feedback', description: '员工反馈提交', avgResponseTime: 134, successRate: 99.6 },
            { id: 'jm-care', method: 'GET', name: '/api/jingman/care', description: '员工关怀服务', avgResponseTime: 178, successRate: 99.1 },
            { id: 'jm-birthday', method: 'GET', name: '/api/jingman/birthday', description: '生日祝福管理', avgResponseTime: 98, successRate: 99.8 },
            { id: 'jm-anniversary', method: 'GET', name: '/api/jingman/anniversary', description: '入职周年管理', avgResponseTime: 112, successRate: 99.7 },
            { id: 'jm-health', method: 'GET', name: '/api/jingman/health', description: '员工健康管理', avgResponseTime: 167, successRate: 99.2 },
            { id: 'jm-eap', method: 'GET', name: '/api/jingman/eap', description: 'EAP心理援助', avgResponseTime: 189, successRate: 98.9 },
            { id: 'jm-activity', method: 'GET', name: '/api/jingman/activity', description: '员工活动管理', avgResponseTime: 145, successRate: 99.4 },
            { id: 'jm-club', method: 'GET', name: '/api/jingman/club', description: '员工社团管理', avgResponseTime: 123, successRate: 99.5 },
            { id: 'jm-reward', method: 'POST', name: '/api/jingman/reward', description: '员工奖励管理', avgResponseTime: 198, successRate: 98.8 },
            { id: 'jm-recognition', method: 'POST', name: '/api/jingman/recognition', description: '员工认可管理', avgResponseTime: 167, successRate: 99.2 },
            { id: 'jm-survey', method: 'GET', name: '/api/jingman/survey', description: '员工调研管理', avgResponseTime: 212, successRate: 98.7 },
            { id: 'jm-suggestion', method: 'POST', name: '/api/jingman/suggestion', description: '员工建议管理', avgResponseTime: 145, successRate: 99.4 },
            { id: 'jm-complaint', method: 'POST', name: '/api/jingman/complaint', description: '员工投诉管理', avgResponseTime: 178, successRate: 99.0 },
            { id: 'jm-exit-interview', method: 'POST', name: '/api/jingman/exit-interview', description: '离职面谈管理', avgResponseTime: 223, successRate: 98.6 },
            { id: 'jm-engagement', method: 'GET', name: '/api/jingman/engagement', description: '员工敬业度分析', avgResponseTime: 267, successRate: 98.3 }
          ],
          count: 20
        }
      }

      if (apiData[systemType]) {
        this.systemInfo = { ...apiData[systemType] }
        this.$message.success(`已加载${this.systemInfo.name}API列表`)
      } else {
        this.$message.error('类型不存在')
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