import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import ExtensionController from '@/controller/HomeController/ExtensionController';

const router = new Router({
    prefix: '/extension'
  })



router.get('/applicant/:uid', ExtensionController.getApplicantByUID)
router.post('/applicant/:uid', bodyParser(), ExtensionController.updateApplicantByUID)
router.post('/applicant-tags/:uid', bodyParser(), ExtensionController.updateApplicantTagsByUID)
router.post('/applicant-history/:uid', bodyParser(), ExtensionController.createApplicantHistory)


const extensionRouter = router
export default extensionRouter