<template>
  <div class="online-record">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-popover placement="bottom-start" width="280" trigger="click" ref="accountPopover">
              <template #reference>
                <div class="setting-item">
                  <el-icon class="setting-icon">
                    <User />
                  </el-icon>
                  <span class="setting-label">在线角色</span>
                  <span class="setting-value">{{ currentSetData.onlineAccounts }}</span>
                  <el-icon class="setting-arrow">
                    <ArrowDown />
                  </el-icon>
                </div>
              </template>
              <SettingPopover
                title="设置在线账号数"
                :icon="User"
                v-model="currentSetData.onlineAccounts"
                :input-props="{ min: 1, max: 20, controls: true }" />
            </el-popover>
            <el-popover placement="bottom-start" width="280" trigger="click" ref="cardPricePopover">
              <template #reference>
                <div class="setting-item">
                  <el-icon class="setting-icon">
                    <Money />
                  </el-icon>
                  <span class="setting-label">点卡价格</span>
                  <span class="setting-value">{{ currentSetData.cardPrice.toLocaleString() }}</span>
                  <el-icon class="setting-arrow">
                    <ArrowDown />
                  </el-icon>
                </div>
              </template>
              <SettingPopover
                title="设置点卡价格"
                :icon="Money"
                v-model="currentSetData.cardPrice"
                :input-props="{ min: 1000, step: 1000, controls: true }" />
            </el-popover>
          </div>
          <div class="header-right">
            <div v-if="isOnline" class="online-status">
              <el-icon class="status-icon">
                <Clock />
              </el-icon>
              <span class="status-text">当前在线：{{ currentDuration }}</span>
            </div>
            <el-button v-if="!isOnline" type="primary" @click="startOnline" class="control-button start-button"
              :loading="isStarting" size="large">
              <el-icon>
                <VideoPlay />
              </el-icon>
              <span>开始游戏</span>
            </el-button>
            <el-button v-if="isOnline" type="danger" @click="endOnline" class="control-button end-button"
              :loading="isEnding" size="large">
              <el-icon>
                <VideoPause />
              </el-icon>
              <span>结束游戏</span>
            </el-button>
          </div>
        </div>
      </template>
      <!-- 统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="stat-card total">
              <div class="stat-icon">
                <el-icon size="24">
                  <Clock />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ todaysData.onlineTime.toFixed(2) }}h</div>
                <div class="stat-label">今日在线</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card today">
              <div class="stat-icon">
                <el-icon size="24">
                  <Sunrise />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ todaysData.cardCost.toFixed(2) }}</div>
                <div class="stat-label">点卡消耗</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card weekly">
              <div class="stat-icon">
                <el-icon size="24">
                  <Calendar />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ todaysData.todaysIncome.toFixed(2) }}</div>
                <div class="stat-label">今日收益</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card count">
              <div class="stat-icon">
                <el-icon size="24">
                  <Document />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ todaysData.todaysBalance.toFixed(2) }}</div>
                <div class="stat-label">今日结余</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 快速记录  -->
      <div class="quick-record">
        <el-row :gutter="24">
          <!-- 左侧：物品选择区 -->
          <el-col :span="16">
            <el-card class="item-selection-card">
              <template #header>
                <div class="section-header">
                  <div class="section-icon">
                    <el-icon size="14">
                      <Box />
                    </el-icon>
                  </div>
                  <div class="section-info">
                    <h3 class="section-title">物品选择</h3>
                  </div>
                </div>
              </template>
              <p class="card-text-tip">固定价格区</p>
              <div class="item-grid">
                <div v-for="item in itemsData" :key="item.id" class="item-card" @click="handleItemClick(item)"
                  @contextmenu.prevent="handleItemRightClick(item)">
                  <div class="item-icon">
                    <img :src="item.image" :alt="item.name">
                  </div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
              </div>
              <p class="card-text-tip">非固定价格区</p>
              <div class="item-grid">
                <div v-for="item in unsetItemsData" :key="item.id" class="item-card" @click="handleItemClick(item)"
                  @contextmenu.prevent="handleItemRightClick(item)">
                  <div class="item-icon">
                    <img :src="item.image" :alt="item.name">
                  </div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <!-- 右侧：已添加物品区 -->
          <el-col :span="8">
            <el-card class="selected-items-card">
              <template #header>
                <div class="section-header">
                  <div class="section-icon">
                    <el-icon size="16">
                      <ShoppingBag />
                    </el-icon>
                  </div>
                  <div class="section-info">
                    <h3 class="section-title">今日战绩</h3>
                  </div>
                  <div class="header-actions-right">
                    <div class="header-total" v-if="selectedItems.length > 0">
                      <span class="header-total-label">总价值：</span>
                      <span class="header-total-value">¥{{ totalValue.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="items-list">
                <div v-if="selectedItems.length === 0" class="empty-state">
                  <el-icon size="48" class="empty-icon">
                    <Box />
                  </el-icon>
                  <p class="empty-text">暂无添加的物品</p>
                  <p class="empty-hint">从左侧选择物品开始记录</p>
                </div>
                <div v-for="(selectedItem, index) in selectedItems" :key="index" class="selected-item">
                  <div class="selected-item-info">
                    <div class="selected-item-icon">
                      <img :src="getItemById(selectedItem.itemId)?.image" :alt="getItemById(selectedItem.itemId)?.name">
                    </div>
                    <div class="selected-item-details">
                      <div class="selected-item-name">
                        {{ getItemById(selectedItem.itemId)?.name || '未知物品' }}
                      </div>
                      <div class="selected-item-price">¥{{ selectedItem.price }}</div>
                    </div>
                  </div>
                  <div class="selected-item-actions">
                    <el-button size="small" type="danger" plain @click="removeSelectedItem(index)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

            </el-card>
          </el-col>
        </el-row>
      </div>

      <PriceDialog
        v-model="showPriceDialog"
        :item="currentItem"
        @confirm="handlePriceConfirm" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Box, ShoppingBag, Delete, VideoPlay, VideoPause, Clock, Sunrise, Calendar, Document, User, ArrowDown, Money } from '@element-plus/icons-vue'
import { useSettings } from '../composables/useSettings'
import { useOnlineTimer } from '../composables/useOnlineTimer'
import { useTodayData } from '../composables/useTodayData'
import { useItems } from '../composables/useItems'
import { CARD_COST_MULTIPLIER, UNSET_ITEMS_START_ID } from '../constants'
import SettingPopover from '../components/SettingPopover.vue'
import PriceDialog from '../components/PriceDialog.vue'

const { currentSetData } = useSettings()
const { 
  isOnline, 
  startTime,
  currentDuration, 
  isStarting, 
  isEnding, 
  start, 
  stop, 
  getOnlineTime 
} = useOnlineTimer()
const { todaysData, addOnlineRecord, updateIncome } = useTodayData()
const { itemsData, unsetItemsData, getItemById } = useItems()

const selectedItems = ref([])
const showPriceDialog = ref(false)
const currentItem = ref(null)

const endOnline = () => {
  const onlineTime = getOnlineTime()
  if (onlineTime > 0) {
    const { onlineAccounts, cardPrice } = currentSetData.value
    const record = {
      time: onlineTime,
      start: startTime.value,
      end: new Date(),
      onlineAccounts,
      cardPrice,
      cardCost: onlineTime * cardPrice * CARD_COST_MULTIPLIER * onlineAccounts,
    }
    addOnlineRecord(record)
  }
  stop()
}

const handleItemClick = (item) => {
  if (item && item.price > 0) {
    addItemToSelected(item)
  } else {
    currentItem.value = item
    showPriceDialog.value = true
  }
}

const handleItemRightClick = (item) => {
  currentItem.value = item
  showPriceDialog.value = true
}

const addItemToSelected = (item) => {
  selectedItems.value.unshift({
    itemId: item.id,
    price: item.price
  })
  ElMessage.success(`${item.name} 已添加`)
}

const handlePriceConfirm = (price) => {
  if (!currentItem.value || price <= 0) {
    ElMessage.warning('请输入有效的价格')
    return
  }

  const item = currentItem.value
  
  if (item.id >= UNSET_ITEMS_START_ID) {
    addItemToSelected({ id: item.id, name: item.name, price })
  } else {
    const itemIndex = itemsData.value.findIndex(i => i.id === item.id)
    if (itemIndex !== -1) {
      itemsData.value[itemIndex].price = price
      addItemToSelected(itemsData.value[itemIndex])
      ElMessage.success(`${itemsData.value[itemIndex].name} 价格已设置为 ¥${price}`)
    }
  }
}

const removeSelectedItem = (index) => {
  selectedItems.value.splice(index, 1)
  ElMessage.success('已移除物品')
}

const totalValue = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

watch(totalValue, (val) => {
  updateIncome(val || 0)
})

watch(selectedItems, () => {
  todaysData.value.loadList = selectedItems.value
  todaysData.value.todaysBalance = todaysData.value.todaysIncome - todaysData.value.cardCost
}, { deep: true })

onMounted(() => {
  if (todaysData.value.loadList.length) {
    selectedItems.value = todaysData.value.loadList
  }
})


</script>
<style scoped lang="less">
@import '../styles/variables.less';
@import '../styles/mixins.less';

.online-record {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.record-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: @glass-bg-light;
  border: 1px solid @glass-border;
  .card-shadow(0.06);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  
  // 覆盖全局的 ::before 伪元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 20%, 
      rgba(255, 255, 255, 0.4) 50%, 
      rgba(255, 255, 255, 0.3) 80%, 
      transparent 100%);
    border-radius: 24px 24px 0 0;
    pointer-events: none;
    z-index: 1;
  }
  
  // 确保内部元素也遵循圆角
  :deep(.el-card__header),
  :deep(.el-card__body) {
    border-radius: inherit;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  padding: 10px @spacing-lg;
  .glass-effect(@blur-light, @glass-bg, @glass-border-hover);
  border-radius: @radius-normal;
  cursor: pointer;
  .transition();
  min-width: 140px;
  
  &:hover {
    background: @glass-bg-hover;
    border-color: @glass-border-hover;
    .card-shadow-hover(0.1);
  }
}

.setting-icon {
  font-size: 18px;
  color: @color-primary;
}

.setting-label {
  font-size: 14px;
  color: @text-primary;
  font-weight: 500;
}

.setting-value {
  font-size: 14px;
  color: @text-primary;
  font-weight: 600;
  margin-left: auto;
}

.setting-arrow {
  font-size: 12px;
  color: @text-secondary;
  .transition(transform);
}

.setting-item:hover .setting-arrow {
  transform: translateY(2px);
}


.online-status {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  padding: 10px @spacing-lg;
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.2);
  border-radius: @radius-normal;
}

.status-icon {
  font-size: 18px;
  color: @color-success;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.status-text {
  font-size: 14px;
  color: @color-success;
  font-weight: 600;
}

.control-button {
  padding: @spacing-md @spacing-xxl;
  font-weight: 600;
  border-radius: @radius-normal;
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  .transition();

  .el-icon {
    font-size: 18px;
  }
}

.start-button {
  background: linear-gradient(135deg, @color-primary 0%, #ee5a24 100%);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #ff7b7b 0%, #ff6a3a 100%);
    .card-shadow-hover(0.4);
  }
}

.end-button {
  background: linear-gradient(135deg, @color-danger 0%, #cf1322 100%);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #ff6b6d 0%, #ff2d2f 100%);
    .card-shadow-hover(0.4);
  }
}

/* 快速记录样式 */
.quick-record {
  margin-top: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quick-record .el-row {
  height: 100%;
}

.quick-record .el-col {
  height: 100%;
}

.quick-record .item-selection-card,
.quick-record .selected-items-card {
  height: calc(100vh - 300px);
  border-radius: @radius-normal;
  overflow: hidden;
  .transition();
  background: transparent;
  border: 1px solid @glass-border;
  .card-shadow(0.1);
  display: flex;
  flex-direction: column;
  
  :deep(.el-card__header) {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: @spacing-md @spacing-lg;
    border-radius: @radius-normal @radius-normal 0 0;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    position: relative;
    overflow: hidden;
    margin: 0;
    box-shadow: none;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%);
      pointer-events: none;
    }
  }
  
  :deep(.el-card__body) {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-radius: 0 0 @radius-normal @radius-normal;
  }
}

.record-card :deep(.el-card__header) {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px 24px 0 0;
  box-shadow: none;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.record-card :deep(.el-card__body) {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 0 0 24px 24px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.05),
    inset 0 2px 6px rgba(255, 255, 255, 0.15),
    inset 0 -2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  margin: 0 4px 4px 4px;
}

.quick-record .item-selection-card :deep(.el-card__body),
.quick-record .selected-items-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 48px);
  overflow: auto;
}

.quick-record .item-selection-card:hover,
.quick-record .selected-items-card:hover {
  .card-shadow-hover(0.12);
  border-color: @glass-border-hover;
}

/* 卡片头部样式 */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
}



.section-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, @color-primary 0%, #ee5a24 100%);
  border-radius: @radius-small;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  .card-shadow-hover(0.3);
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: @text-primary;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 12px;
  color: @text-secondary;
  margin: 0;
  font-weight: 400;
}

/* 头部总价值和操作按钮样式 */
.header-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.header-total {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.clear-button {
  padding: @spacing-xs;
  height: 28px;
  width: 28px;
}

.header-total-label {
  font-size: 14px;
  color: @text-secondary;
  font-weight: 400;
}

.header-total-value {
  font-size: 16px;
  font-weight: 600;
  color: @color-success;
  background: rgba(82, 196, 26, 0.1);
  padding: @spacing-xs @spacing-sm;
  border-radius: 6px;
  line-height: 1;
}

/* 物品网格样式 */
.item-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item-grid::-webkit-scrollbar {
  width: 6px;
}

.item-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.item-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.item-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


.card-text-tip {
  padding: 0;
  margin: @spacing-sm 0;
  font-size: 13px;
  color: #6b46c1;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.item-card {
  width: 72px;
  height: 80px;
  padding: 6px @spacing-xs;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .glass-effect(@blur-light, @glass-bg-light, rgba(255, 255, 255, 0.3));
  border-radius: @radius-small;
  .transition();
  
  &:hover {
    border-color: rgba(255, 107, 107, 0.6);
    background: @glass-bg-hover;
    .card-shadow-hover(0.2);
  }
}

.item-card:hover::before {
  opacity: 1;
}

.item-icon {
  position: relative;
  z-index: 1;
  margin-bottom: 4px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon img {
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
}

.item-name {
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: @text-primary;
  margin-bottom: @spacing-xs;
  font-weight: 500;
  line-height: 1.1;
  text-align: center;
  flex-shrink: 0;
}

.item-price {
  position: relative;
  z-index: 1;
  font-size: 10px;
  color: @color-success;
  font-weight: 600;
  background: rgba(82, 196, 26, 0.1);
  padding: 1px @spacing-xs;
  border-radius: 3px;
  display: inline-block;
  flex-shrink: 0;
}

.item-status {
  position: relative;
  z-index: 1;
  font-size: 10px;
  color: @color-warning;
  font-weight: 500;
  background: rgba(250, 173, 20, 0.1);
  padding: 1px @spacing-xs;
  border-radius: 3px;
  display: inline-block;
  flex-shrink: 0;
}

/* 已添加物品列表样式 */
.items-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.items-list::-webkit-scrollbar {
  width: 6px;
}

.items-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.items-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.items-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.empty-state {
  text-align: center;
  padding: @spacing-xxl @spacing-lg;
  color: @text-secondary;
}

.empty-icon {
  color: @text-tertiary;
  margin-bottom: @spacing-lg;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: @text-secondary;
  margin: 0 0 @spacing-sm 0;
  letter-spacing: 0.2px;
}

.empty-hint {
  font-size: 14px;
  color: @text-tertiary;
  margin: 0;
  opacity: 0.8;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  .glass-effect(@blur-light, @glass-bg, @glass-border);
  border-radius: @radius-small;
  margin-bottom: @spacing-sm;
  .transition();
  
  &:hover {
    .card-shadow-hover(0.18);
    border-color: rgba(255, 107, 107, 0.5);
    background: rgba(255, 255, 255, 0.4);
  }
}

.selected-item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.selected-item-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 8px;
  flex-shrink: 0;
}

.selected-item-icon img {
  max-width: 24px;
  max-height: 24px;
  object-fit: contain;
}

.selected-item-details {
  flex: 1;
  min-width: 0;
}

.selected-item-name {
  font-size: 14px;
  color: @text-primary;
  font-weight: 500;
  margin-bottom: @spacing-xs;
  line-height: 1.2;
}

.selected-item-price {
  font-size: 13px;
  color: @color-success;
  font-weight: 600;
}

.selected-item-actions {
  flex-shrink: 0;
}







/* 统计卡片 */
.stats-container {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: @spacing-xl;
  border-radius: @radius-large;
  .glass-effect(@blur-light, @glass-bg, @glass-border);
  .card-shadow(0.08);
  .transition();
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: @glass-bg-hover;
    border-color: @glass-border-hover;
    .card-shadow-hover(0.12);
  }
}

.stat-card.total {
  .stat-icon {
    background: linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(56, 158, 13, 0.15) 100%);
    color: #52c41a;
  }
}

.stat-card.today {
  .stat-icon {
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(9, 109, 217, 0.15) 100%);
    color: #1890ff;
  }
}

.stat-card.weekly {
  .stat-icon {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%);
    color: #ffc107;
  }
}

.stat-card.count {
  .stat-icon {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(238, 90, 36, 0.15) 100%);
    color: #ff6b6b;
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: @radius-normal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: @spacing-lg;
  .glass-effect(@blur-light, transparent, transparent);
  .card-shadow(0.06);
  flex-shrink: 0;
  .transition();
  position: relative;
  z-index: 2;
  
  .stat-card:hover & {
    transform: scale(1.05);
    .card-shadow-hover(0.1);
  }
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: @text-primary;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 14px;
  color: @text-primary;
  font-weight: 600;
  opacity: 0.85;
}
</style>
