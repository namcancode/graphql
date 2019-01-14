import { RouteConfig } from 'vue-router'
import { ROLE } from '@/interface/User'

const userRoutes: RouteConfig[] = [
  {
    path: 'user',
    name: 'listUser',
    component: () => import('@/pages/admin/user/index.vue'),
    meta: {
      role: [ROLE.ADMIN]
    }
  },
  {
    path: 'user/create',
    name: 'createUser',
    component: () => import('@/pages/admin/user/detail.vue'),
    meta: {
      role: [ROLE.ADMIN]
    }
  },
  {
    path: 'user/:id',
    name: 'updateUser',
    component: () => import('@/pages/admin/user/detail.vue'),
    meta: {
      role: [ROLE.ADMIN]
    }
  }
]

export default userRoutes
