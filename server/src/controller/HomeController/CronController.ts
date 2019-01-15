import * as Raven from 'raven'
import Airtable from '@/library/Airtable'
import { getUidFromFacebook } from '../marketing/MarketingApplicantController'
import { APPLICANT_STATUS, IApplicant } from '@/interface/Applicant'
import Applicant from '@/model/Applicant'
import { COMPANY } from '@/interface/User'
import TinhLoi from '@/model/ApplicantHistory/TinhLoi'
import { telesaleNeedMoreApplicant } from './ExtensionController'
import { getListMessageFromError } from '@/middleware/Error'
import { Context } from 'koa'
import { AIRTABLE_KEY, MASOFFER_AIRTALBE_BASE } from '@/config'
import { INTERVIEW_STATUS, TELESALE_STATUS, ITinhLoi } from '@/interface/ApplicantHistory/TinhLoi'

const airtable = new Airtable({ apiKey: AIRTABLE_KEY, base: MASOFFER_AIRTALBE_BASE, table: 'Table 5 (18 - 23/12) (Active)' })
export default class CronController {
  static async importApplicantFromAirtableToTinhloi(ctx: Context) {
    airtable.findByByFormula('AutoImportCRM="Ready"').on('page', (listRecord: AirtableRecord[]) => {
      listRecord.forEach(async record => {
        if (!record.fields['Số điện thoại']) return rejectApplicant(record, 'Chưa có số điện thoại')

        const applicant: IApplicant = {
          name: record.get('Họ tên'),
          phone: record.get('Số điện thoại'),
          gender: record.get('Giới tính') === 'Nữ' ? 'nữ' : 'nam',
          birthday: record.get('Ngày sinh'),
          province: record.get('Tỉnh'),
          uid: await getUidFromFacebook(record.get('Facebook + Vấn đề quan tâm')),
          status: APPLICANT_STATUS.IN_PROGRESS,
          source: 'masoffer_event',
          note: record.get('Location') || '',
          identityNumber: record.get('CMND/CCCD') || ''
        }

        try {
          // const applicantDB = await Applicant.findOne({ phone: applicant.phone })
          // if (applicantDB) {
          //   return rejectApplicant(record, 'Ứng viên đã có trong hệ thống.')
          // }

          const applicantDoc = await Applicant.create(applicant)

          const telesale = await getTelesale(record)
          await TinhLoi.create({ applicantId: applicantDoc._id, company: COMPANY.TINHLOI, status: 3, telesale })
          record.patchUpdate({
            AutoImportCRM: 'Success'
          })
        } catch (error) {
          process.env.PRODUCTION ? Raven.captureException(error) : console.log(error)
          rejectApplicant(record, getListMessageFromError(error))
        }
      })
    })

    ctx.body = 'OK'
  }

  static async updateMasofferStatusToAirtableTinhloi(ctx: Context) {
    airtable.findByByFormula('AutoImportCRM="Success"').on('page', (listRecord: AirtableRecord[]) => {
      listRecord.forEach(async record => {
        const phone = record.get('Số điện thoại')

        try {
          const applicantDB = await Applicant.findOne({ phone }).lean()
          if (!applicantDB) return
          const historyDB = await TinhLoi.findOne({ applicantId: applicantDB._id }).lean()

          if (historyDB.interviewStatus === INTERVIEW_STATUS.PASS || historyDB.interviewStatus === INTERVIEW_STATUS.REJECT) {
            return record.patchUpdate({ 'Trạng thái': 'Success' })
          }

          if (historyDB.telesaleStatus === TELESALE_STATUS.STOP || historyDB.telesaleStatus === TELESALE_STATUS.OUTOFTARGET) {
            return record.patchUpdate({ 'Trạng thái': 'Fail' })
          }

          return record.patchUpdate({ 'Trạng thái': 'Pending' })
        } catch (error) {
          process.env.PRODUCTION ? Raven.captureException(error) : console.log(error)
        }
      })
    })
    ctx.body = 'update ok'
  }

  static async tinhloiImportFromAirtableTypeform(ctx: Context) {
    const airtable = new Airtable({ apiKey: AIRTABLE_KEY, base: 'applh8JJmt0L91k1O', table: 'main' })

    airtable.findByByFormula('importCRM=FALSE()').on('page', (listApplicant: AirtableRecord[]) => {
      listApplicant.forEach(async applicant => {
        const note = 'sn: ' + applicant.get('Năm sinh') + ',\n' + applicant.get('Ngày tham gia') + ',\n' + applicant.get('Tay nghề may')
        const data: IApplicant = {
          name: applicant.get('Họ và tên'),
          yearOfBirth: applicant.get('Năm sinh'),
          phone: '0' + applicant.get('Số điện thoại'),
          source: 'tf_event',
          note,
          status: APPLICANT_STATUS.IN_PROGRESS,
          uid: ''
        }
        try {
          const applicantDoc = await Applicant.create(data)
          await TinhLoi.create({ applicantId: applicantDoc._id, company: COMPANY.TINHLOI, status: 3, telesale: await telesaleNeedMoreApplicant() })

          applicant.patchUpdate({ importCRM: true })
        } catch (err) {
          const listMessage = getListMessageFromError(err)
          applicant.patchUpdate({ Note: listMessage.join('\n') })
        }
      })
    })
    ctx.body = 'OK'
  }
}

async function getTelesale(record: AirtableRecord) {
  let telesale = (record.fields['Last Operator'] as string) || ''
  if (telesale === 'Hà') return 'haptt'
  if (telesale === 'Huệ') return 'huent'
  return await telesaleNeedMoreApplicant()
}

function rejectApplicant(record: AirtableRecord, listReason: string[] | string) {
  if (typeof listReason === 'string') {
    listReason = [listReason]
  }
  const note = record.get('Ghi chú iHR') || ''
  record.patchUpdate({
    AutoImportCRM: 'Fail',
    'Ghi chú iHR': note + '\n' + listReason.join('\n')
  })
}
