import { ref, watch } from 'vue'
import { getStorage, setStorage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

/**
 * 当日数据管理
 */
export function useTodayData() {
  const today = new Date().toLocaleDateString()
  const saved = getStorage(STORAGE_KEYS.TODAYS_DATA)
  const todaysData = ref(saved && saved.date === today ? saved : {
    date: today,
    onlineTime: 0,
    cardCost: 0,
    todaysIncome: 0,
    todaysBalance: 0,
    loadList: [],
    onlineList: [],
  })

  const saveToAllData = () => {
    const allData = getStorage(STORAGE_KEYS.ALL_DATA, [])
    const index = allData.findIndex(item => item.date === todaysData.value.date)
    
    if (index !== -1) {
      allData[index] = todaysData.value
    } else {
      allData.unshift(todaysData.value)
    }
    
    setStorage(STORAGE_KEYS.ALL_DATA, allData)
  }

  watch(todaysData, () => {
    setStorage(STORAGE_KEYS.TODAYS_DATA, todaysData.value)
    saveToAllData()
  }, { deep: true })

  const addOnlineRecord = (record) => {
    todaysData.value.onlineList.unshift(record)
    todaysData.value.onlineTime += record.time
    todaysData.value.cardCost += record.cardCost
    todaysData.value.todaysBalance = todaysData.value.todaysIncome - todaysData.value.cardCost
  }

  const updateIncome = (income) => {
    todaysData.value.todaysIncome = income
    todaysData.value.todaysBalance = income - todaysData.value.cardCost
  }

  return {
    todaysData,
    addOnlineRecord,
    updateIncome
  }
}

