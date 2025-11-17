import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import OnlineRecord from '../views/OnlineRecord.vue'
import RecordList from '../views/RecordList.vue'
import CharacterInfo from '../views/CharacterInfo.vue'
import TradeRecord from '../views/TradeRecord.vue'
import PWASettings from '../components/PWASettings.vue'


const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/online-record',
    children: [
      {
        path: '/online-record',
        name: 'OnlineRecord',
        component: OnlineRecord,
        meta: { 
          title: '在线记录',
          subtitle: '记录游戏时光，统计在线数据'
        }
      },
      {
        path: '/record-list',
        name: 'RecordList',
        component: RecordList,
        meta: { 
          title: '记录列表',
          subtitle: '查看历史记录，分析游戏数据'
        }
      },
      {
        path: '/character-info',
        name: 'CharacterInfo',
        component: CharacterInfo,
        meta: { 
          title: '角色信息',
          subtitle: '管理角色属性，查看装备技能'
        }
      },
      {
        path: '/trade-record',
        name: 'TradeRecord',
        component: TradeRecord,
        meta: { 
          title: '交易记录',
          subtitle: '追踪交易历史，分析收益数据'
        }
      },
      {
        path: '/pwa-settings',
        name: 'PWASettings',
        component: PWASettings,
        meta: { 
          title: '应用设置',
          subtitle: '管理PWA功能，手动安装选项'
        }
      }
    ]
  },
]

const router = createRouter({
  // 哈希模式
  history: createWebHashHistory(),
  routes
})

export default router
