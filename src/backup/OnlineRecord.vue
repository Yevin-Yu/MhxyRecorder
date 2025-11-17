<template>
  <div class="online-record">
    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">游戏时光</span>
            <span class="header-subtitle">记录每一次精彩的游戏瞬间</span>
          </div>
          <el-button type="primary" @click="addRecord" class="action-button">
            <el-icon><Plus /></el-icon>
            添加记录
          </el-button>
        </div>
      </template>

      <!-- 统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="stat-card total">
              <div class="stat-icon">
                <el-icon size="24"><Clock /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ totalHours }}</div>
                <div class="stat-label">总在线时长(小时)</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card today">
              <div class="stat-icon">
                <el-icon size="24"><Sunrise /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ todayHours }}</div>
                <div class="stat-label">今日在线(小时)</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card weekly">
              <div class="stat-icon">
                <el-icon size="24"><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ weeklyHours }}</div>
                <div class="stat-label">本周在线(小时)</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card count">
              <div class="stat-icon">
                <el-icon size="24"><Document /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ recordCount }}</div>
                <div class="stat-label">记录总数</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 记录表格 -->
      <div class="table-container">
        <el-table :data="records" style="width: 100%" class="record-table" stripe>
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="startTime" label="开始时间" width="120" />
          <el-table-column prop="endTime" label="结束时间" width="120" />
          <el-table-column prop="duration" label="在线时长" width="100">
            <template #default="scope">
              <el-tag type="info" effect="plain">{{ scope.row.duration }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="activity" label="主要活动" />
          <el-table-column prop="notes" label="备注" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="editRecord(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" plain @click="deleteRecord(scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalRecords"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" class="record-dialog">
      <el-form :model="recordForm" label-width="100px" class="record-form">
        <el-form-item label="日期">
          <el-date-picker v-model="recordForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="recordForm.startTime" placeholder="选择开始时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="recordForm.endTime" placeholder="选择结束时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="主要活动">
          <el-input v-model="recordForm.activity" placeholder="请输入主要活动" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="recordForm.notes" type="textarea" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRecord">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Edit, Delete, Clock, Sunrise, Calendar, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const records = ref([
  {
    id: 1,
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '12:00',
    duration: '3小时',
    activity: '打怪升级',
    notes: '在龙宫刷怪'
  },
  {
    id: 2,
    date: '2024-01-14',
    startTime: '14:00',
    endTime: '18:00',
    duration: '4小时',
    activity: '做任务',
    notes: '完成主线任务'
  },
  {
    id: 3,
    date: '2024-01-13',
    startTime: '19:00',
    endTime: '22:00',
    duration: '3小时',
    activity: '副本',
    notes: '刷副本获得装备'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('添加记录')
const recordForm = ref({
  date: '',
  startTime: '',
  endTime: '',
  activity: '',
  notes: ''
})

// 计算属性
const totalRecords = computed(() => records.value.length)

// 方法
const addRecord = () => {
  dialogTitle.value = '添加记录'
  recordForm.value = {
    date: '',
    startTime: '',
    endTime: '',
    activity: '',
    notes: ''
  }
  dialogVisible.value = true
}

const editRecord = (row) => {
  dialogTitle.value = '编辑记录'
  recordForm.value = { ...row }
  dialogVisible.value = true
}

const deleteRecord = (row) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = records.value.findIndex(item => item.id === row.id)
    records.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

const saveRecord = () => {
  if (!recordForm.value.date || !recordForm.value.startTime || !recordForm.value.endTime) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogTitle.value === '添加记录') {
    const newRecord = {
      id: Date.now(),
      ...recordForm.value,
      duration: calculateDuration(recordForm.value.startTime, recordForm.value.endTime)
    }
    records.value.unshift(newRecord)
    ElMessage.success('添加成功')
  } else {
    const index = records.value.findIndex(item => item.id === recordForm.value.id)
    records.value[index] = { 
      ...recordForm.value, 
      duration: calculateDuration(recordForm.value.startTime, recordForm.value.endTime)
    }
    ElMessage.success('更新成功')
  }
  
  dialogVisible.value = false
}

const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01 ${startTime}`)
  const end = new Date(`2000-01-01 ${endTime}`)
  const diff = end - start
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
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
.online-record {
  max-width: 1200px;
  margin: 0 auto;
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

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.record-table {
  margin: 0;
}

.record-dialog .el-dialog__body {
  padding: 32px;
}

.record-form .el-form-item {
  margin-bottom: 24px;
}

.record-form .el-form-item__label {
  font-weight: 600;
  color: #2c3e50;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-container {
  text-align: center;
  padding: 20px 0;
  background: white;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #f0f0f0;
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
}
</style>
