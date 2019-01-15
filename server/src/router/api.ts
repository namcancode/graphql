import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import HomeController from '@/controller/HomeController/HomeController'
import { checkAuthSession } from '@/middleware/Auth'
import AuthController from '@/controller/AuthController'
import adminRouter from '@/router/admin'
import tinhloiRouter from './tinhloi'
import javietRouter from './javiet'
import marketingRouter from './marketing'
import cronRouter from './cron'
import extensionRouter from './extension'

const router = new Router({
  prefix: '/v1'
})
router.use(cronRouter.routes())

router.get('/init', HomeController.init)

router.use(extensionRouter.routes())

router.post('/basic-login', bodyParser(), AuthController.login)

router.use(checkAuthSession)

router.put('/auth', bodyParser(), AuthController.update)
router.get('/logout', AuthController.logout)

router.use(adminRouter.routes())
router.use(marketingRouter.routes())
router.use(tinhloiRouter.routes())
router.use(javietRouter.routes())

export = router
