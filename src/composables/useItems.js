import { ref, watch } from 'vue'
import { getStorage, setStorage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'

/**
 * 物品数据管理
 */
const DEFAULT_ITEMS = [
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

const UNSET_ITEMS = [
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
]

export function useItems() {
  const saved = getStorage(STORAGE_KEYS.ITEMS_DATA, DEFAULT_ITEMS)
  const itemsData = ref(Array.isArray(saved) ? saved : [...DEFAULT_ITEMS])
  const unsetItemsData = ref([...UNSET_ITEMS])
  const totalItemsData = ref([...itemsData.value, ...UNSET_ITEMS])

  const getItemById = (id) => {
    return totalItemsData.value.find(item => item.id === id)
  }

  watch(itemsData, (newVal) => {
    setStorage(STORAGE_KEYS.ITEMS_DATA, newVal)
    totalItemsData.value = [...newVal, ...UNSET_ITEMS]
  }, { deep: true })

  return {
    itemsData,
    unsetItemsData,
    totalItemsData,
    getItemById
  }
}

