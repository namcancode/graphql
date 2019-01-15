import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { USER_ROLE } from '@/interface/User'
import { checkRole } from '@/middleware/Auth'
import JavietController from '@/controller/operation/JavietController'

const router = new Router({
  prefix: '/javiet'
})

router.use(checkRole([USER_ROLE.JAVIET_RECRUITER, USER_ROLE.JAVIET_ADMIN]))
router.get('/export-data', JavietController.exportData)
router.get('/admin/list-recruiter', bodyParser(), JavietController.getListRecruiter)
router.post('/admin/list-applicant', bodyParser(), JavietController.getListHistoryToReport)
router.put('/admin/:historyId', bodyParser(), JavietController.updateRecruiter)

router.post('/list-applicant-recuiter', bodyParser(), JavietController.getListHistoryByRecuiterToReport)
router.post('/list-applicant', bodyParser(), JavietController.listApplicantHistory)
router.put('/update-history-status', bodyParser(), JavietController.updateApplicantHistoryStatus)
router.post('/reason-engage-stop', bodyParser(), JavietController.updateResonEngageStop)

router.get('/:historyId', JavietController.listEngage)
router.post('/:historyId', bodyParser(), JavietController.createEngage)
router.del('/:historyId/:engageId', JavietController.deleteEngage)
router.put('/:historyId/:engageId', bodyParser(), JavietController.updateEngage)

const javietRouter = router
export default javietRouter
