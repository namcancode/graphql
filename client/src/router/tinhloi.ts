import { RouteConfig } from 'vue-router'
import { ROLE } from '@/interface/User'

const tinhloiRoutes: RouteConfig[] = [
  {
    path: 'tinhloi',
    name: 'tinhloi',
    component: () => import('@/pages/tinhloi/index.vue'),
    meta: {
      role: [ROLE.TINHLOI_RECRUITER]
    }
  },
  {
    path: 'tinhloi/telesale',
    name: 'tinhloiTelesale',
    component: () => import('@/pages/tinhloi/telesale.vue'),
    meta: {
      role: [ROLE.TINHLOI_TELESALE]
    }
  },
  {
    path: '/tinhloi/:historyId',
    name: 'tinhloiDetail',
    component: () => import('@/pages/tinhloi/detail.vue'),
    meta: {
      role: [ROLE.TINHLOI_TELESALE]
    }
  }
]

export default tinhloiRoutes
