<template>
  <el-dialog 
    v-model="visible" 
    title="设置物品价格" 
    width="30%" 
    center 
    class="custom-dialog" 
    :modal="false"
    @close="handleClose">
    <div class="price-dialog-content">
      <div class="dialog-item-card">
        <div class="dialog-item-image">
          <img v-if="item?.image" :src="item.image" :alt="item.name">
          <el-icon v-else :size="32" class="dialog-icon">
            <Box />
          </el-icon>
        </div>
        <div class="dialog-item-info">
          <div class="price-input-wrapper">
            <el-input-number 
              v-model="price" 
              :min="0" 
              :step="1000" 
              size="default" 
              class="custom-input-number"
              :controls="false"
              :precision="0" 
              placeholder="请输入价格">
              <template #prefix>
                <span class="price-prefix">¥</span>
              </template>
            </el-input-number>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-actions">
        <el-button @click="handleClose" class="dialog-btn cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleConfirm" class="dialog-btn confirm-btn">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 物品价格设置对话框
 * 用于设置或修改物品的价格
 */
import { ref, computed, watch } from 'vue'
import { Box } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const price = ref(0)

watch(() => props.item, (item) => {
  if (item) {
    price.value = item.price || 0
  }
}, { immediate: true })

const handleConfirm = () => {
  emit('confirm', price.value)
  visible.value = false
}

const handleClose = () => {
  visible.value = false
  emit('cancel')
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';
@import '../styles/mixins.less';

.price-dialog-content {
  padding: 0;
}

.dialog-item-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: @spacing-md;
  padding: @spacing-sm 0;
}

.dialog-item-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: @radius-normal;
  border: 1px solid rgba(255, 107, 107, 0.2);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  padding: @spacing-xs;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.dialog-icon {
  color: @color-primary;
  opacity: 0.8;
  position: relative;
  z-index: 1;
}

.dialog-item-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.price-input-wrapper {
  flex: 1;
  min-width: 0;
  max-width: 250px;
}

.custom-input-number {
  width: 100%;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.4) !important;
    border: 1px solid rgba(255, 107, 107, 0.3) !important;
    border-radius: 8px !important;
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 8px 12px !important;
  }
  
  :deep(.el-input__inner) {
    font-size: 15px;
    font-weight: 600;
    color: @text-primary;
    text-align: left;
  }
  
  :deep(.el-input__wrapper:hover) {
    background: rgba(255, 255, 255, 0.5) !important;
    border-color: rgba(255, 107, 107, 0.5) !important;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  }
  
  :deep(.el-input__wrapper.is-focus) {
    background: rgba(255, 255, 255, 0.6) !important;
    border-color: @color-primary !important;
    box-shadow: 
      0 0 0 2px rgba(255, 107, 107, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  }
}

.price-prefix {
  color: @color-primary;
  font-weight: 700;
  font-size: 15px;
  margin-right: @spacing-xs;
  opacity: 0.9;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: @spacing-md;
  margin-top: @spacing-sm;
}

.dialog-btn {
  min-width: 100px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: @text-primary !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.4) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
}

.confirm-btn {
  background: linear-gradient(135deg, @color-primary 0%, #ee5a24 100%) !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff7b7b 0%, #ff6a3a 100%) !important;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>

