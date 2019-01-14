import { RouteConfig } from 'vue-router'
import { ROLE } from '@/interface/User'
import { values } from 'lodash'

const role = values(ROLE)

const authRoutes: RouteConfig[] = [
  {
    path: 'me',
    name: 'me',
    component: () => import('@/pages/me.vue'),
    meta: { role }
  }
]

export default authRoutes
