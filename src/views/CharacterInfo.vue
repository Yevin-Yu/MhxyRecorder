<template>
  <div class="character-info">
    <el-row :gutter="24">
      <!-- 角色基本信息 -->
      <el-col :span="8">
        <el-card class="info-card character-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="header-title">角色档案</span>
                <span class="header-subtitle">展示你的游戏角色风采</span>
              </div>
              <el-button type="primary" size="small" @click="editBasicInfo" class="action-button">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
            </div>
          </template>

          <div class="character-avatar">
            <div class="avatar-container">
              <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="level-badge">{{ characterInfo.level }}</div>
            </div>
            <h3 class="character-name">{{ characterInfo.name }}</h3>
            <p class="character-school">{{ characterInfo.school }}</p>
          </div>

          <div class="character-stats">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="服务器">
                <el-tag type="info" effect="plain">{{ characterInfo.server }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ characterInfo.createTime }}</el-descriptions-item>
              <el-descriptions-item label="在线时长">
                <span class="online-time">{{ characterInfo.onlineTime }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>

      <!-- 属性面板 -->
      <el-col :span="16">
        <el-card class="info-card attributes-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="header-title">属性面板</span>
                <span class="header-subtitle">查看角色详细属性数据</span>
              </div>
              <el-button type="primary" size="small" @click="editAttributes" class="action-button">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑属性
              </el-button>
            </div>
          </template>

          <el-row :gutter="24">
            <el-col :span="12">
              <div class="attributes-section">
                <h4 class="section-title">基础属性</h4>
                <div class="attributes-grid">
                  <div class="attribute-item">
                    <span class="attribute-label">气血</span>
                    <span class="attribute-value">{{ attributes.hp }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">魔法</span>
                    <span class="attribute-value">{{ attributes.mp }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">攻击</span>
                    <span class="attribute-value">{{ attributes.attack }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">防御</span>
                    <span class="attribute-value">{{ attributes.defense }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">速度</span>
                    <span class="attribute-value">{{ attributes.speed }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="attributes-section">
                <h4 class="section-title">高级属性</h4>
                <div class="attributes-grid">
                  <div class="attribute-item">
                    <span class="attribute-label">命中</span>
                    <span class="attribute-value">{{ attributes.hit }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">闪避</span>
                    <span class="attribute-value">{{ attributes.dodge }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">暴击</span>
                    <span class="attribute-value">{{ attributes.critical }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">抗性</span>
                    <span class="attribute-value">{{ attributes.resistance }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attribute-label">幸运</span>
                    <span class="attribute-value">{{ attributes.luck }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 装备信息 -->
    <el-card class="equipment-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">装备展示</span>
            <span class="header-subtitle">查看角色装备配置</span>
          </div>
          <el-button type="primary" size="small" @click="manageEquipment" class="action-button">
            <el-icon>
              <Setting />
            </el-icon>
            管理装备
          </el-button>
        </div>
      </template>

      <div class="equipment-grid">
        <div class="equipment-slot" v-for="equipment in equipmentList" :key="equipment.slot">
          <div class="slot-header">{{ equipment.slotName }}</div>
          <div class="equipment-item" :class="{ empty: !equipment.name }">
            <div class="equipment-icon">
              <el-avatar :size="40" :src="equipment.icon" />
              <div class="equipment-level" v-if="equipment.level">+{{ equipment.level }}</div>
            </div>
            <div class="equipment-info">
              <div class="equipment-name">{{ equipment.name || '未装备' }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 技能信息 -->
    <el-card class="skill-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">技能列表</span>
            <span class="header-subtitle">管理角色技能配置</span>
          </div>
          <el-button type="primary" @click="addSkill" class="action-button">
            <el-icon>
              <Plus />
            </el-icon>
            添加技能
          </el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="skillList" style="width: 100%" class="skill-table" stripe>
          <el-table-column prop="name" label="技能名称" width="150" />
          <el-table-column prop="level" label="等级" width="80">
            <template #default="scope">
              <el-tag type="success" effect="plain">Lv.{{ scope.row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="getSkillTypeColor(scope.row.type)" effect="plain">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="cooldown" label="冷却时间" width="100">
            <template #default="scope">
              <el-tag type="warning" effect="plain">{{ scope.row.cooldown }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
            :total="skillList.length" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" background />
        </div>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" class="character-dialog">
      <el-form :model="editForm" label-width="100px" class="character-form">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input-number v-model="editForm.level" :min="1" :max="175" style="width: 100%" />
        </el-form-item>
        <el-form-item label="门派">
          <el-select v-model="editForm.school" placeholder="选择门派" style="width: 100%">
            <el-option label="大唐官府" value="大唐官府" />
            <el-option label="方寸山" value="方寸山" />
            <el-option label="化生寺" value="化生寺" />
            <el-option label="女儿村" value="女儿村" />
            <el-option label="天宫" value="天宫" />
            <el-option label="龙宫" value="龙宫" />
            <el-option label="五庄观" value="五庄观" />
            <el-option label="普陀山" value="普陀山" />
            <el-option label="阴曹地府" value="阴曹地府" />
            <el-option label="魔王寨" value="魔王寨" />
            <el-option label="狮驼岭" value="狮驼岭" />
            <el-option label="盘丝洞" value="盘丝洞" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器">
          <el-input v-model="editForm.server" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveInfo">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Edit, Setting, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 角色基本信息
const characterInfo = ref({
  name: '梦幻玩家',
  level: 69,
  school: '大唐官府',
  server: '紫禁城',
  createTime: '2023-01-01',
  onlineTime: '1200小时'
})

// 角色属性
const attributes = ref({
  hp: 3500,
  mp: 2800,
  attack: 1200,
  defense: 800,
  speed: 450,
  hit: 85,
  dodge: 75,
  critical: 15,
  resistance: 60,
  luck: 50
})

// 装备列表
const equipmentList = ref([
  { slot: 'weapon', slotName: '武器', name: '龙泉剑', level: 10, icon: 'https://via.placeholder.com/50' },
  { slot: 'helmet', slotName: '头盔', name: '紫金冠', level: 8, icon: 'https://via.placeholder.com/50' },
  { slot: 'armor', slotName: '铠甲', name: '龙鳞甲', level: 12, icon: 'https://via.placeholder.com/50' },
  { slot: 'shoes', slotName: '鞋子', name: '疾风靴', level: 6, icon: 'https://via.placeholder.com/50' },
  { slot: 'necklace', slotName: '项链', name: '如意珠', level: 9, icon: 'https://via.placeholder.com/50' },
  { slot: 'ring', slotName: '戒指', name: '乾坤戒', level: 7, icon: 'https://via.placeholder.com/50' },
  { slot: 'belt', slotName: '腰带', name: '玉带', level: 5, icon: 'https://via.placeholder.com/50' },
  { slot: 'accessory', slotName: '配饰', name: '', level: 0, icon: 'https://via.placeholder.com/50' }
])

// 技能列表
const skillList = ref([
  { name: '横扫千军', level: 10, type: '攻击', description: '对敌方单体造成大量伤害', cooldown: '3回合' },
  { name: '破血狂攻', level: 8, type: '攻击', description: '连续攻击敌方目标', cooldown: '5回合' },
  { name: '后发制人', level: 6, type: '防御', description: '提升自身防御力', cooldown: '4回合' },
  { name: '杀气诀', level: 9, type: '增益', description: '提升攻击力和暴击率', cooldown: '6回合' }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('编辑信息')
const editForm = ref({})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 方法
const editBasicInfo = () => {
  dialogTitle.value = '编辑基本信息'
  editForm.value = { ...characterInfo.value }
  dialogVisible.value = true
}

const editAttributes = () => {
  ElMessage.info('属性编辑功能开发中...')
}

const manageEquipment = () => {
  ElMessage.info('装备管理功能开发中...')
}

const addSkill = () => {
  ElMessage.info('添加技能功能开发中...')
}

const saveInfo = () => {
  Object.assign(characterInfo.value, editForm.value)
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

const getSkillTypeColor = (type) => {
  const colorMap = {
    '攻击': 'danger',
    '防御': 'info',
    '增益': 'success',
    '控制': 'warning'
  }
  return colorMap[type] || 'info'
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';
.character-info {
  height: calc(100% - 48px);
  margin: 24px;
}

.info-card {
  margin-bottom: 24px;
  height: 100%;
}

.character-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.character-card .el-card__header {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.character-card .header-title,
.character-card .header-subtitle {
  color: white;
}

.attributes-card {
  background: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  /* flex-direction: column; */
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: @text-primary;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 14px;
  color: @text-secondary;
  font-weight: 400;
}

.action-button {
  padding: 8px 16px;
  font-weight: 500;
}

.character-avatar {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.level-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.character-name {
  margin: 0 0 8px 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.character-school {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.character-stats {
  margin-top: 20px;
}

.online-time {
  color: #52c41a;
  font-weight: 600;
}

.attributes-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: @text-primary;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.attributes-grid {
  display: grid;
  gap: 12px;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.attribute-item:hover {
  background: #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attribute-label {
  font-weight: 500;
  color: @text-tertiary;
}

.attribute-value {
  font-weight: 600;
  color: @text-primary;
  font-size: 16px;
}

.equipment-card,
.skill-card {
  margin-bottom: 24px;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.equipment-slot {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.equipment-slot:hover {
  background: #e9ecef;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.slot-header {
  font-weight: 600;
  color: @text-primary;
  margin-bottom: 12px;
  text-align: center;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.equipment-item.empty {
  background: #f8f9fa;
  color: @text-tertiary;
  border: 1px dashed #dee2e6;
}

.equipment-icon {
  position: relative;
}

.equipment-level {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.equipment-info {
  flex: 1;
}

.equipment-name {
  font-weight: 600;
  color: @text-primary;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.skill-table {
  margin: 0;
}

.character-dialog .el-dialog__body {
  padding: 32px;
}

.character-form .el-form-item {
  margin-bottom: 24px;
}

.character-form .el-form-item__label {
  font-weight: 600;
  color: @text-primary;
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

</style>
