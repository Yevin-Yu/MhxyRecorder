<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth" class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }"
      :style="{ width: sidebarWidth }">
      <div class="logo">
        <div class="logo-icon">
          <el-icon size="24">
            <Monitor />
          </el-icon>
        </div>
        <h2 class="logo-text" :class="{ 'logo-text-hidden': isCollapsed }">梦幻西游工具箱</h2>
      </div>
      <el-menu :default-active="$route.path" router class="sidebar-menu" background-color="transparent"
        text-color="#e8eaed" active-text-color="#ffffff" :collapse="isCollapsed" :collapse-transition="true"
        unique-opened>
        <el-menu-item index="/online-record">
          <el-icon>
            <Clock />
          </el-icon>
          <span>在线记录</span>
        </el-menu-item>
        <el-menu-item index="/record-list">
          <el-icon>
            <Document />
          </el-icon>
          <span>记录列表</span>
        </el-menu-item>
        <!-- <el-menu-item index="/character-info">
          <el-icon>
            <User />
          </el-icon>
          <span>角色信息</span>
        </el-menu-item>
        <el-menu-item index="/trade-record">
          <el-icon>
            <ShoppingCart />
          </el-icon>
          <span>交易记录</span>
        </el-menu-item> -->
        <!-- <el-menu-item index="/pwa-settings">
          <el-icon>
            <Setting />
          </el-icon>
          <span>应用设置</span>
        </el-menu-item> -->
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="header-left">
            <el-button type="text" class="collapse-btn" @click="toggleSidebar" :title="isCollapsed ? '展开菜单' : '收起菜单'"
              aria-label="切换菜单折叠状态">
              <el-icon size="20">
                <Fold v-if="!isCollapsed" />
                <Expand v-else />
              </el-icon>
            </el-button>
            <div class="page-title">
              <h5>{{ $route.meta.title }}</h5>
              <span class="page-subtitle">{{ $route.meta.subtitle || '管理您的游戏数据' }}</span>
            </div>
          </div>
          <div class="user-info">
            <el-avatar size="medium" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="user-details" v-show="!isMobile">
              <span class="username">耶温</span>
              <span class="user-status">在线</span>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="main-content">
        <div class="content-wrapper fade-in-up">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Clock, User, ShoppingCart, Monitor, Setting, Fold, Expand } from '@element-plus/icons-vue'

// 从localStorage读取保存的侧边栏状态
const getSavedCollapsedState = () => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  return savedState === 'true'
}

// 响应式数据
const isCollapsed = ref(getSavedCollapsedState())
const isMobile = ref(false)

// 计算属性
const sidebarWidth = computed(() => {
  return isCollapsed.value ? '0px' : '200px'
})

// 方法
const toggleSidebar = async () => {
  isCollapsed.value = !isCollapsed.value
  // 保存侧边栏状态到localStorage
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
  // 确保DOM更新后再进行后续操作
  await nextTick()
}

// 组件挂载时，确保从localStorage加载状态
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    isCollapsed.value = savedState === 'true'
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.sidebar {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
  transform: translateZ(0);
}

.sidebar-collapsed {
  width: 64px !important;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  pointer-events: none;
}

.logo {
  padding: 32px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar-collapsed .logo {
  padding: 32px 8px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.sidebar-collapsed .logo-icon {
  margin-bottom: 0;
}

.logo-text {
  color: #ffffff;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
  white-space: nowrap;
  overflow: hidden;
  transition-delay: 0.05s;
}

.logo-text-hidden {
  opacity: 0;
  transform: translateY(-10px);
  height: 0;
  margin: 0;
  transition-delay: 0s;
}

.sidebar-menu {
  border: none;
  margin-top: 16px;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-menu .el-menu-item {
  height: 56px;
  line-height: 56px;
  margin: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition-delay: 0.05s;
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition-delay: 0.05s;
}

.sidebar-menu .el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
  flex-shrink: 0;
  transition: margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-collapsed .sidebar-menu .el-menu-item .el-icon {
  margin-right: 0;
  font-size: 20px;
}
.sidebar-collapsed .sidebar-menu .el-menu-item{
  padding: 12px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-btn {
  color: #2c3e50;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: scale(1.05);
}

.page-title h5 {
  margin: 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  margin-right: 16px;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.user-info:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.username {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.user-status {
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

.main-content {
  padding: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-wrapper {
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 动画效果 */
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 防止闪屏的优化 */
.layout-container * {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}

.sidebar,
.sidebar * {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
}

/* 确保内容区域不会因为侧边栏变化而跳动 */
.main-content {
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
}
</style>
