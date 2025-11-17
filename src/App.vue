<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(true)
const router = useRouter()
</script>

<style>
/* 全局样式 */
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* 防止闪屏的全局优化 */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

/* 优化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}

/* Element Plus 组件样式覆盖 */
.el-card {
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden;
}

.el-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
}

.el-card__header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  border-bottom: 1px solid #e9ecef !important;
  padding: 20px 24px !important;
}

.el-button {
  border-radius: 12px !important;
  font-weight: 500 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.el-button:hover::before {
  left: 100%;
}

.el-button:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
  border-radius: 12px !important;
  overflow: hidden !important;
}

.el-table th {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  border-bottom: 1px solid #e9ecef !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
}

.el-table td {
  border-bottom: 1px solid #f0f0f0 !important;
  transition: background-color 0.3s ease !important;
}

.el-table tr:hover td {
  background-color: rgba(102, 126, 234, 0.05) !important;
}

.el-input__wrapper {
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

.el-input__wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
}

.el-select .el-input__wrapper {
  border-radius: 12px !important;
}

.el-dialog {
  border-radius: 16px !important;
  overflow: hidden !important;
}

.el-dialog__header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  border-bottom: 1px solid #e9ecef !important;
  padding: 20px 24px !important;
}

.el-dialog__title {
  font-weight: 600 !important;
  color: #2c3e50 !important;
}

.el-menu {
  border: none !important;
  background: transparent !important;
}

.el-menu-item {
  border-radius: 12px !important;
  margin: 4px 8px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(4px) !important;
}

.el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.el-tag {
  border-radius: 8px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.el-tag:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.el-descriptions {
  border-radius: 12px !important;
  overflow: hidden !important;
}

.el-descriptions__header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  padding: 16px 20px !important;
}

.el-descriptions__body {
  background: white !important;
}

.el-descriptions__label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
}

.el-pagination {
  text-align: center !important;
  margin-top: 20px !important;
  padding: 16px 0 !important;
}

.el-pagination .el-pager li {
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  margin: 0 2px !important;
}

.el-pagination .el-pager li:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #667eea !important;
  transform: translateY(-1px) !important;
}

.el-pagination .el-pager li.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

.el-pagination .btn-prev,
.el-pagination .btn-next {
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.el-pagination .btn-prev:hover,
.el-pagination .btn-next:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #667eea !important;
  transform: translateY(-1px) !important;
}

.el-pagination .el-pagination__sizes {
  margin-right: 16px !important;
}

.el-pagination .el-pagination__total {
  margin-right: 16px !important;
  font-weight: 500 !important;
  color: #2c3e50 !important;
}

.el-pagination .el-pagination__jump {
  margin-left: 16px !important;
}

.el-pagination .el-pagination__jump .el-input__inner {
  border-radius: 6px !important;
  text-align: center !important;
}

/* 动画效果 */
.fadeInUp {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .el-card {
    border-radius: 12px !important;
  }
  
  .el-card__header {
    padding: 16px 20px !important;
  }
  
  .el-button {
    border-radius: 10px !important;
    padding: 8px 16px !important;
    font-size: 14px !important;
  }
  
  .el-input__wrapper {
    border-radius: 10px !important;
  }
  
  .el-dialog {
    border-radius: 12px !important;
    margin: 20px !important;
  }
  
  .el-dialog__header {
    padding: 16px 20px !important;
  }
}

@media (max-width: 480px) {
  .el-card {
    border-radius: 10px !important;
  }
  
  .el-card__header {
    padding: 12px 16px !important;
  }
  
  .el-button {
    border-radius: 8px !important;
    padding: 6px 12px !important;
    font-size: 12px !important;
  }
  
  .el-input__wrapper {
    border-radius: 8px !important;
  }
  
  .el-dialog {
    border-radius: 10px !important;
    margin: 10px !important;
  }
  
  .el-dialog__header {
    padding: 12px 16px !important;
  }
}

/* 防止闪屏的全局优化 */
* {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}

/* 优化GPU加速 */
.el-card,
.el-button,
.el-input__wrapper,
.el-menu-item,
.el-table,
.el-dialog {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  will-change: transform;
}

/* 确保布局稳定性 */
.layout-container,
.sidebar,
.main-content {
  contain: layout style paint;
}

/* 优化字体渲染 */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>
