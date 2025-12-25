import { createRouter, createWebHashHistory } from 'vue-router'
import { ROUTES } from '../constants'
import Layout from '../components/Layout.vue'

const OnlineRecord = () => import('../views/OnlineRecord.vue')
const RecordList = () => import('../views/RecordList.vue')
const CharacterInfo = () => import('../views/CharacterInfo.vue')
const TradeRecord = () => import('../views/TradeRecord.vue')
const PWASettings = () => import('../components/PWASettings.vue')

const routes = [
  {
    path: ROUTES.HOME,
    component: Layout,
    redirect: ROUTES.ONLINE_RECORD,
    children: [
      {
        path: ROUTES.ONLINE_RECORD,
        name: 'OnlineRecord',
        component: OnlineRecord,
        meta: {
          title: '在线记录',
          subtitle: '记录游戏时光，统计在线数据'
        }
      },
      {
        path: ROUTES.RECORD_LIST,
        name: 'RecordList',
        component: RecordList,
        meta: {
          title: '记录列表',
          subtitle: '查看历史记录，分析游戏数据'
        }
      },
      {
        path: ROUTES.CHARACTER_INFO,
        name: 'CharacterInfo',
        component: CharacterInfo,
        meta: {
          title: '角色信息',
          subtitle: '管理角色属性，查看装备技能'
        }
      },
      {
        path: ROUTES.TRADE_RECORD,
        name: 'TradeRecord',
        component: TradeRecord,
        meta: {
          title: '交易记录',
          subtitle: '追踪交易历史，分析收益数据'
        }
      },
      {
        path: ROUTES.PWA_SETTINGS,
        name: 'PWASettings',
        component: PWASettings,
        meta: {
          title: '应用设置',
          subtitle: '管理PWA功能，手动安装选项'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
