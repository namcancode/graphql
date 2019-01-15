import * as Router from 'koa-router'
import CronController from '@/controller/HomeController/CronController'

const router = new Router({
  prefix: '/cron'
})

router.get('/import-applicant-airtable', CronController.importApplicantFromAirtableToTinhloi)
router.get('/update-status-applicant', CronController.updateMasofferStatusToAirtableTinhloi)
router.get('/import-tinhloi-event-typeform', CronController.tinhloiImportFromAirtableTypeform)

const cronRouter = router
export default cronRouter
