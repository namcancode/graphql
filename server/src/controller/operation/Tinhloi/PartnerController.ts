import { Context } from 'koa'
import { isEmpty, map } from 'lodash'
import TinhLoi from '@/model/ApplicantHistory/TinhLoi'
import { getApplicantStatusFromApplicantHistory, ITinhLoi, INTERVIEW_STATUS, OFFER_STATUS } from '@/interface/ApplicantHistory/TinhLoi'
import Applicant from '@/model/Applicant'
import exportToExcel from '@/library/ExportToExcel'
import { startOfDay, endOfDay, format } from 'date-fns'

interface listApplicantRequest {
  filter: {
    interviewDate: [Date, Date] | null
    offerStatus: string[] | null
    interviewStatus: string[] | null
    screeningStatus: string[] | null
    company: string[] | null
    search: string
  }
  pagination: {
    limit: number
    page: number
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
      populate: 'applicant'
    }

    ctx.body = await TinhLoi.paginate(query, options)
  }

  static async update(ctx: Context) {
    const { historyId } = ctx.params
    const postData = ctx.request.body as ITinhLoi

    if (postData.interviewStatus === INTERVIEW_STATUS.PASS || postData.interviewStatus === INTERVIEW_STATUS.REJECT) postData.status = 7

    if (postData.offerStatus === OFFER_STATUS.ACCEPT) postData.status = 8

    await TinhLoi.updateOne({ _id: historyId }, postData)

    const history = await TinhLoi.findById(historyId)

    const applicantStatus = getApplicantStatusFromApplicantHistory(history)

    Applicant.updateOne({ _id: history.applicantId }, { status: applicantStatus }).exec()

    ctx.body = 'OK'
  }

  static async exportToExcel(ctx: Context) {
    const options = {
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
    const data = await getDataToExport(user)

    const report = exportToExcel('Operation Applicant', data, options)
    ctx.response.attachment('report_Operation_Applicant.xlsx')
    ctx.body = report
  }
}

export async function getQueryByFilter(params) {
  const applicantQuery = {} as any

  if (params.filter.search) {
    applicantQuery.$or = [
      { phone: { $regex: new RegExp(`${params.filter.search}`, 'g') } },
      { identityNumber: { $regex: new RegExp(`${params.filter.search}`, 'g') } },
      { name: { $regex: new RegExp(`${params.filter.search}`, 'gi') } }
    ]
  }

  const listApplicant = await Applicant.find(applicantQuery)
  const listApplicantId = map(listApplicant, '_id')

  const query = { company: params.user.company, applicantId: { $in: listApplicantId } }

  query['status'] = { $gte: 6 }

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

  return query
}

async function getDataToExport(params) {
  const data = []
  const query = { company: params.company, status: { $gte: 6 } }
  const datas: any = await TinhLoi.find(query)
    .select({ screeningStatus: 1, interviewDate: 1, interviewStatus: 1, offerStatus: 1, note: 1, _id: 1 })
    .populate({
      path: 'applicantId',
      model: 'Applicant',
      select: { _id: 1, name: 1, gender: 1, birthday: 1, identityNumber: 1, phone: 1, province: 1 }
    })
    .sort({
      screeningStatus: 1,
      interviewDate: 1
    })
    .lean()

  if (!isEmpty(datas) && !isEmpty(datas[0].applicantId)) {
    datas.forEach(element => {
      data.push({
        name: element.applicantId.name,
        gender: element.applicantId.gender,
        birthday: element.applicantId.birthday,
        identityNumber: element.applicantId.identityNumber,
        phone: element.applicantId.phone,
        province: element.applicantId.province,
        screeningStatus: element.screeningStatus,
        interviewDate: element.interviewDate ? format(element.interviewDate, 'dd/MM/yyyy') : '',
        interviewStatus: element.interviewStatus,
        offerStatus: element.offerStatus,
        note: element.note
      })
    })
  }
  const result = data.map(item => {
    item.name === undefined ? (item.name = '') : (item.name = item.name.replace(/(^|\s)\S/g, l => l.toUpperCase()))
    item.gender === undefined ? (item.gender = '') : item.gender
    item.birthday === undefined ? (item.birthday = '') : item.birthday
    item.identityNumber === undefined ? (item.identityNumber = '') : item.identityNumber
    item.phone === undefined ? (item.phone = '') : item.phone
    item.province === undefined || item.province === 'chọn tỉnh đang sinh sống'
      ? (item.province = '')
      : (item.province = item.province.replace(/(^|\s)\S/g, l => l.toUpperCase()))
    item.screeningStatus === undefined ? (item.screeningStatus = '') : item.screeningStatus
    item.interviewDate === 'Invalid Date' ? (item.interviewDate = '') : item.interviewDate
    item.interviewStatus === undefined ? (item.interviewStatus = '') : item.interviewStatus
    item.offerStatus === undefined ? (item.offerStatus = '') : item.offerStatus
    item.note === undefined ? (item.note = '') : item.note
    return item
  })

  return result
}
