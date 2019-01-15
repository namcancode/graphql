import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { USER_ROLE } from '@/interface/User'
import { checkRole } from '@/middleware/Auth'
import MarketingController from '@/controller/marketing/MarketingController'
import MarketingApplicantController from '@/controller/marketing/MarketingApplicantController'
import MarketingReportController from '@/controller/marketing/MarketingReportController'

const router = new Router({
  prefix: '/marketing'
})

router.use(checkRole(USER_ROLE.MARKETER))

// Mareketing
router.get('/list-source', MarketingController.listSource)

router.post('/list-applicant', bodyParser(), MarketingApplicantController.listApplicant)
router.post('/applicant', bodyParser(), MarketingApplicantController.create)
router.get('/applicant/:id', MarketingApplicantController.getApplicant)
router.put('/applicant/:id', bodyParser(), MarketingApplicantController.update)
router.del('/applicant/:id', bodyParser(), MarketingApplicantController.delete)

router.post('/report/overview', bodyParser(), MarketingReportController.overview)
router.post('/report/lead', bodyParser(), MarketingReportController.lead)
router.post('/report/source', bodyParser(), MarketingReportController.source)

const marketingRouter = router
export default marketingRouter
