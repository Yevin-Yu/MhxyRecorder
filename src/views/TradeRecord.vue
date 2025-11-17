<template>
  <div class="trade-record">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">交易中心</span>
            <span class="header-subtitle">管理游戏内交易记录</span>
          </div>
          <div class="header-actions">
            <el-button type="success" @click="addTrade" class="action-button">
              <el-icon>
                <Plus />
              </el-icon>
              添加交易
            </el-button>
            <el-button type="primary" @click="exportData" class="action-button">
              <el-icon>
                <Download />
              </el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </template>

      <!-- 统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="stat-card income">
              <div class="stat-icon">
                <el-icon size="24">
                  <DataLine />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ totalIncome }}</div>
                <div class="stat-label">总收入(万)</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card expense">
              <div class="stat-icon">
                <el-icon size="24">
                  <Wallet />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ totalExpense }}</div>
                <div class="stat-label">总支出(万)</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card profit">
              <div class="stat-icon">
                <el-icon size="24">
                  <PieChart />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ netProfit }}</div>
                <div class="stat-label">净收益(万)</div>
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
                <div class="stat-number">{{ tradeCount }}</div>
                <div class="stat-label">交易次数</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 筛选器 -->
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="filter.type" placeholder="交易类型" clearable class="filter-item">
              <el-option label="购买" value="buy" />
              <el-option label="出售" value="sell" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filter.category" placeholder="物品分类" clearable class="filter-item">
              <el-option label="装备" value="equipment" />
              <el-option label="道具" value="item" />
              <el-option label="宠物" value="pet" />
              <el-option label="材料" value="material" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" class="filter-item" />
          </el-col>
          <el-col :span="6">
            <div class="filter-actions">
              <el-button type="primary" @click="applyFilter" class="filter-btn">
                <el-icon>
                  <Search />
                </el-icon>
                筛选
              </el-button>
              <el-button @click="resetFilter" class="filter-btn">
                <el-icon>
                  <Refresh />
                </el-icon>
                重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 交易记录表格 -->
      <div class="table-container">
        <el-table :data="filteredTrades" style="width: 100%" class="trade-table" stripe>
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'buy' ? 'danger' : 'success'" effect="light">
                {{ scope.row.type === 'buy' ? '购买' : '出售' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="物品名称" width="150" />
          <el-table-column prop="category" label="分类" width="100">
            <template #default="scope">
              <el-tag type="info" effect="plain">{{ scope.row.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="unitPrice" label="单价(万)" width="100">
            <template #default="scope">
              <span class="price">{{ scope.row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价(万)" width="100">
            <template #default="scope">
              <span class="total-price">{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="counterparty" label="交易对象" width="120" />
          <el-table-column prop="notes" label="备注" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="editTrade(scope.row)">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" plain @click="deleteTrade(scope.row)">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="totalTrades" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" background />
      </div>
    </el-card>

    <!-- 添加/编辑交易对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" class="trade-dialog">
      <el-form :model="tradeForm" label-width="100px" class="trade-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交易日期">
              <el-date-picker v-model="tradeForm.date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易类型">
              <el-radio-group v-model="tradeForm.type" class="trade-type-group">
                <el-radio label="buy">购买</el-radio>
                <el-radio label="sell">出售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物品名称">
              <el-input v-model="tradeForm.itemName" placeholder="请输入物品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品分类">
              <el-select v-model="tradeForm.category" placeholder="选择分类" style="width: 100%">
                <el-option label="装备" value="equipment" />
                <el-option label="道具" value="item" />
                <el-option label="宠物" value="pet" />
                <el-option label="材料" value="material" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数量">
              <el-input-number v-model="tradeForm.quantity" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价(万)">
              <el-input-number v-model="tradeForm.unitPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="交易对象">
          <el-input v-model="tradeForm.counterparty" placeholder="请输入交易对象" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="tradeForm.notes" type="textarea" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTrade">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Download, Edit, Delete, Search, Refresh, DataLine, Wallet, PieChart, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const trades = ref([
  {
    id: 1,
    date: '2024-01-15',
    type: 'sell',
    itemName: '龙泉剑',
    category: 'equipment',
    quantity: 1,
    unitPrice: 50,
    totalPrice: 50,
    counterparty: '玩家A',
    notes: '出售武器'
  },
  {
    id: 2,
    date: '2024-01-14',
    type: 'buy',
    itemName: '龙鳞甲',
    category: 'equipment',
    quantity: 1,
    unitPrice: 80,
    totalPrice: 80,
    counterparty: '玩家B',
    notes: '购买防具'
  },
  {
    id: 3,
    date: '2024-01-13',
    type: 'sell',
    itemName: '金创药',
    category: 'item',
    quantity: 10,
    unitPrice: 2,
    totalPrice: 20,
    counterparty: '玩家C',
    notes: '出售药品'
  }
])

const filter = ref({
  type: '',
  category: '',
  dateRange: []
})

const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('添加交易')
const tradeForm = ref({
  date: '',
  type: 'buy',
  itemName: '',
  category: '',
  quantity: 1,
  unitPrice: 0,
  counterparty: '',
  notes: ''
})

// 计算属性
const filteredTrades = computed(() => {
  let result = trades.value

  if (filter.value.type) {
    result = result.filter(trade => trade.type === filter.value.type)
  }

  if (filter.value.category) {
    result = result.filter(trade => trade.category === filter.value.category)
  }

  if (filter.value.dateRange && filter.value.dateRange.length === 2) {
    const startDate = filter.value.dateRange[0]
    const endDate = filter.value.dateRange[1]
    result = result.filter(trade => {
      const tradeDate = new Date(trade.date)
      return tradeDate >= startDate && tradeDate <= endDate
    })
  }

  return result
})

const totalTrades = computed(() => filteredTrades.value.length)

const totalIncome = computed(() => {
  return filteredTrades.value
    .filter(trade => trade.type === 'sell')
    .reduce((total, trade) => total + trade.totalPrice, 0)
})

const totalExpense = computed(() => {
  return filteredTrades.value
    .filter(trade => trade.type === 'buy')
    .reduce((total, trade) => total + trade.totalPrice, 0)
})

const netProfit = computed(() => totalIncome.value - totalExpense.value)

const tradeCount = computed(() => filteredTrades.value.length)

// 方法
const addTrade = () => {
  dialogTitle.value = '添加交易'
  tradeForm.value = {
    date: '',
    type: 'buy',
    itemName: '',
    category: '',
    quantity: 1,
    unitPrice: 0,
    counterparty: '',
    notes: ''
  }
  dialogVisible.value = true
}

const editTrade = (row) => {
  dialogTitle.value = '编辑交易'
  tradeForm.value = { ...row }
  dialogVisible.value = true
}

const deleteTrade = (row) => {
  ElMessageBox.confirm('确定要删除这条交易记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = trades.value.findIndex(item => item.id === row.id)
    trades.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

const saveTrade = () => {
  if (!tradeForm.value.date || !tradeForm.value.itemName || !tradeForm.value.counterparty) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const totalPrice = tradeForm.value.quantity * tradeForm.value.unitPrice

  if (dialogTitle.value === '添加交易') {
    const newTrade = {
      id: Date.now(),
      ...tradeForm.value,
      totalPrice
    }
    trades.value.unshift(newTrade)
    ElMessage.success('添加成功')
  } else {
    const index = trades.value.findIndex(item => item.id === tradeForm.value.id)
    trades.value[index] = { ...tradeForm.value, totalPrice }
    ElMessage.success('更新成功')
  }

  dialogVisible.value = false
}

const applyFilter = () => {
  currentPage.value = 1
  ElMessage.success('筛选已应用')
}

const resetFilter = () => {
  filter.value = {
    type: '',
    category: '',
    dateRange: []
  }
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.trade-record {
  height: calc(100% - 48px);
  margin: 24px;
}

.record-card {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  padding: 12px 24px;
  font-weight: 500;
}

.stats-container {
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 16px;
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

.stat-card.income {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.stat-card.expense {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
}

.stat-card.profit {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.stat-card.count {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  backdrop-filter: blur(10px);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.filter-container {
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #e9ecef;
}

.filter-item {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 12px;
  height: 100%;
  align-items: center;
}

.filter-btn {
  flex: 1;
  padding: 12px 20px;
  font-weight: 500;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.trade-table {
  margin: 0;
}

.price {
  color: #1890ff;
  font-weight: 600;
}

.total-price {
  color: #52c41a;
  font-weight: 700;
  font-size: 16px;
}

.pagination-container {
  text-align: center;
  padding: 20px 0;
  background: white;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #f0f0f0;
}

.trade-dialog .el-dialog__body {
  padding: 32px;
}

.trade-form .el-form-item {
  margin-bottom: 24px;
}

.trade-form .el-form-item__label {
  font-weight: 600;
  color: #2c3e50;
}

.trade-type-group {
  display: flex;
  gap: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-container .el-col {
    margin-bottom: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 28px;
  }

  .header-title {
    font-size: 18px;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .filter-container {
    padding: 16px;
  }

  .filter-actions {
    flex-direction: column;
    gap: 8px;
  }

  .filter-btn {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }

  .header-title {
    font-size: 16px;
  }

  .header-subtitle {
    font-size: 12px;
  }

  .action-button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .filter-container {
    padding: 12px;
  }

  .filter-container .el-row {
    margin: 0 !important;
  }

  .filter-container .el-col {
    margin-bottom: 12px;
  }
}
</style>
