/**
 * 背景管理工具
 */
import { STORAGE_KEYS } from '../constants'
import { getStorage, setStorage } from './storage'

// 导入背景图片
import wallpaper2024Spring from '../wallpaper/2024新春锦衣祥瑞.png'
import wallpaper2024Carnival from '../wallpaper/2024嘉年华锦衣.png'
import wallpaper2025Qixi from '../wallpaper/2025七夕锦衣.png'
import wallpaper2025Spring from '../wallpaper/2025新春锦衣祥瑞.png'

// 默认渐变背景
const DEFAULT_GRADIENT = `
  radial-gradient(circle at 20% 50%, rgba(219, 234, 254, 0.4) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(243, 232, 255, 0.4) 0%, transparent 50%),
  radial-gradient(circle at 40% 20%, rgba(252, 231, 243, 0.3) 0%, transparent 50%),
  linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #fef3c7 100%)
`

export const wallpaperList = [
  {
    id: 'default',
    name: '默认渐变',
    type: 'gradient',
    value: null
  },
  {
    id: '2024-spring',
    name: '2024新春锦衣祥瑞',
    type: 'image',
    value: wallpaper2024Spring
  },
  {
    id: '2024-carnival',
    name: '2024嘉年华锦衣',
    type: 'image',
    value: wallpaper2024Carnival
  },
  {
    id: '2025-qixi',
    name: '2025七夕锦衣',
    type: 'image',
    value: wallpaper2025Qixi
  },
  {
    id: '2025-spring',
    name: '2025新春锦衣祥瑞',
    type: 'image',
    value: wallpaper2025Spring
  }
]

const DEFAULT_BACKGROUND_ID = '2025-qixi'

export function getCurrentBackground() {
  const saved = getStorage(STORAGE_KEYS.BACKGROUND)
  return saved || getDefaultBackground()
}

function getDefaultBackground() {
  return wallpaperList.find(w => w.id === DEFAULT_BACKGROUND_ID) || wallpaperList[0]
}

export function setBackground(background) {
  setStorage(STORAGE_KEYS.BACKGROUND, background)
  applyBackground(background)
}

export function applyBackground(background) {
  const body = document.body
  if (!body) return

  if (background.type === 'gradient') {
    applyGradientBackground(body)
  } else if (background.type === 'image' && background.value) {
    applyImageBackground(body, background.value)
  }
}

function applyGradientBackground(body) {
  body.style.backgroundImage = DEFAULT_GRADIENT
  body.style.backgroundSize = 'auto'
  body.style.backgroundPosition = 'center'
  body.style.backgroundRepeat = 'no-repeat'
  body.style.backgroundAttachment = 'fixed'
}

function applyImageBackground(body, imageUrl) {
  body.style.backgroundImage = `url(${imageUrl})`
  body.style.backgroundSize = 'cover'
  body.style.backgroundPosition = 'center'
  body.style.backgroundRepeat = 'no-repeat'
  body.style.backgroundAttachment = 'fixed'
}

export function initBackground() {
  const current = getCurrentBackground()
  applyBackground(current)
}

