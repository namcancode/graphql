import { RouteConfig } from 'vue-router'
import { ROLE } from '@/interface/User'

const javietRoutes: RouteConfig[] = [
  {
    path: 'javiet/admin',
    name: 'javietAdmin',
    component: () => import('@/pages/javiet/admin.vue'),
    meta: {
      role: [ROLE.JAVIET_ADMIN]
    }
  },
  {
    path: 'javiet/report',
    name: 'javietAdminReport',
    component: () => import('@/pages/javiet/adminReport.vue'),
    meta: {
      role: [ROLE.JAVIET_ADMIN]
    }
  },
  {
    path: 'javiet',
    name: 'javiet',
    component: () => import('@/pages/javiet/index.vue'),
    meta: {
      role: [ROLE.JAVIET_RECRUITER]
    }
  },
  {
    path: 'javiet/recuiter-report',
    name: 'javietRecuiterReport',
    component: () => import('@/pages/javiet/recuiterReport.vue'),
    meta: {
      role: [ROLE.JAVIET_RECRUITER]
    }
  },
  {
    path: '/javiet/:historyId',
    name: 'javietDetail',
    component: () => import('@/pages/javiet/detail.vue'),
    meta: {
      role: [ROLE.JAVIET_RECRUITER]
    }
  }
]

export default javietRoutes
