<template>
  <div class="setting-popover">
    <div class="setting-header">
      <el-icon class="setting-header-icon">
        <component :is="icon" />
      </el-icon>
      <div class="setting-header-text">
        <div class="setting-title">{{ title }}</div>
      </div>
    </div>
    <div class="setting-body">
      <el-input-number 
        :model-value="modelValue"
        v-bind="inputProps"
        size="large"
        class="setting-input"
        @update:model-value="handleUpdate" />
    </div>
  </div>
</template>

<script setup>
/**
 * 设置项弹窗组件
 * 用于显示和编辑设置项的数值（如在线账号数、点卡价格等）
 */
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: [String, Object],
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  inputProps: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';
@import '../styles/mixins.less';

.setting-popover {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.setting-header {
  display: flex;
  align-items: center;
  gap: @spacing-md;
  padding: @spacing-md @spacing-xl;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.setting-header-icon {
  font-size: 20px;
  color: @color-primary;
  flex-shrink: 0;
}

.setting-header-text {
  flex: 1;
  min-width: 0;
}

.setting-title {
  font-size: 15px;
  color: @text-primary;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.setting-body {
  padding: @spacing-xl;
  display: flex;
  justify-content: center;
}

.setting-input {
  width: 180px;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.4) !important;
    border: 1px solid rgba(255, 107, 107, 0.3) !important;
    border-radius: 10px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  }

  :deep(.el-input__inner) {
    font-weight: 600;
    color: @text-primary;
  }

  :deep(.el-input__wrapper:hover) {
    background: rgba(255, 255, 255, 0.5) !important;
    border-color: rgba(255, 107, 107, 0.5) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  }

  :deep(.el-input__wrapper.is-focus) {
    background: rgba(255, 255, 255, 0.6) !important;
    border-color: @color-primary !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }

  :deep(.el-input-number__increase),
  :deep(.el-input-number__decrease) {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
    color: @text-primary;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 107, 107, 0.2);
      color: @color-primary;
    }
  }
}
</style>

