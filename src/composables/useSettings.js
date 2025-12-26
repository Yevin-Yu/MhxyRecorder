import { ref, watch } from 'vue'
import { getStorage, setStorage } from '../utils/storage'
import { STORAGE_KEYS, DEFAULT_CONFIG } from '../constants'

/**
 * 设置数据管理（在线角色数、点卡价格）
 */
export function useSettings() {
  const saved = getStorage(STORAGE_KEYS.CURRENT_SET_DATA)
  const currentSetData = ref({
    onlineAccounts: saved?.onlineAccounts ?? DEFAULT_CONFIG.ONLINE_ACCOUNTS,
    cardPrice: saved?.cardPrice ?? DEFAULT_CONFIG.CARD_PRICE
  })

  watch(currentSetData, (newVal) => {
    setStorage(STORAGE_KEYS.CURRENT_SET_DATA, newVal)
  }, { deep: true })

  return {
    currentSetData
  }
}

