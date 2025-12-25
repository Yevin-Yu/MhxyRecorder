/**
 * 格式化工具函数
 */

export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString()
}

export function formatHours(hours) {
  if (hours === null || hours === undefined) return '0.00'
  return Number(hours).toFixed(2)
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateTime(date) {
  if (!date) return ''
  const d = new Date(date)
  const dateStr = formatDate(d)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${dateStr} ${hours}:${minutes}:${seconds}`
}

