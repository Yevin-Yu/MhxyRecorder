import { ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60

/**
 * 计算时间差（毫秒）转换为小时数
 */
function calculateHours(startTime) {
  if (!startTime) return 0
  const diff = Date.now() - startTime.getTime()
  const hours = Math.floor(diff / MS_PER_HOUR)
  const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE)
  const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND)
  return hours + minutes / 60 + seconds / 3600
}

/**
 * 格式化时间差为字符串
 */
function formatDuration(startTime) {
  if (!startTime) return '0小时0分钟'
  const diff = Date.now() - startTime.getTime()
  const hours = Math.floor(diff / MS_PER_HOUR)
  const minutes = Math.floor((diff % MS_PER_MINUTE) / MS_PER_MINUTE)
  const seconds = Math.floor((diff % MS_PER_SECOND) / MS_PER_SECOND)
  return `${hours}小时${minutes}分钟${seconds}秒`
}

/**
 * 在线计时功能
 */
export function useOnlineTimer() {
  const isOnline = ref(false)
  const startTime = ref(null)
  const currentDuration = ref('0小时0分钟')
  const isStarting = ref(false)
  const isEnding = ref(false)
  let timer = null

  const updateCurrentDuration = () => {
    if (!isOnline.value || !startTime.value) return
    currentDuration.value = formatDuration(startTime.value)
  }

  const start = () => {
    isStarting.value = true
    setTimeout(() => {
      isOnline.value = true
      startTime.value = new Date()
      updateCurrentDuration()
      timer = setInterval(updateCurrentDuration, 10000)
      ElMessage.success('开始记录游戏时间')
      isStarting.value = false
    }, 500)
  }

  const stop = () => {
    isEnding.value = true
    setTimeout(() => {
      clearInterval(timer)
      timer = null
      isOnline.value = false
      ElMessage.success('游戏时间记录已结束')
      isEnding.value = false
    }, 500)
  }

  const getOnlineTime = () => {
    return calculateHours(startTime.value)
  }

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return {
    isOnline,
    startTime,
    currentDuration,
    isStarting,
    isEnding,
    start,
    stop,
    getOnlineTime,
    updateCurrentDuration
  }
}

