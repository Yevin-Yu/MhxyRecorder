/**
 * LocalStorage 工具函数
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`读取存储失败 [${key}]:`, error)
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`保存存储失败 [${key}]:`, error)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`删除存储失败 [${key}]:`, error)
  }
}

export function clearStorage() {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

