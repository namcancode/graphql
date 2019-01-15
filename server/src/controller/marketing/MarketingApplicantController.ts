import Facebook from '@/library/Facebook'
import { Context } from 'koa'
import { omit } from 'lodash'
import Applicant from '@/model/Applicant'
import ApplicantTag from '@/model/ApplicantTag'
import { IApplicant, APPLICANT_STATUS } from '@/interface/Applicant'
import { isEmpty } from 'lodash'
import { endOfDay } from 'date-fns'
import ApplicantHistory from '@/model/ApplicantHistory/ApplicantHistory'
import ApplicationError from '@/library/ApplicationError'
import { FANPAGE_TOKEN } from '@/config'

interface ApplicantRequest extends IApplicant {
  tags: object
  company: string
  fbLink: string
}
interface IListApplicantRequest {
  pagination: {
    page: number
    limit: number
  }
  filter: {
    province: string[]
    source_id: string[]
    gender: string[]
    status: string[]
    name: string[]
    dateRange: [Date, Date]
  }
}
export default class MarketingApplicantController {
  static async listApplicant(ctx: Context) {
    const { pagination, filter } = ctx.request.body as IListApplicantRequest
    const page = pagination.page || 1
    const limit = pagination.limit || 20
    const query: any = getQueryByFilter(filter) || {}
    const options = { sort: '-createdAt', lean: true, page, limit }

    ctx.body = await Applicant.paginate(query, options)
  }

  static async getApplicant(ctx: Context) {
    const { id } = ctx.params

    const applicant = await Applicant.findById(id).lean()
    applicant['fbLink'] = `https://www.facebook.com/${applicant.uid}`

    const [applicantTag, applicantHistory] = await Promise.all([
      ApplicantTag.findOne({ applicantUid: applicant.uid }).lean(),
      ApplicantHistory.findOne({ applicantId: id }).lean()
    ])

    if (!applicant) {
      throw new ApplicationError('Không tìm thấy ứng viên', 404)
    }

    ctx.body = {
      ...applicant,
      tags: applicantTag ? omit(applicantTag, ['_id', '__v', 'applicantUid']) : {},
      applicantHistory
    }
  }

  static async create(ctx: Context) {
    const postData = ctx.request.body as ApplicantRequest
    const tags = postData.tags || {}
    const uid: string = await getUidFromFacebook(postData.fbLink || '')
    const checkApplicant = await Applicant.findOne({ uid }).lean()

    if (checkApplicant) throw new ApplicationError('Ứng viên đã tồn tại trong hệ thống', 400)
    if (!uid) throw new ApplicationError('Link Facebook không đúng', 400)

    postData.status = APPLICANT_STATUS.AVAILABLE
    postData.uid = tags['applicantUid'] = uid || ''
    postData['yearOfBirth'] = new Date(postData.yearOfBirth).getFullYear() || 0

    const [applicant, tag] = await Promise.all([Applicant.create(postData), ApplicantTag.create(tags)])
    if (postData.company) {
      await Promise.all([createApplicantHistory(applicant._id, postData.company), applicant.update({ status: APPLICANT_STATUS.IN_PROGRESS })])
    }

    ctx.body = 'OK'
  }

  static async update(ctx: Context) {
    const { id } = ctx.params
    const postData = ctx.request.body as ApplicantRequest
    const tags = postData.tags || {}
    const uid: string = await getUidFromFacebook(postData.fbLink || '')

    if (!uid) throw new ApplicationError('Link Facebook không đúng', 400)

    postData.uid = tags['applicantUid'] = uid || ''
    postData['yearOfBirth'] = new Date(postData.yearOfBirth).getFullYear() || 0

    await Promise.all([
      Applicant.updateOne({ _id: id }, postData),
      ApplicantTag.update({ applicantUid: uid }, tags, { overwrite: true, upsert: true, setDefaultsOnInsert: true }),
      ApplicantHistory.update({ applicantId: id }, { company: postData.company, applicantId: id }, { overwrite: true, setDefaultsOnInsert: true, upsert: true })
    ])

    ctx.body = 'OK'
  }

  static async delete(ctx: Context) {
    const { id } = ctx.params

    const applicant = await Applicant.findById(id)
    applicant.remove()
    // mongoose remove hook must do that way

    ctx.body = { sucess: true }
  }
}

async function createApplicantHistory(applicantId, company): Promise<any> {
  if (!company) {
    return
  }

  const data = { applicantId, company }

  if (await ApplicantHistory.findOne(data)) {
    return
  }

  return await ApplicantHistory.create(data)
}

function getQueryByFilter(params) {
  let query = {}

  if (params.name) {
    query = {
      $or: [
        { phone: { $regex: new RegExp(`${params.name}`, 'g') } },
        { identityNumber: { $regex: new RegExp(`${params.name}`, 'g') } },
        { name: { $regex: new RegExp(`${params.name}`, 'gi') } }
      ]
    }
  }
  if (!isEmpty(params.dateRange)) {
    query['createdAt'] = {
      $gte: new Date(params.dateRange[0]),
      $lte: endOfDay(params.dateRange[1])
    }
  }
  if (!isEmpty(params.source_id)) {
    query['source'] = { $in: params.source_id }
  }

  if (!isEmpty(params.province)) {
    query['province'] = { $in: params.province }
  }

  if (!isEmpty(params.gender)) {
    query['gender'] = { $in: params.gender }
  }

  if (!isEmpty(params.status)) {
    query['status'] = { $in: params.status }
  }

  return query
}

export async function getUidFromFacebook(fbLink: string) {
  if (!fbLink) return
  const facebook = new Facebook(FANPAGE_TOKEN)
  const regex = /profile\.php\?id=(\d+)/.exec(fbLink)
  const link = fbLink.match(/https?\:\/\/(?:www\.)?facebook\.com\/(\d+|[A-Za-z0-9\.]+)\/?/) || ''
  const username = regex ? regex[1] : link[1]

  if (!username) return ''
  const rs: any = await facebook.graph(username + '?fields=id')

  return rs.data.id || ''
}
