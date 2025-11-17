<template>
  <div class="online-record">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <div class="setting-button-container">
              <el-popover placement="bottom" width="240" trigger="hover" ref="accountPopover">
                <template #reference>
                  <el-button class="action-button setting-button">
                    在线角色：{{ currentSetData.onlineAccounts }}
                  </el-button>
                </template>
                <div class="setting-popover">
                  <div class="setting-title">设置在线账号数</div>
                  <el-input-number class="input-number" v-model="currentSetData.onlineAccounts" :min="1" :max="20"
                    label="账号数量" size="large"></el-input-number>
                </div>
              </el-popover>
              <el-popover placement="bottom" width="240" trigger="hover" ref="cardPricePopover">
                <template #reference>
                  <el-button class="action-button setting-button">
                    点卡价格：{{ currentSetData.cardPrice }}
                  </el-button>
                </template>
                <div class="setting-popover">
                  <div class="setting-title">设置点卡价格</div>
                  <el-input-number class="input-number" v-model="currentSetData.cardPrice" :min="1000" :step="1000"
                    label="价格" size="large"></el-input-number>
                </div>
              </el-popover>
            </div>
            <div class="action-button-container">
              <span v-if="isOnline" class="online-duration"> 当前在线：{{ currentDuration }} </span>
              <el-button v-if="!isOnline" type="primary" @click="startOnline" class="action-button start-button"
                :loading="isStarting">
                <el-icon>
                  <VideoPlay />
                </el-icon>
                开始游戏
              </el-button>
              <el-button v-if="isOnline" type="danger" @click="endOnline" class="action-button end-button"
                :loading="isEnding">
                <el-icon>
                  <VideoPause />
                </el-icon>
                结束游戏
              </el-button>
            </div>
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

      <!-- 价格设置弹窗 -->
      <el-dialog v-model="showPriceDialog" title="设置物品价格" width="30%" center class="custom-dialog">
        <div class="price-dialog-content">
          <div class="dialog-item-info">
            <div class="dialog-item-image">
              <img :src="currentItem?.image" :alt="currentItem?.name" v-if="currentItem?.image">
              <el-icon :size="40" class="dialog-icon" v-else>
                <Box />
              </el-icon>
            </div>
            <div class="dialog-item-details">
              <div class="dialog-item-name">
                {{ currentItem?.name || '未知物品' }}
              </div>
              <div class="price-input">
                <el-input-number v-model="itemPrice" :min="0" :step="1000" size="large" class="custom-input-number"
                  controls-position="right" :precision="0" placeholder="请输入价格">
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
            <el-button @click="cancelSetPrice" class="dialog-btn cancel-btn">取消</el-button>
            <el-button type="primary" @click="confirmSetPrice" class="dialog-btn confirm-btn">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { ElMessage, ElPopover, ElInputNumber, ElDialog } from 'element-plus'
import { Box, ShoppingBag, Delete, VideoPlay, VideoPause, Clock, Sunrise, Calendar, Document } from '@element-plus/icons-vue'


// 在线角色数 与 点卡价格 ------------------
const currentSetData = ref({
  onlineAccounts: 5,
  cardPrice: 15000
})
// 监听设置数据变化
watch(currentSetData, () => {
  localStorage.setItem('mh-current-set-data', JSON.stringify(currentSetData.value))
}, {
  deep: true,
  immediate: false
})
// 挂载时获取本地数据
onMounted(() => {
  let data = localStorage.getItem('mh-current-set-data')
  if (data) currentSetData.value = JSON.parse(data)
})

// 在线计时模块 ------------------
const isOnline = ref(false)
const startTime = ref(null)
const currentDuration = ref('0小时0分钟')
const isStarting = ref(false)
const isEnding = ref(false)
let timer = null

// 更新当前在线时长
const updateCurrentDuration = () => {
  if (!isOnline.value || !startTime.value) return
  const now = new Date()
  const diff = now - startTime.value
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  currentDuration.value = `${hours}小时${minutes}分钟${seconds}秒`
}
// 开始游戏
const startOnline = () => {
  isStarting.value = true
  setTimeout(() => {
    isOnline.value = true
    startTime.value = new Date()
    updateCurrentDuration()
    // 每10秒更新一次时长
    timer = setInterval(updateCurrentDuration, 10000)
    ElMessage.success('开始记录游戏时间')
    isStarting.value = false
  }, 500)
}
// 结束游戏
const endOnline = () => {
  isEnding.value = true
  setTimeout(() => {
    clearInterval(timer)
    timer = null
    getOnlineTime()
    isOnline.value = false
    ElMessage.success('游戏时间记录已结束')
    isEnding.value = false
  }, 500)
}

// 计算该次在线时长 单位为小时
const getOnlineTime = () => {
  const now = new Date()
  const diff = now - startTime.value
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  const onlineTime = hours + minutes / 60 + seconds / 3600
  console.log(onlineTime)
  todaysData.value.onlineTime += onlineTime
  // 当日在线列表记录
  const data = {
    time: onlineTime,
    start: startTime.value,
    end: now,
    onlineAccounts: currentSetData.value.onlineAccounts,
    cardPrice: currentSetData.value.cardPrice,
    cardCost: onlineTime * currentSetData.value.cardPrice * 6 * currentSetData.value.onlineAccounts,
  }
  todaysData.value.onlineList.unshift(data)
  todaysData.value.cardCost += data.cardCost
  todaysData.value.todaysBalance = todaysData.value.todaysIncome - todaysData.value.cardCost
}

// 当日记录模块 ------------------
const todaysData = ref({
  date: new Date().toLocaleDateString(), // 日期
  onlineTime: 0, // 在线时长
  cardCost: 0, // 点卡消耗
  todaysIncome: 0, // 今日收入
  todaysBalance: 0, // 今日结余
  loadList: [], // 加载列表
  onlineList: [], // 在线列表
})

// 监听当日数据变化
watch(todaysData, () => {
  localStorage.setItem('mh-todays-data', JSON.stringify(todaysData.value))
  // 保存到所有数据中
  const allData = localStorage.getItem('mh-all-data')
  if (allData) {
    const parsedData = JSON.parse(allData)
    let index = parsedData.findIndex(item => item.date === todaysData.value.date)
    if (index !== -1) {
      parsedData[index] = todaysData.value
    } else {
      parsedData.unshift(todaysData.value)
    }
    localStorage.setItem('mh-all-data', JSON.stringify(parsedData))
  } else {
    localStorage.setItem('mh-all-data', JSON.stringify([todaysData.value]))
  }
}, {
  deep: true,
  immediate: false
})

// 挂载时获取本地数据
onMounted(() => {
  let data = localStorage.getItem('mh-todays-data')
  data = JSON.parse(data)
  if (data && data.date == new Date().toLocaleDateString()) {
    todaysData.value = data
    if (todaysData.value.loadList.length) {
      selectedItems.value = todaysData.value.loadList
    }
  }
})


// 物品数据  --------------------
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

// 不固定价格物品列表
const unsetItemsData = ref([
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
])

const totalItemsData = ref([...defaultItemsData, ...unsetItemsData.value])
// 物品数据响应式对象 - 初始化为默认值
const itemsData = ref([...defaultItemsData])
// 在组件挂载时从本地存储加载数据
onMounted(() => {
  let data = localStorage.getItem('mh-items-data')
  if (data) itemsData.value = JSON.parse(data)
})

// 监听物品数据变化
watch(itemsData, () => {
  localStorage.setItem('mh-items-data', JSON.stringify(itemsData.value))
}, {
  deep: true,
  immediate: false
})




// 快速记录物品相关的响应式数据
const selectedItems = ref([]) // 已选择物品列表
const showPriceDialog = ref(false) // 是否显示价格设置弹窗
const currentItem = ref(null) // 当前正在操作的物品
const itemPrice = ref(0) // 当前物品的价格

// 根据ID获取物品
const getItemById = (id) => {
  return totalItemsData.value.find(item => item.id === id)
}

// 处理物品点击
const handleItemClick = (item) => {
  if (item && item.price > 0) {
    // 如果已设置价格，直接添加
    addItemToSelected(item)
  } else {
    // 未设置价格，打开价格设置弹窗
    currentItem.value = item
    itemPrice.value = item.price || 0
    showPriceDialog.value = true
  }
}

// 处理物品右键点击
const handleItemRightClick = (item) => {
  // 右键点击可重新设置价格
  currentItem.value = item
  itemPrice.value = item.price || 0
  showPriceDialog.value = true
}

// 添加物品到已选择列表
const addItemToSelected = (item) => {
  selectedItems.value.unshift({
    itemId: item.id,
    price: item.price
  })
  ElMessage.success(`${item.name} 已添加`)
}

// 确认设置价格
const confirmSetPrice = () => {
  // 不固定价格物品
  if (currentItem.value.id >= 99 && itemPrice.value > 0) {
    // 关闭弹窗
    showPriceDialog.value = false
    // 添加到已选择列表
    addItemToSelected({
      id: currentItem.value.id,
      name: currentItem.value.name,
      price: itemPrice.value
    })
  } else if (currentItem.value && itemPrice.value > 0) {
    // 更新物品价格
    const itemIndex = itemsData.value.findIndex(item => item.id === currentItem.value.id)
    if (itemIndex !== -1) {
      // 更新价格
      itemsData.value[itemIndex].price = itemPrice.value
      // 关闭弹窗
      showPriceDialog.value = false
      // 添加到已选择列表
      addItemToSelected(itemsData.value[itemIndex])
      ElMessage.success(`${itemsData.value[itemIndex].name} 价格已设置为 ¥${itemPrice.value}`)
    }
  } else {
    ElMessage.warning('请输入有效的价格')
  }
}

// 取消设置价格
const cancelSetPrice = () => {
  showPriceDialog.value = false
}

// 从已选择列表中移除物品
const removeSelectedItem = (index) => {
  selectedItems.value.splice(index, 1)
  ElMessage.success(`已移除物品`)
}

// 计算总价值
const totalValue = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price, 0)
})

// 监听总价值变化
watch(totalValue, () => {
  todaysData.value.todaysIncome = totalValue.value || 0
}, {
  deep: true,
  immediate: false
})


// 监听已选择物品变化，自动保存
watch(selectedItems, () => {
  todaysData.value.loadList = selectedItems.value
  setTimeout(() => {
    todaysData.value.todaysBalance = todaysData.value.todaysIncome - todaysData.value.cardCost
  }, 100);
}, { deep: true })


</script>

<style>
.el-popper.is-light.el-tooltip.el-popover {
  padding: 0;
  border-radius: 6px;
}

.custom-dialog.el-dialog.el-dialog--center {
  min-width: 450px;
  padding: 0;
}

.custom-dialog.el-dialog.el-dialog--center .el-dialog__header {
  padding: 12px 16px !important;
}

.custom-dialog.el-dialog.el-dialog--center .el-dialog__title {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: #2c3e50 !important;
}

.custom-dialog.el-dialog.el-dialog--center .el-dialog__body {
  padding: 16px;
}

.custom-dialog.el-dialog.el-dialog--center .el-dialog__footer {
  padding: 0px 16px 24px 16px;
}
</style>
<style scoped>
.online-record {
  height: calc(100% - 32px);
  margin: 16px;
  display: flex;
  flex-direction: column;
}

.record-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.header-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
}

.online-duration {
  font-size: 18px;
  color: #389e0d;
  font-weight: 400;
  padding-right: 16px;
}

.setting-button {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-color: #eee;
  color: white;
}

.setting-popover {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  animation: popoverSlideIn 0.2s ease-out;
}

.input-number {
  margin-left: 8px;
  text-align: center;
  outline: none;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.input-number:hover {
  border-color: #c0c4cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.input-number:focus-within {
  border-color: #c0c4cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.input-number .el-input__inner {
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  padding: 8px 12px;
}

@keyframes popoverSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}



.setting-title {
  font-size: 16px;
  color: #1f2329;
  margin-bottom: 16px;
  text-align: center;
}

.setting-button {
  transition: all 0.3s ease;
}

.setting-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.action-button {
  padding: 12px 24px;
  font-weight: 500;
  padding: 20px 24px;
  border-color: #eee;
}

.start-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.start-button .el-icon,
.end-button .el-icon {
  margin-right: 6px;
}

.end-button {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%)
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
  border-radius: 6px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none !important;
  border: 1px solid #eee !important;
  display: flex;
  flex-direction: column;
}


.quick-record .item-selection-card :deep(.el-card__header),
.quick-record .selected-items-card :deep(.el-card__header) {
  padding: 12px 16px !important;
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
  transform: translateY(-2px);
  box-shadow: none !important;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 12px;
  color: #7f8c8d;
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
  padding: 4px !important;
  height: 28px;
  width: 28px;
}

.header-total-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
}

.header-total-value {
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
  padding: 4px 8px;
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
  padding: 0px;
  margin: 8px 0;
  font-size: 13px;
  color: #764ba2;
}

.item-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 6px 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 72px;
  height: 80px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
}

.item-card:hover {
  border-color: #764ba280;
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
  color: #2c3e50;
  margin-bottom: 4px;
  font-weight: 500;
  line-height: 1.1;
  text-align: center;
  flex-shrink: 0;
}

.item-price {
  position: relative;
  z-index: 1;
  font-size: 10px;
  color: #52c41a;
  font-weight: 600;
  background: rgba(82, 196, 26, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
  flex-shrink: 0;
}

.item-status {
  position: relative;
  z-index: 1;
  font-size: 10px;
  color: #faad14;
  font-weight: 500;
  background: rgba(250, 173, 20, 0.1);
  padding: 1px 4px;
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
  padding: 30px 15px;
  color: #7f8c8d;
}

.empty-icon {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #7f8c8d;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: #bfbfbf;
  margin: 0;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.selected-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
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
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.2;
}

.selected-item-price {
  font-size: 13px;
  color: #52c41a;
  font-weight: 600;
}

.selected-item-actions {
  flex-shrink: 0;
}



/* 价格设置弹窗 */
.price-dialog-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-item-info {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f7ff 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  width: 90%;
}

.dialog-item-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  padding: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.dialog-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.dialog-icon {
  color: #667eea;
}

.dialog-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-item-name {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 400;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.price-input {
  display: flex;
  width: 100%;
}

.custom-input-number {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  /* background-color: #fff; */
}

.custom-input-number :deep(.el-input__wrapper) {
  border-radius: 0 !important;
  background: linear-gradient(135deg, #ffffff 0%, #f9faff 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(102, 126, 234, 0.2) !important;
  transition: all 0.3s ease;
  padding: 6px 8px;
}

.custom-input-number :deep(.el-input__inner) {
  font-size: 18px !important;
}

.custom-input-number :deep(.el-input__wrapper):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(102, 126, 234, 0.4) !important;
}

.custom-input-number :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(102, 126, 234, 0.6) !important;
}

.price-prefix {
  color: #764ba2;
  font-weight: 600;
  font-size: 18px;
  margin-right: 4px;
}

.dialog-btn {
  min-width: 100px;
  padding: 12px 20px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background: #f5f7fa;
  border-color: #dcdfe6;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}




/* 统计卡片 */
.stats-container {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px 10px;
  border-radius: 12px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.today {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.stat-card.weekly {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.stat-card.count {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  margin-left: 8px;
  backdrop-filter: blur(10px);
}

.stat-content {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}
</style>
