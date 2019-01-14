import { map, shuffle, pullAllBy, union, orderBy, isEmpty } from 'lodash'
import { startOfDay, endOfDay } from 'date-fns'
import TinhLoi from '@/model/ApplicantHistory/TinhLoi'
import { ITinhLoi } from '@/interface/ApplicantHistory/TinhLoi'
import { IApplicant, IApplicantDocument } from '@/interface/Applicant'
import Applicant from '@/model/Applicant'
import TinhLoiApplicantEngage from '@/model/ApplicantEngage/TinhLoi'
import User from '@/model/User'
import { USER_ROLE, COMPANY } from '@/interface/User'
import { APPLICANT_STATUS } from '@/interface/Applicant'
import getUidFromFacebook from '@/library/Facebook'

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

export const tinhloiTelesaleQuery = {
  list(root, { filter, pagination, ctx }) {
    const options = { sort: '-createdAt', lean: true, ...pagination }
    return TinhLoi.paginate({ ...filter }, options)
  }
}

export const tinhloiTelesaleMutation = {}
/*
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
}
*/

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
  }

  if (params.filter.source) {
    if (params.filter.source === 'event') {
      applicantQuery.source = { $regex: new RegExp('event', 'g') }
    }
    if (params.filter.source === 'normal') {
      applicantQuery.source = { $not: new RegExp('event', 'g') }
    }
  }

  const listApplicant = await Applicant.find(applicantQuery)
  const listApplicantId = map(listApplicant, '_id')
  query['applicantId'] = { $in: listApplicantId }

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

  if (!isEmpty(engageQuery)) {
    const listEngage = await TinhLoiApplicantEngage.find(engageQuery)
    const listHistoryId = map(listEngage, 'historyId')

    query['_id'] = { $in: listHistoryId }
  }

  return query
}

export async function telesaleNeedMoreApplicant() {
  const listUserTinhLoi = await User.find({ role: USER_ROLE.TINHLOI_TELESALE }).lean()

  const listNameUserTelelesale = map(listUserTinhLoi, 'username')

  const shuffleUserTelesale = shuffle(listNameUserTelelesale)

  const initData = await TinhLoi.aggregate([{ $match: { telesaleStatus: { $ne: 'Dừng chăm sóc' } } }, { $group: { _id: '$telesale', count: { $sum: 1 } } }])

  const removeEmpty = pullAllBy(initData, [{ _id: '' }, { _id: null }], '_id')

  const sortTelesaleDesc = orderBy(removeEmpty, 'count', 'desc')

  const listNameTelelesale = map(sortTelesaleDesc, '_id')

  const listTelesaleNeedMore = union(listNameTelelesale, shuffleUserTelesale)

  return listTelesaleNeedMore[listTelesaleNeedMore.length - 1]
}
