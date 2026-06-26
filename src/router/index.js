import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

const OnlineRecord = () => import('../views/OnlineRecord.vue')
const RecordList = () => import('../views/RecordList.vue')
const TradeRecord = () => import('../views/TradeRecord.vue')
const PlaceholderPage = () => import('../components/PlaceholderPage.vue')

const DEFAULT_TITLE = '梦幻西游工具箱'
const BASE_URL = 'https://yuwb.dev/xyq'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'OnlineRecord',
        component: OnlineRecord,
        alias: 'online-record',
        meta: {
          title: '收益记录',
          description: '记录梦幻西游在线收益，统计点卡消耗与梦幻币收入，支持按日期查看与导出。',
          path: '/'
        }
      },
      {
        path: 'record-list',
        name: 'RecordList',
        component: RecordList,
        meta: {
          title: '历史记录',
          description: '查看梦幻西游历史收益记录，按日期筛选在线时长与物品获取明细。',
          path: '/record-list'
        }
      },
      {
        path: 'trade-record',
        name: 'TradeRecord',
        component: TradeRecord,
        meta: {
          title: '交易记录',
          description: '记录梦幻西游交易明细，双币种支持，日期筛选与数据导出。',
          path: '/trade-record'
        }
      },
      {
        path: 'character-record',
        name: 'CharacterRecord',
        component: PlaceholderPage,
        props: { title: '角色记录' },
        meta: {
          title: '角色记录',
          description: '梦幻西游角色信息记录与管理。',
          path: '/character-record'
        }
      },
      {
        path: 'growth-record',
        name: 'GrowthRecord',
        component: PlaceholderPage,
        props: { title: '养成记录' },
        meta: {
          title: '养成记录',
          description: '记录梦幻西游角色养成进度与资源消耗。',
          path: '/growth-record'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/xyq/'),
  routes,
})

// ponytail: direct DOM manipulation over adding @unhead/vue dependency
function updateMeta({ title, description, path }) {
  const fullTitle = title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE
  document.title = fullTitle

  setMeta('description', description)
  setMeta('og:title', fullTitle)
  setMeta('og:description', description)
  setMeta('og:url', `${BASE_URL}${path || '/'}`)
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', description)
}

function setMeta(name, content) {
  const attr = name.startsWith('og:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  updateMeta(to.meta)
})

export default router
