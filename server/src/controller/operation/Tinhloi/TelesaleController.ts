import { Context } from 'koa'
import { isEmpty, map } from 'lodash'
import { startOfDay, endOfDay, format } from 'date-fns'
import TinhLoi from '@/model/ApplicantHistory/TinhLoi'
import { ITinhLoi } from '@/interface/ApplicantHistory/TinhLoi'
import { IApplicant, IApplicantDocument } from '@/interface/Applicant'
import Applicant from '@/model/Applicant'
import TinhLoiApplicantEngage from '@/model/ApplicantEngage/TinhLoi'
import User from '@/model/User'
import { USER_ROLE, COMPANY } from '@/interface/User'
import { APPLICANT_STATUS } from '@/interface/Applicant'
import { getUidFromFacebook } from '@/controller/marketing/MarketingApplicantController'
import { telesaleNeedMoreApplicant } from '@/controller/HomeController/ExtensionController'
import exportToExcel from '@/library/ExportToExcel'

interface listApplicantRequest {
  filter: {
    interviewDate: [Date, Date] | null
    offerStatus: string[] | null
    interviewStatus: string[] | null
    screeningStatus: string[] | null
    company: string[] | null
    search: string
    callBackTime: [Date, Date] | null
  }
  pagination: {
    limit: number
    page: number
  }
}

interface IEngageRequest extends ITinhLoi {
  engage: {
    callBackTime: Date
    callStatus: string
    note: string | undefined
  }
}
export default class TinhLoiController {
  static async list(ctx: Context) {
    const user = ctx.state.user
    let { filter, pagination } = ctx.request.body as listApplicantRequest
    const userAndFilter = { user, filter }

    const query: any = (await getQueryByFilter(userAndFilter)) || {}

    const options = {
      sort: {
        createdAt: -1
      },
      lean: true,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      populate: ['applicant', { path: 'listEngage', populate: { path: 'user' } }]
    }

    ctx.body = await TinhLoi.paginate(query, options)
  }

  static async update(ctx: Context) {
    const postData = ctx.request.body as IApplicantDocument

    await Applicant.updateOne({ _id: postData._id }, postData)
    ctx.body = 'OK'
  }

  static async createApplicant(ctx: Context) {
    const postData = ctx.request.body as IApplicant

    postData.status = APPLICANT_STATUS.IN_PROGRESS

    postData.uid = await getUidFromFacebook(postData.uid)

    const [applicant, telesale] = await Promise.all([await Applicant.create(postData), await telesaleNeedMoreApplicant()])

    await TinhLoi.create({ company: COMPANY.TINHLOI, applicantId: applicant._id, telesale })

    ctx.body = 'OK'
  }

  static async getListTelesale(ctx: Context) {
    const listTelesale = await User.find({ role: USER_ROLE.TINHLOI_TELESALE }).lean()
    ctx.body = map(listTelesale, 'username')
  }

  static async listEngage(ctx: Context) {
    const { historyId } = ctx.params
    const [listEngage, history] = await Promise.all([
      TinhLoiApplicantEngage.find({ historyId })
        .sort('createdAt')
        .populate('user')
        .lean(),
      TinhLoi.findById(historyId)
        .populate('applicant')
        .lean()
    ])

    ctx.body = { listEngage, applicant: history.applicant }
  }

  static async createEngage(ctx: Context) {
    const { historyId } = ctx.params
    const { engage } = ctx.request.body as IEngageRequest

    const newEngage = await TinhLoiApplicantEngage.create({ ...engage, historyId })

    await newEngage.populate('user').execPopulate()
    ctx.body = newEngage.toJSON({ virtuals: true })
  }

  static async updateEngage(ctx: Context) {
    const { engageId } = ctx.params
    const { engage } = ctx.request.body as IEngageRequest

    await TinhLoiApplicantEngage.updateOne({ _id: engageId }, engage)

    ctx.body = 'OK'
  }

  static async deleteEngage(ctx: Context) {
    const { engageId } = ctx.params

    await TinhLoiApplicantEngage.deleteOne({ _id: engageId })

    ctx.body = 'OK'
  }

  static async exportToExcel(ctx: Context) {
    const options = {
      status: {
        displayName:'Level',
        width: 70,
        cellStyle: { numFmt: '0' }
      },
      source: {
        displayName: 'Nguồn',
        width: 120
      },
      name: {
        displayName: 'Họ Và Tên',
        width: 140
      },
      gender: {
        displayName: 'Giới Tính',
        width: 70
      },
      birthday: {
        displayName: 'Ngày sinh',
        width: 120
      },
      identityNumber: {
        displayName: 'CMND',
        width: 120
      },
      phone: {
        displayName: 'Số điện thoại',
        width: 120
      },
      province: {
        displayName: 'Tỉnh',
        width: 120
      },
      telesale: {
        displayName: 'Người chăm sóc',
        width: 120
      },
      screeningStatus: {
        displayName: 'Duyệt hồ sơ',
        width: 120
      },
      interviewDate: {
        displayName: 'Ngày phỏng vấn',
        width: 135
      },
      interviewStatus: {
        displayName: 'Kết quả phỏng vấn',
        width: 170
      },
      offerStatus: {
        displayName: 'Kết quả Offer',
        width: 120
      },
      note: {
        displayName: 'Ghi chú',
        width: 350
      }
    }
    const user = ctx.state.user
    let { filter } = ctx.request.body as listApplicantRequest
    const userAndFilter = { user, filter }
    const data = await getDataToExport(userAndFilter)

    const report = exportToExcel('Telesale Applicant', data, options)
    ctx.response.attachment('report_Telesale_Applicant.xlsx')
    ctx.body = report
  }
}

export async function getQueryByFilter(params) {
  const applicantQuery = {} as any
  const engageQuery = {} as any
  const query = { company: params.user.company }

  if (params.filter.search) {
    applicantQuery.$or = [
      { phone: { $regex: new RegExp(`${params.filter.search}`, 'g') } },
      { identityNumber: { $regex: new RegExp(`${params.filter.search}`, 'g') } },
      { name: { $regex: new RegExp(`${params.filter.search}`, 'gi') } }
    ]

    const listApplicant = await Applicant.find(applicantQuery)
    const listApplicantId = map(listApplicant, '_id')
    query['applicantId'] = { $in: listApplicantId }
  }

  if (!isEmpty(params.filter.telesale)) {
    query['telesale'] = { $in: params.filter.telesale }
  }

  if (!isEmpty(params.filter.telesale)) {
    query['telesale'] = { $in: params.filter.telesale }
  }

  if (!isEmpty(params.filter.interviewStatus)) {
    query['interviewStatus'] = { $in: params.filter.interviewStatus }
  }

  if (!isEmpty(params.filter.offerStatus)) {
    query['offerStatus'] = { $in: params.filter.offerStatus }
  }

  if (!isEmpty(params.filter.screeningStatus)) {
    query['screeningStatus'] = { $in: params.filter.screeningStatus }
  }

  if (!isEmpty(params.filter.interviewDate)) {
    query['interviewDate'] = {
      $gte: startOfDay(params.filter.interviewDate[0]),
      $lte: endOfDay(params.filter.interviewDate[1])
    }
  }

  if (!isEmpty(params.filter.telesaleStatus)) {
    query['telesaleStatus'] = { $in: params.filter.telesaleStatus }
  }

  if (!isEmpty(params.filter.callBackTime)) {
    engageQuery['callBackTime'] = {
      $gte: startOfDay(params.filter.callBackTime[0]),
      $lte: endOfDay(params.filter.callBackTime[1])
    }
  }

  if (!isEmpty(params.filter.callStatus)) {
    engageQuery['callStatus'] = { $in: params.filter.callStatus }
  }

  if (!isEmpty(params.filter.createdAt)) {
    query['createdAt'] = {
      $gte: startOfDay(params.filter.createdAt[0]),
      $lte: endOfDay(params.filter.createdAt[1])
    }
  }

  if (params.filter.source) {
    if (params.filter.source === 'event') {
      applicantQuery.source = { $regex: new RegExp('event', 'g') }
    }
    if (params.filter.source === 'normal') {
      applicantQuery.source = { $not: new RegExp('event', 'g') }
    }
  }

  if (!isEmpty(engageQuery)) {
    const listEngage = await TinhLoiApplicantEngage.find(engageQuery)
    const listHistoryId = map(listEngage, 'historyId')

    query['_id'] = { $in: listHistoryId }
  }

  return query
}

async function getDataToExport(params) {
  const data = []
  const query: any = (await getQueryByFilter(params)) || {}
  const datas: any = await TinhLoi.find(query)
    .select({ screeningStatus: 1, interviewDate: 1, interviewStatus: 1, offerStatus: 1, _id: 1, status: 1, telesale: 1 })
    .populate({
      path: 'applicantId',
      model: 'Applicant',
      select: { _id: 1, name: 1, gender: 1, birthday: 1, identityNumber: 1, phone: 1, province: 1, source: 1, note: 1 }
    })
    .sort({
      createdAt: -1
    })
    .lean()

  if (!isEmpty(datas) && !isEmpty(datas[0].applicantId)) {
    datas.forEach(element => {
      data.push({
        status: element.status,
        source: element.applicantId.source,
        name: element.applicantId.name,
        gender: element.applicantId.gender,
        birthday: element.applicantId.birthday ? format(element.applicantId.birthday, 'dd/MM/yyyy') : '',
        identityNumber: element.applicantId.identityNumber,
        phone: element.applicantId.phone,
        province: element.applicantId.province,
        telesale: element.telesale,
        screeningStatus: element.screeningStatus,
        interviewDate: element.interviewDate ? format(element.interviewDate, 'dd/MM/yyyy') : '',
        interviewStatus: element.interviewStatus,
        offerStatus: element.offerStatus,
        note: element.applicantId.note
      })
    })
  }
  const result = data.map(item => {
    item.status === undefined ? (item.status = '') : item.status
    item.source === undefined ? (item.source = '') : item.source
    item.name === undefined ? (item.name = '') : (item.name = item.name.replace(/(^|\s)\S/g, l => l.toUpperCase()))
    item.gender === undefined ? (item.gender = '') : item.gender
    item.birthday === undefined ? (item.birthday = '') : item.birthday
    item.identityNumber === undefined ? (item.identityNumber = '') : item.identityNumber
    item.phone === undefined ? (item.phone = '') : item.phone
    item.province === undefined || item.province === 'chọn tỉnh đang sinh sống'
      ? (item.province = '')
      : (item.province = item.province.replace(/(^|\s)\S/g, l => l.toUpperCase()))
    item.telesale === undefined ? (item.telesale = '') : item.telesale
    item.screeningStatus === undefined ? (item.screeningStatus = '') : item.screeningStatus
    item.interviewDate === 'Invalid Date' ? (item.interviewDate = '') : item.interviewDate
    item.interviewStatus === undefined ? (item.interviewStatus = '') : item.interviewStatus
    item.offerStatus === undefined ? (item.offerStatus = '') : item.offerStatus
    item.note === undefined ? (item.note = '') : item.note
    return item
  })

  return result
}
