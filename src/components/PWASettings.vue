<template>
  <div class="pwa-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">应用设置</span>
            <span class="header-subtitle">管理PWA功能，无自动安装提醒</span>
          </div>
        </div>
      </template>

      <!-- PWA 状态 -->
      <div class="pwa-status">
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="status-card">
              <div class="status-icon">
                <el-icon size="24"><Download /></el-icon>
              </div>
              <div class="status-content">
                <div class="status-title">安装状态</div>
                <div class="status-value">{{ isInstalled ? '已安装' : '未安装' }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="status-card">
              <div class="status-icon">
                <el-icon size="24"><Connection /></el-icon>
              </div>
              <div class="status-content">
                <div class="status-title">网络状态</div>
                <div class="status-value">{{ isOnline ? '在线' : '离线' }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="status-card">
              <div class="status-icon">
                <el-icon size="24"><Bell /></el-icon>
              </div>
              <div class="status-content">
                <div class="status-title">通知权限</div>
                <div class="status-value">{{ notificationPermission }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- PWA 功能 -->
      <div class="pwa-features">
        <h3>功能管理</h3>
        
        <!-- 手动安装功能 -->
        <div class="feature-item" v-if="!isInstalled">
          <div class="feature-info">
            <h4>手动安装应用</h4>
            <p>点击按钮将应用添加到桌面（不会自动弹出提醒）</p>
          </div>
          <el-button 
            type="primary" 
            @click="installApp" 
            :loading="installing"
            :disabled="!canInstall"
          >
            <el-icon><Download /></el-icon>
            {{ canInstall ? '立即安装' : '暂不可安装' }}
          </el-button>
        </div>

        <!-- 已安装状态 -->
        <div class="feature-item" v-if="isInstalled">
          <div class="feature-info">
            <h4>应用状态</h4>
            <p>应用已安装到桌面，享受原生应用体验</p>
          </div>
          <el-tag type="success" size="large">
            <el-icon><CircleCheck /></el-icon>
            已安装
          </el-tag>
        </div>

        <!-- 通知功能 -->
        <div class="feature-item">
          <div class="feature-info">
            <h4>推送通知</h4>
            <p>接收重要消息和更新提醒</p>
          </div>
          <el-button 
            :type="notificationPermission === 'granted' ? 'success' : 'primary'"
            @click="requestNotificationPermission"
            :disabled="notificationPermission === 'granted'"
          >
            <el-icon><Bell /></el-icon>
            {{ notificationPermission === 'granted' ? '已启用' : '启用通知' }}
          </el-button>
        </div>

        <!-- 测试通知 -->
        <div class="feature-item" v-if="notificationPermission === 'granted'">
          <div class="feature-info">
            <h4>测试通知</h4>
            <p>发送测试通知验证功能</p>
          </div>
          <el-button type="info" @click="sendTestNotification">
            <el-icon><Message /></el-icon>
            发送测试
          </el-button>
        </div>

        <!-- 缓存管理 -->
        <div class="feature-item">
          <div class="feature-info">
            <h4>缓存管理</h4>
            <p>管理离线缓存数据</p>
          </div>
          <div class="feature-actions">
            <el-button type="warning" @click="clearCache" :loading="clearing">
              <el-icon><Delete /></el-icon>
              清理缓存
            </el-button>
            <el-button type="info" @click="showCacheInfo">
              <el-icon><InfoFilled /></el-icon>
              查看信息
            </el-button>
          </div>
        </div>

        <!-- 离线模式 -->
        <div class="feature-item">
          <div class="feature-info">
            <h4>离线模式</h4>
            <p>在网络不可用时使用缓存数据</p>
          </div>
          <el-tag :type="isOnline ? 'success' : 'warning'">
            {{ isOnline ? '在线模式' : '离线模式' }}
          </el-tag>
        </div>
      </div>

      <!-- 缓存信息对话框 -->
      <el-dialog v-model="cacheDialogVisible" title="缓存信息" width="500px">
        <div class="cache-info">
          <div v-if="cacheInfo" class="cache-stats">
            <div class="cache-stat" v-for="(count, name) in cacheInfo" :key="name">
              <span class="cache-name">{{ name }}</span>
              <span class="cache-count">{{ count }} 项</span>
            </div>
          </div>
          <div v-else class="cache-empty">
            <el-icon size="48"><FolderOpened /></el-icon>
            <p>暂无缓存数据</p>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Download, Connection, Bell, Message, InfoFilled, FolderOpened, CircleCheck, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const isInstalled = ref(false)
const isOnline = ref(navigator.onLine)
const notificationPermission = ref('default')
const installing = ref(false)
const clearing = ref(false)
const cacheDialogVisible = ref(false)
const cacheInfo = ref(null)
const canInstall = ref(false)

// 计算属性
const pwaHelper = computed(() => window.pwaHelper)

// 方法
const installApp = async () => {
  if (!pwaHelper.value) {
    ElMessage.warning('PWA 功能不可用')
    return
  }

  installing.value = true
  try {
    const success = await pwaHelper.value.install()
    if (success) {
      ElMessage.success('应用安装成功')
      await updateStatus()
    } else {
      ElMessage.info('安装已取消或不可用')
    }
  } catch (error) {
    ElMessage.error('安装失败')
  } finally {
    installing.value = false
  }
}

const requestNotificationPermission = async () => {
  if (!pwaHelper.value) {
    ElMessage.warning('PWA 功能不可用')
    return
  }

  try {
    const granted = await pwaHelper.value.requestNotificationPermission()
    if (granted) {
      notificationPermission.value = 'granted'
      ElMessage.success('通知权限已启用')
    } else {
      ElMessage.warning('通知权限被拒绝')
    }
  } catch (error) {
    ElMessage.error('请求通知权限失败')
  }
}

const sendTestNotification = async () => {
  if (!pwaHelper.value) {
    ElMessage.warning('PWA 功能不可用')
    return
  }
}

const clearCache = async () => {
  if (!pwaHelper.value) {
    ElMessage.warning('PWA 功能不可用')
    return
  }

  clearing.value = true
  try {
    await pwaHelper.value.clearCache()
    ElMessage.success('缓存已清理')
    cacheInfo.value = null
  } catch (error) {
    ElMessage.error('清理缓存失败')
  } finally {
    clearing.value = false
  }
}

const showCacheInfo = async () => {
  if (!pwaHelper.value) {
    ElMessage.warning('PWA 功能不可用')
    return
  }

  try {
    cacheInfo.value = await pwaHelper.value.getCacheInfo()
    cacheDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取缓存信息失败')
  }
}

const updateStatus = async () => {
  if (pwaHelper.value) {
    isInstalled.value = await pwaHelper.value.checkInstallation()
    canInstall.value = pwaHelper.value.canInstall()
    notificationPermission.value = Notification.permission
  }
}

// 监听网络状态变化
const handleNetworkChange = (online) => {
  isOnline.value = online
}

// 生命周期
onMounted(async () => {
  // 等待 PWA 助手初始化
  const checkPWA = () => {
    if (window.pwaHelper) {
      updateStatus()
      window.pwaHelper.onNetworkStatusChange(handleNetworkChange)
    } else {
      setTimeout(checkPWA, 100)
    }
  }
  checkPWA()
})
</script>

<style scoped>
.pwa-settings {
  max-width: 800px;
  margin: 0 auto;
}

.settings-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
}

.pwa-status {
  margin-bottom: 32px;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.status-value {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.pwa-features {
  margin-top: 32px;
}

.pwa-features h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-info {
  flex: 1;
}

.feature-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.feature-info p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.feature-actions {
  display: flex;
  gap: 8px;
}

.cache-info {
  padding: 20px 0;
}

.cache-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cache-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.cache-name {
  font-weight: 500;
  color: #2c3e50;
}

.cache-count {
  color: #667eea;
  font-weight: 600;
}

.cache-empty {
  text-align: center;
  color: #7f8c8d;
  padding: 40px 0;
}

.cache-empty .el-icon {
  margin-bottom: 16px;
  color: #bdc3c7;
}

.cache-empty p {
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pwa-status .el-col {
    margin-bottom: 16px;
  }
  
  .status-card {
    padding: 16px;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
  
  .status-value {
    font-size: 16px;
  }
  
  .feature-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .feature-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .header-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .status-card {
    padding: 12px;
  }
  
  .status-icon {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }
  
  .status-title {
    font-size: 12px;
  }
  
  .status-value {
    font-size: 14px;
  }
  
  .feature-item {
    padding: 16px;
  }
  
  .feature-info h4 {
    font-size: 14px;
  }
  
  .feature-info p {
    font-size: 12px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .header-subtitle {
    font-size: 12px;
  }
  
  .pwa-features h3 {
    font-size: 16px;
  }
}
</style>
