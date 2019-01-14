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
  }
]

export default tinhloiRoutes
