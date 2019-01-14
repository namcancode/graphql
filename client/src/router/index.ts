import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import userRoutes from '@/router/user'
import { concat } from 'lodash'
import marketingRoutes from '@/router/marketing'
import authRoutes from './auth'
import defaultLayout from '@/components/Layout/Default.vue'
import tinhloiRoutes from './tinhloi'
import javietRoutes from './javiet'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: () => import('@/pages/login.vue') },
    { path: '/404', name: 'notFound', component: () => import('@/pages/notFound.vue') },
    { path: '/', name: 'home', component: () => import('@/pages/home.vue') },
    {
      path: '',
      component: defaultLayout,
      children: concat(userRoutes, marketingRoutes, tinhloiRoutes, javietRoutes, authRoutes, [{ path: '*', redirect: '/404' }])
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!from.name) {
    await store.dispatch('init')
  }

  const role = to.meta.role
  if (role && role.indexOf(store.state.user.role) === -1) {
    router.push({ name: 'home' })
  }

  next()
})

export default router
