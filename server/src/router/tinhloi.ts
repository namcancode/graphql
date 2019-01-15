import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { USER_ROLE } from '@/interface/User'
import { checkRole } from '@/middleware/Auth'
import RecuiterController from '@/controller/operation/Tinhloi/PartnerController'
import TelesaleController from '@/controller/operation/Tinhloi/TelesaleController'

const router = new Router({
  prefix: '/tinhloi'
})

router.use(checkRole([USER_ROLE.TINHLOI_RECRUITER, USER_ROLE.TINHLOI_TELESALE]))

router.get('/export', RecuiterController.exportToExcel)
router.post('/list-applicant', bodyParser(), RecuiterController.list)
router.post('/list-applicant-telesale', bodyParser(), TelesaleController.list)
router.get('/list-telesale', bodyParser(), TelesaleController.getListTelesale)
router.put('/applicant', bodyParser(), TelesaleController.update)
router.post('/applicant', bodyParser(), TelesaleController.createApplicant)
router.put('/:historyId', bodyParser(), RecuiterController.update)

router.get('/:historyId', TelesaleController.listEngage)
router.post('/export-telesale', bodyParser(), TelesaleController.exportToExcel)
router.post('/:historyId', bodyParser(), TelesaleController.createEngage)
router.del('/:historyId/:engageId', TelesaleController.deleteEngage)
router.put('/:historyId/:engageId', bodyParser(), TelesaleController.updateEngage)

const tinhloiRouter = router
export default tinhloiRouter
