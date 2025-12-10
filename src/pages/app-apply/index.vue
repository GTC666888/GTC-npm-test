<template>
  <div class="app-apply-container">
    <!-- 头部 -->
    <div class="apply-header">
      <div class="header-content">
        <t-button theme="default" variant="text" @click="$router.back()" class="back-btn">
          <t-icon name="chevron-left" />返回
        </t-button>
        <div class="header-title">
          <h1>创建应用</h1>
          <p>填写应用基本信息，提交后等待审核通过</p>
        </div>
      </div>
    </div>

    <!-- 申请内容 -->
    <div class="apply-content">

      <!-- 主要内容 -->
      <div class="main-content">
        <!-- 应用基本信息 -->
        <div class="app-info-panel">
          <div class="panel-header">
            <h2>应用基本信息</h2>
            <p>请填写应用的基本信息，这些信息将用于应用管理和审核</p>
          </div>

          <t-form :data="formData" :rules="formRules" ref="appForm" label-width="120px" class="app-form">
            <t-form-item label="站点名称" name="siteName">
              <t-input 
                v-model="formData.siteName" 
                placeholder="请输入站点名称，如：人力资源管理系统" 
                clearable 
              />
            </t-form-item>

            <t-form-item label="站点地址" name="siteUrl">
              <t-input 
                v-model="formData.siteUrl" 
                placeholder="请输入站点地址，如：https://your-domain.com" 
                clearable 
              />
              <template #tips>
                <span class="form-tips">请输入完整的站点URL地址</span>
              </template>
            </t-form-item>

            <t-form-item label="应用描述" name="description">
              <t-textarea 
                v-model="formData.description" 
                placeholder="请详细描述应用的用途、功能和使用场景" 
                :autosize="{ minRows: 4, maxRows: 8 }"
                :maxlength="500"
                show-limit-number
              />
            </t-form-item>

            <t-form-item label="联系人" name="contactName">
              <t-input v-model="formData.contactName" placeholder="请输入联系人姓名" clearable />
            </t-form-item>

            <t-form-item label="联系邮箱" name="contactEmail">
              <t-input v-model="formData.contactEmail" placeholder="请输入联系邮箱" clearable />
            </t-form-item>
          </t-form>

          <!-- 提交操作区 -->
          <div class="submit-actions">
            <div class="actions-left">
              <t-checkbox v-model="agreeTerms">
                我已阅读并同意 <a href="#" @click.prevent="showTerms">《API服务协议》</a>
              </t-checkbox>
            </div>
            <div class="actions-right">
              <t-button theme="default" size="large" @click="$router.back()">
                取消
              </t-button>
              <t-button 
                theme="primary" 
                size="large" 
                @click="submitApplication" 
                :loading="submitting"
                :disabled="!agreeTerms"
              >
                <t-icon name="check" />提交申请
              </t-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as TIcon } from 'tdesign-icons-vue'
import { MessagePlugin } from 'tdesign-vue'

export default {
  name: 'AppApply',
  components: {
    TIcon
  },
  data() {
    return {
      submitting: false,
      agreeTerms: false,
      
      // 表单数据
      formData: {
        siteName: '',
        siteUrl: '',
        description: '',
        contactName: '',
        contactEmail: ''
      },
      
      // 表单验证规则
      formRules: {
        siteName: [
          { required: true, message: '请输入站点名称', type: 'error' },
          { min: 2, max: 50, message: '站点名称长度为2-50个字符', type: 'error' }
        ],
        siteUrl: [
          { required: true, message: '请输入站点地址', type: 'error' },
          { pattern: /^https?:\/\/.+/, message: '请输入正确的URL格式', type: 'error' }
        ],
        description: [
          { required: true, message: '请输入应用描述', type: 'error' },
          { min: 10, max: 500, message: '应用描述长度为10-500个字符', type: 'error' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', type: 'error' }
        ],
        contactEmail: [
          { required: true, message: '请输入联系邮箱', type: 'error' },
          { email: true, message: '请输入正确的邮箱格式', type: 'error' }
        ]
      },
      

    }
  },
  methods: {
    
    submitApplication() {
      // 验证表单
      this.$refs.appForm.validate().then(result => {
        if (result !== true) {
          MessagePlugin.warning('请完善应用基本信息')
          return
        }
        
        if (!this.agreeTerms) {
          MessagePlugin.warning('请先同意API服务协议')
          return
        }
        
        this.submitting = true
        
        // 模拟提交申请
        setTimeout(() => {
          MessagePlugin.success({
            content: `应用创建成功！您的申请已提交，审核通过后将为您分配AppKey和AppSecret`,
            duration: 4000
          })
          
          this.submitting = false
          
          // 重置表单
          setTimeout(() => {
            this.$refs.appForm.reset()
            this.agreeTerms = false
            this.$router.push('/')
          }, 2000)
        }, 1500)
      })
    },
    
    showTerms() {
      MessagePlugin.info('查看API服务协议')
    }
  }
}
</script>

<style scoped>
.app-apply-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.apply-header {
  background: linear-gradient(135deg, #0052d9 0%, #0066ff 100%);
  color: white;
  padding: 32px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  color: white;
  margin-bottom: 16px;
}

.header-title h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
}

.header-title p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.apply-content {
  max-width: 1400px;
  margin: -40px auto 0;
  padding: 0 24px 48px;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-info-panel {
  margin-bottom: 24px;
}

.app-form {
  max-width: 800px;
}

.form-tips {
  font-size: 12px;
  color: #8c8c8c;
}

.panel-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #262626;
}

.panel-header p {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

.submit-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-top: 24px;
}

.actions-left {
  flex: 1;
}

.actions-right {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .submit-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .actions-left,
  .actions-right {
    width: 100%;
  }
  
  .app-form {
    max-width: 100%;
  }
}
</style>
