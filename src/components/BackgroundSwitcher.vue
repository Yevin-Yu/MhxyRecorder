<template>
  <div class="background-switcher">
    <el-popover
      placement="top-end"
      :width="280"
      trigger="click"
      v-model:visible="visible"
      popper-class="background-switcher-popover"
      :offset="12"
    >
      <template #reference>
        <el-button
          class="switcher-button"
          circle
          :icon="Picture"
        />
      </template>

      <div class="switcher-content">
        <div class="switcher-header">
          <h4>切换背景</h4>
        </div>
        <div class="wallpaper-list">
          <div
            v-for="wallpaper in wallpaperList"
            :key="wallpaper.id"
            class="wallpaper-item"
            :class="{ active: currentBackground.id === wallpaper.id }"
            @click="selectBackground(wallpaper)"
          >
            <div class="wallpaper-preview">
              <div
                v-if="wallpaper.type === 'gradient'"
                class="preview-gradient"
              ></div>
              <img
                v-else-if="wallpaper.value"
                :src="wallpaper.value"
                :alt="wallpaper.name"
                class="preview-image"
                @error="handleImageError"
              />
              <div class="preview-overlay">
                <el-icon v-if="currentBackground.id === wallpaper.id" class="check-icon">
                  <Check />
                </el-icon>
              </div>
            </div>
            <div class="wallpaper-name">{{ wallpaper.name }}</div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Picture, Check } from '@element-plus/icons-vue'
import { wallpaperList, getCurrentBackground, setBackground } from '../utils/background'

const visible = ref(false)
const currentBackground = ref(getCurrentBackground())

const selectBackground = (wallpaper) => {
  currentBackground.value = wallpaper
  setBackground(wallpaper)
  visible.value = false
}

const handleImageError = (e) => {
  console.error('背景图片加载失败:', e.target.src)
  e.target.style.display = 'none'
}

onMounted(() => {
  const bg = getCurrentBackground()
  if (bg) {
    setBackground(bg)
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables.less';
.background-switcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.switcher-button {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switcher-button:hover {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.switcher-content {
  padding: 16px;
}

.switcher-header {
  margin-bottom: 16px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: @text-primary;
    letter-spacing: 0.2px;
  }
}

.wallpaper-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.wallpaper-item {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &:hover {
    opacity: 0.9;

    .wallpaper-preview {
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .preview-overlay {
      opacity: 1;
    }
  }

  &.active {
    .wallpaper-preview {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.3);
    }

    .preview-overlay {
      opacity: 1;
    }
  }
}

.wallpaper-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.1);
}

.preview-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #fef3c7 100%);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.check-icon {
  color: white;
  font-size: 24px;
  background: rgba(255, 107, 107, 0.8);
  border-radius: 50%;
  padding: 4px;
}

.wallpaper-name {
  margin-top: @spacing-sm;
  font-size: 12px;
  color: @text-primary;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.2px;
}
</style>

<style lang="less">
@import '../styles/variables.less';
// 全局样式 - Popover 需要全局样式
.background-switcher-popover {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 0;
  z-index: 10000;

  .el-popper__arrow::before {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
}
</style>

