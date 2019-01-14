import { RouteConfig } from 'vue-router'
import { ROLE } from '@/interface/User'

const marketingRoutes: RouteConfig[] = [
  {
    path: 'marketing/report',
    name: 'marketingReport',
    component: () => import('@/pages/marketing/report.vue'),
    meta: {
      role: [ROLE.MARKETER]
    }
  },
  {
    path: 'marketing/applicant',
    name: 'marketingListApplicant',
    component: () => import('@/pages/marketing/applicant/index.vue'),
    meta: {
      role: [ROLE.MARKETER]
    }
  },
  {
    path: 'marketing/applicant/create',
    name: 'marketingCreateApplicant',
    component: () => import('@/pages/marketing/applicant/detail.vue'),
    meta: {
      role: [ROLE.MARKETER]
    }
  },
  {
    path: 'marketing/applicant/:id',
    name: 'marketingUpdateApplicant',
    component: () => import('@/pages/marketing/applicant/detail.vue'),
    meta: {
      role: [ROLE.MARKETER]
    }
  }
]

export default marketingRoutes
