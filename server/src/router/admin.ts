import * as Router from 'koa-router'
import UserController from '@/controller/admin/UserController'
import * as bodyParser from 'koa-bodyparser'
import { USER_ROLE } from '@/interface/User'
import { checkRole } from '@/middleware/Auth'

const router = new Router({
  prefix: '/admin'
})

router.use(checkRole(USER_ROLE.ADMIN))

// User
router.get('/user/:id', UserController.getUser)
router.post('/user', bodyParser(), UserController.create)
router.post('/list-user', bodyParser(), UserController.listUser)
router.put('/user/:id', bodyParser(), UserController.update)
router.del('/user/:id', UserController.delete)
router.get('/login-as/:userId', UserController.loginAs)

export default router
