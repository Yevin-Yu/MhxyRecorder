<template>
  <div class="record-list">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <h3>记录列表</h3>
            <p class="header-subtitle">查看所有历史记录，包括每日在线时间、收益和物品获取</p>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="exportData" :loading="isExporting">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
            <el-button type="danger" @click="clearAllData" :loading="isClearing">
              <el-icon><Delete /></el-icon>
              清空数据
            </el-button>
          </div>
        </div>
      </template>

      <!-- 统计概览 -->
      <div class="stats-overview" v-if="allRecords.length > 0">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="overview-card total-days">
              <div class="overview-icon">
                <el-icon size="24"><Calendar /></el-icon>
              </div>
              <div class="overview-content">
                <div class="overview-number">{{ allRecords.length }}</div>
                <div class="overview-label">总记录天数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-card total-time">
              <div class="overview-icon">
                <el-icon size="24"><Clock /></el-icon>
              </div>
              <div class="overview-content">
                <div class="overview-number">{{ totalOnlineTime.toFixed(2) }}h</div>
                <div class="overview-label">总在线时间</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-card total-income">
              <div class="overview-icon">
                <el-icon size="24"><Money /></el-icon>
              </div>
              <div class="overview-content">
                <div class="overview-number">{{ totalIncome.toLocaleString() }}</div>
                <div class="overview-label">总收益</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="overview-card total-balance">
              <div class="overview-icon">
                <el-icon size="24"><Wallet /></el-icon>
              </div>
              <div class="overview-content">
                <div class="overview-number">{{ totalBalance.toLocaleString() }}</div>
                <div class="overview-label">总结余</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 记录表格 -->
      <div class="table-container">
        <div v-if="allRecords.length === 0" class="empty-state">
          <el-icon size="64" class="empty-icon"><Document /></el-icon>
          <h3 class="empty-title">暂无记录</h3>
          <p class="empty-text">开始记录您的游戏数据，这里将显示所有历史记录</p>
          <el-button type="primary" @click="$router.push('/online-record')">开始记录</el-button>
        </div>

        <div v-else class="records-table">
          <!-- 表头 -->
          <div class="table-header">
            <div class="header-cell date-cell">日期</div>
            <div class="header-cell time-cell">在线时间</div>
            <div class="header-cell cost-cell">点卡消耗</div>
            <div class="header-cell income-cell">当日收益</div>
            <div class="header-cell balance-cell">当日结余</div>
            <div class="header-cell items-cell">物品数量</div>
            <div class="header-cell sessions-cell">在线次数</div>
            <div class="header-cell actions-cell">操作</div>
          </div>

          <!-- 表格内容 -->
          <div class="table-body">
            <div v-for="(record, index) in allRecords" :key="index" class="table-row">
              <div class="table-cell date-cell">
                <div class="date-content">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ record.date }}</span>
                </div>
              </div>
              <div class="table-cell time-cell">
                <span class="time-value">{{ record.onlineTime.toFixed(2) }}h</span>
              </div>
              <div class="table-cell cost-cell">
                <span class="cost-value">{{ record.cardCost.toFixed(0) }}</span>
              </div>
              <div class="table-cell income-cell">
                <span class="income-value">{{ record.todaysIncome.toLocaleString() }}</span>
              </div>
              <div class="table-cell balance-cell">
                <span class="balance-value" :class="{ 'positive': record.todaysBalance >= 0, 'negative': record.todaysBalance < 0 }">
                  {{ record.todaysBalance.toLocaleString() }}
                </span>
              </div>
              <div class="table-cell items-cell">
                <span class="items-count">{{ record.loadList ? record.loadList.length : 0 }}件</span>
              </div>
              <div class="table-cell sessions-cell">
                <span class="sessions-count">{{ record.onlineList ? record.onlineList.length : 0 }}次</span>
              </div>
              <div class="table-cell actions-cell">
                <div class="action-buttons">
                  <el-button size="small" type="primary" @click="viewRecordDetail(record)">详情</el-button>
                  <el-button size="small" type="danger" @click="deleteRecord(index)">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 记录详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="记录详情" width="780px"  class="detail-dialog">
      <div v-if="selectedRecord" class="detail-content">
        <div class="detail-header">
          <h3>{{ selectedRecord.date }} 详细记录</h3>
        </div>

        <!-- 详细统计 -->
        <div class="detail-stats">
          <el-row :gutter="24">
            <el-col :span="6">
              <div class="detail-stat">
                <div class="detail-stat-label">在线时间</div>
                <div class="detail-stat-value">{{ selectedRecord.onlineTime.toFixed(2) }}小时</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat">
                <div class="detail-stat-label">点卡消耗</div>
                <div class="detail-stat-value">{{ selectedRecord.cardCost.toFixed(0) }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat">
                <div class="detail-stat-label">当日收益</div>
                <div class="detail-stat-value">{{ selectedRecord.todaysIncome.toFixed(0) }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="detail-stat">
                <div class="detail-stat-label">当日结余</div>
                <div class="detail-stat-value" :class="{ 'positive': selectedRecord.todaysBalance >= 0, 'negative': selectedRecord.todaysBalance < 0 }">
                  {{ selectedRecord.todaysBalance.toFixed(0) }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 物品列表表格 -->
        <div class="detail-section" v-if="selectedRecord.loadList && selectedRecord.loadList.length > 0">
          <h4>获取物品列表</h4>
          <div class="detail-table-container">
            <div class="detail-table items-table">
              <div class="detail-table-header">
                <div class="detail-header-cell item-icon-cell">图标</div>
                <div class="detail-header-cell item-name-cell">物品名称</div>
                <div class="detail-header-cell item-price-cell">价格</div>
                <div class="detail-header-cell item-count-cell">数量</div>
              </div>
              <div class="detail-table-body">
                <div v-for="(item, index) in selectedRecord.loadList" :key="index" class="detail-table-row">
                  <div class="detail-table-cell item-icon-cell">
                    <img :src="getItemImage(item.itemId)" :alt="getItemName(item.itemId)" class="item-icon">
                  </div>
                  <div class="detail-table-cell item-name-cell">
                    <span class="item-name">{{ getItemName(item.itemId) }}</span>
                  </div>
                  <div class="detail-table-cell item-price-cell">
                    <span class="item-price">¥{{ item.price.toLocaleString() }}</span>
                  </div>
                  <div class="detail-table-cell item-count-cell">
                    <span class="item-count">{{ item.count || 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 在线记录表格 -->
        <div class="detail-section" v-if="selectedRecord.onlineList && selectedRecord.onlineList.length > 0">
          <h4>在线记录</h4>
          <div class="detail-table-container">
            <div class="detail-table sessions-table">
              <div class="detail-table-header">
                <div class="detail-header-cell session-time-cell">在线时间</div>
                <div class="detail-header-cell session-accounts-cell">账号数量</div>
                <div class="detail-header-cell session-price-cell">点卡价格</div>
                <div class="detail-header-cell session-cost-cell">点卡消耗</div>
              </div>
              <div class="detail-table-body">
                <div v-for="(session, index) in selectedRecord.onlineList" :key="index" class="detail-table-row">
                  <div class="detail-table-cell session-time-cell">
                    <span class="session-time">{{ session.time.toFixed(2) }}小时</span>
                  </div>
                  <div class="detail-table-cell session-accounts-cell">
                    <span class="session-accounts">{{ session.onlineAccounts }}个</span>
                  </div>
                  <div class="detail-table-cell session-price-cell">
                    <span class="session-price">{{ session.cardPrice }}</span>
                  </div>
                  <div class="detail-table-cell session-cost-cell">
                    <span class="session-cost">{{ session.cardCost.toFixed(0) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, Clock, Money, Wallet, Document, Download, Delete, Box } from '@element-plus/icons-vue'

// 响应式数据
const allRecords = ref([])
const showDetailDialog = ref(false)
const selectedRecord = ref(null)
const isExporting = ref(false)
const isClearing = ref(false)

// 计算属性
const totalOnlineTime = computed(() => {
  return allRecords.value.reduce((sum, record) => sum + record.onlineTime, 0)
})

const totalIncome = computed(() => {
  return allRecords.value.reduce((sum, record) => sum + record.todaysIncome, 0)
})

const totalBalance = computed(() => {
  return allRecords.value.reduce((sum, record) => sum + record.todaysBalance, 0)
})

// 物品数据（与OnlineRecord.vue保持一致）
const defaultItemsData = [
  { id: 1, name: '60武器', price: 0, image: '/images/items/60.png' },
  { id: 2, name: '70武器', price: 0, image: '/images/items/70.png' },
  { id: 3, name: '80武器', price: 0, image: '/images/items/80.png' },
  { id: 4, name: '60装备', price: 0, image: '/images/items/60防具.png' },
  { id: 5, name: '70装备', price: 0, image: '/images/items/70防具.png' },
  { id: 6, name: '80装备', price: 0, image: '/images/items/80防具.png' },
  { id: 7, name: '特赦令牌', price: 0, image: '/images/items/特赦令牌.png' },
  { id: 8, name: '金刚石', price: 0, image: '/images/items/金刚石.png' },
  { id: 9, name: '定魂珠', price: 0, image: '/images/items/定魂珠.png' },
  { id: 10, name: '夜光珠', price: 0, image: '/images/items/夜光珠.png' },
  { id: 11, name: '龙鳞', price: 0, image: '/images/items/龙鳞.png' },
  { id: 12, name: '避水珠', price: 0, image: '/images/items/避水珠.png' },
  { id: 13, name: '金柳露', price: 0, image: '/images/items/金柳露.png' },
  { id: 14, name: '超级金柳', price: 0, image: '/images/items/超级金柳露.png' },
  { id: 15, name: '净瓶玉露', price: 0, image: '/images/items/净瓶玉露.png' },
  { id: 16, name: '超级净瓶', price: 0, image: '/images/items/超级净瓶玉露.png' },
  { id: 17, name: '强化石', price: 0, image: '/images/items/强化石.png' },
  { id: 18, name: '摇钱树苗', price: 0, image: '/images/items/摇钱树树苗.png' },
  { id: 19, name: '海马', price: 0, image: '/images/items/海马.png' },
  { id: 20, name: '修炼果', price: 0, image: '/images/items/修炼果.png' },
  { id: 21, name: '彩果', price: 0, image: '/images/items/彩果.png' },
  { id: 22, name: '黑宝石', price: 0, image: '/images/items/黑宝石.png' },
  { id: 23, name: '红玛瑙', price: 0, image: '/images/items/红玛瑙.png' },
  { id: 24, name: '太阳石', price: 0, image: '/images/items/太阳石.png' },
  { id: 25, name: '月亮石', price: 0, image: '/images/items/月亮石.png' },
  { id: 26, name: '舍利子', price: 0, image: '/images/items/舍利子.png' },
  { id: 27, name: '光芒石', price: 0, image: '/images/items/光芒石.png' },
  { id: 28, name: '翡翠石', price: 0, image: '/images/items/翡翠石.png' },
  { id: 29, name: '星辉石', price: 0, image: '/images/items/星辉石.png' },
  { id: 30, name: '五色灵尘', price: 0, image: '/images/items/五色灵尘.png' },
  { id: 31, name: '精魄灵石', price: 0, image: '/images/items/精魄灵石.png' },
  { id: 32, name: '乐器', price: 0, image: '/images/items/编钟.png' },
  { id: 33, name: '玫瑰', price: 0, image: '/images/items/红玫瑰.png' },
  { id: 34, name: '符石', price: 0, image: '/images/items/未激活的符石.png' },
  { id: 35, name: '符石卷轴', price: 0, image: '/images/items/符石卷轴.png' },
  { id: 36, name: '月华露', price: 0, image: '/images/items/月华露.png' },
  { id: 37, name: '小丸子', price: 0, image: '/images/items/仙露小丸子.png' },
  { id: 38, name: '金银锦盒', price: 0, image: '/images/items/金银锦盒.png' },
  { id: 39, name: '法宝任务', price: 0, image: '/images/items/法宝任务书.png' },
]

const unsetItemsData = [
  { id: 99, name: '金钱', price: 0, image: '/images/items/金钱.png' },
  { id: 100, name: '兽决', price: 0, image: '/images/items/低级兽诀.png' },
  { id: 101, name: '高级兽决', price: 0, image: '/images/items/高级魔兽要诀.png' },
  { id: 102, name: '内丹', price: 0, image: '/images/items/召唤兽内丹.png' },
  { id: 103, name: '高级内丹', price: 0, image: '/images/items/高级召唤兽内丹.png' },
  { id: 104, name: '珍珠', price: 0, image: '/images/items/珍珠.png' },
  { id: 105, name: '附魔宝珠', price: 0, image: '/images/items/附魔宝珠.png' },
  { id: 106, name: '晶石', price: 0, image: '/images/items/元灵晶石.png' },
  { id: 107, name: '指南书', price: 0, image: '/images/items/灵饰指南书.png' },
  { id: 108, name: '炼妖石', price: 0, image: '/images/items/炼妖石.png' },
  { id: 109, name: '锻造图册', price: 0, image: '/images/items/上古锻造图册.png' },
  { id: 110, name: '如意丹', price: 0, image: '/images/items/如意丹.png' },
  { id: 111, name: '变身卡', price: 0, image: '/images/items/变身卡.png' },
  { id: 112, name: '残卷', price: 0, image: '/images/items/残卷.png' },
  { id: 113, name: '归墟之证', price: 0, image: '/images/items/归墟之证.png' },
]

const totalItemsData = [...defaultItemsData, ...unsetItemsData]

// 方法
const loadRecords = () => {
  const data = localStorage.getItem('mh-all-data')
  if (data) {
    allRecords.value = JSON.parse(data)
  }
}

const getItemImage = (itemId) => {
  const item = totalItemsData.find(item => item.id === itemId)
  return item ? item.image : '/images/items/60.png'
}

const getItemName = (itemId) => {
  const item = totalItemsData.find(item => item.id === itemId)
  return item ? item.name : '未知物品'
}

const viewRecordDetail = (record) => {
  selectedRecord.value = record
  showDetailDialog.value = true
}

const deleteRecord = async (index) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    allRecords.value.splice(index, 1)
    localStorage.setItem('mh-all-data', JSON.stringify(allRecords.value))
    ElMessage.success('记录已删除')
  } catch {
    // 用户取消删除
  }
}

const exportData = async () => {
  isExporting.value = true
  try {
    const dataStr = JSON.stringify(allRecords.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `梦幻西游记录_${new Date().toLocaleDateString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('数据导出成功')
  } catch (error) {
    ElMessage.error('数据导出失败')
  } finally {
    isExporting.value = false
  }
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有记录吗？此操作不可恢复。', '确认清空', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    isClearing.value = true
    allRecords.value = []
    localStorage.removeItem('mh-all-data')
    ElMessage.success('所有记录已清空')
  } catch {
    // 用户取消清空
  } finally {
    isClearing.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadRecords()
})
</script>
<style>
.detail-dialog.el-dialog {
  padding: 0;
  background: rgba(255, 255, 255, 0.25) !important;
  backdrop-filter: blur(30px) !important;
  -webkit-backdrop-filter: blur(30px) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
}
.detail-dialog .el-dialog__body {
  margin: 24px 0;
  padding: 0 24px;
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
}
</style>
<style lang="less" scoped>
@import '../styles/variables.less';
.record-list {
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
  background: rgba(255, 255, 255, 0.25) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  position: relative;
}

.record-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-title h3 {
  margin: 0 0 4px 0;
  color: @text-primary;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.header-subtitle {
  margin: 0;
  color: @text-secondary;
  font-size: 14px;
  letter-spacing: 0.2px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计概览 */
.stats-overview {
  margin-bottom: 24px;
  flex-shrink: 0;
}

.overview-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.6) 20%, 
    rgba(255, 255, 255, 0.8) 50%, 
    rgba(255, 255, 255, 0.6) 80%, 
    transparent 100%);
  pointer-events: none;
  z-index: 1;
}

.overview-card:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  opacity: 0.95;
}

.overview-card.total-days {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);
}

.overview-card.total-time {
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.7) 0%, rgba(56, 158, 13, 0.7) 100%);
}

.overview-card.total-income {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.7) 0%, rgba(9, 109, 217, 0.7) 100%);
}

.overview-card.total-balance {
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.7) 0%, rgba(83, 29, 171, 0.7) 100%);
}

.overview-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
}

.overview-content {
  flex: 1;
}

.overview-number {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1;
}

.overview-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

/* 表格容器 */
.table-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: @text-secondary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.empty-icon {
  color: @text-tertiary;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 20px;
  font-weight: 500;
  color: @text-secondary;
  margin: 0 0 12px 0;
  letter-spacing: 0.3px;
}

.empty-text {
  font-size: 16px;
  color: @text-tertiary;
  margin: 0 0 24px 0;
  opacity: 0.8;
}

/* 表格样式 */
.records-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  min-width: 0; /* 允许表格收缩 */
}

.table-header {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  min-width: 0; /* 允许表头收缩 */
}

.header-cell {
  padding: 12px 16px;
  font-weight: 600;
  color: @text-primary;
  font-size: 14px;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  flex: 1;
  overflow-y: auto;
  min-width: 0; /* 允许表格体收缩 */
}

.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.table-row {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(100px, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s ease;
  min-width: 0; /* 允许行收缩 */
  background: rgba(255, 255, 255, 0.15);
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e4e7ed;
  font-size: 14px;
  color: @text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-cell:last-child {
  border-right: none;
}

/* 单元格内容样式 */
.date-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: @text-primary;
  font-weight: 500;
}

.time-value {
  color: #1890ff;
  font-weight: 500;
}

.cost-value {
  color: #ff4d4f;
  font-weight: 500;
}

.income-value {
  color: #52c41a;
  font-weight: 500;
}

.balance-value {
  font-weight: 600;
}

.balance-value.positive {
  color: #52c41a;
}

.balance-value.negative {
  color: #ff4d4f;
}

.items-count {
  color: #722ed1;
  font-weight: 500;
}

.sessions-count {
  color: #fa8c16;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 详情弹窗 */
.detail-dialog {
  border-radius: 12px;
}


.detail-content {
  padding: 0;
  max-height: 70vh;
}

.detail-content::-webkit-scrollbar {
  width: 8px;
}

.detail-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.detail-header {
  margin-bottom: 24px;
  text-align: center;
}

.detail-header h3 {
  margin: 0;
  color: @text-primary;
  font-size: 20px;
  font-weight: 600;
}

.detail-stats {
  margin-bottom: 32px;
}

.detail-stat {
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.detail-stat-label {
  font-size: 14px;
  color: @text-secondary;
  margin-bottom: 8px;
}

.detail-stat-value {
  font-size: 18px;
  font-weight: 600;
  color: @text-primary;
}

.detail-stat-value.positive {
  color: #52c41a;
}

.detail-stat-value.negative {
  color: #ff4d4f;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: @text-primary;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.detail-items::-webkit-scrollbar {
  width: 6px;
}

.detail-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-items::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-items::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.detail-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 8px;
}

.detail-item-icon img {
  max-width: 24px;
  max-height: 24px;
  object-fit: contain;
}

.detail-item-info {
  flex: 1;
}

.detail-item-name {
  font-size: 14px;
  color: @text-primary;
  font-weight: 500;
  margin-bottom: 4px;
}

.detail-item-price {
  font-size: 12px;
  color: #52c41a;
  font-weight: 600;
}

.detail-online-sessions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.detail-online-sessions::-webkit-scrollbar {
  width: 6px;
}

.detail-online-sessions::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-online-sessions::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-online-sessions::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.detail-session {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  border: 1px solid #91d5ff;
  border-radius: 8px;
}

.detail-session-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-session-time {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.detail-session-details {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: @text-secondary;
}

.detail-session-cost {
  font-size: 14px;
  font-weight: 500;
  color: #ff4d4f;
}

/* 详情表格样式 */
.detail-table-container {
  margin-top: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  min-width: 0; /* 允许表格收缩 */
}

.detail-table {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.detail-table-header {
  display: grid;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  min-width: 0; /* 允许表头收缩 */
}

.detail-header-cell {
  padding: 12px 16px;
  font-weight: 600;
  color: @text-primary;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-header-cell:last-child {
  border-right: none;
}

.detail-table-body {
  flex: 1;
  overflow-y: auto;
  height: 200px; /* 固定高度 */
  min-width: 0; /* 允许表格体收缩 */
}

.detail-table-body::-webkit-scrollbar {
  width: 6px;
}

.detail-table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.detail-table-row {
  display: grid;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s ease;
  min-width: 0; /* 允许行收缩 */
  background: rgba(255, 255, 255, 0.15);
}

.detail-table-row:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.detail-table-row:last-child {
  border-bottom: none;
}

.detail-table-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e4e7ed;
  font-size: 14px;
  color: @text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-table-cell:last-child {
  border-right: none;
}

/* 物品表格列宽 - 使用自适应宽度 */
.items-table .detail-table-header,
.items-table .detail-table-row {
  grid-template-columns: minmax(60px, 1fr) minmax(120px, 2fr) minmax(80px, 1fr) minmax(60px, 1fr);
}

/* 在线记录表格列宽 - 使用自适应宽度 */
.sessions-table .detail-table-header,
.sessions-table .detail-table-row {
  grid-template-columns: minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr);
}

/* 物品图标样式 */
.item-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

</style>
