import { Context } from 'koa'
import { APPLICANT_STATUS } from '@/interface/Applicant'
import Applicant from '@/model/Applicant'
import TinhLoi from '@/model/ApplicantHistory/TinhLoi'
import ApplicantTag from '@/model/ApplicantTag'
import ApplicationError from '@/library/ApplicationError'
import Javiet from '@/model/ApplicantHistory/Javiet'
import ApplicantHistory from '@/model/ApplicantHistory/ApplicantHistory'
import { COMPANY } from '@/interface/User'
import { map, shuffle, pullAllBy, union, orderBy } from 'lodash'
import User from '@/model/User'
import { USER_ROLE } from '@/interface/User'

export default class ExtensionController {
  static async getApplicantByUID(ctx: Context) {
    const { uid } = ctx.params
    const applicant = (await Applicant.findOne({ uid })) || { id: null }
    const listHistory = await ApplicantHistory.find({ applicantId: applicant.id })
      .populate('listEngage')
      .lean()
    ctx.body = { applicant, listHistory }
  }

  static async updateApplicantByUID(ctx: Context) {
    const { uid } = ctx.params
    const data = ctx.request.body as any

    if (!data.status) {
      data.status = APPLICANT_STATUS.AVAILABLE
    }
    ctx.body = await Applicant.updateOne({ uid }, data, { new: true, runValidators: true, upsert: true, safe: true, setDefaultsOnInsert: true })
  }

  static async updateApplicantTagsByUID(ctx: Context) {
    const { uid } = ctx.params
    const data = ctx.request.body as object
    await ApplicantTag.update({ applicantUid: uid }, { ...data, applicantUid: uid }, { upsert: true, overwrite: true })
    ctx.body = 'OK'
  }

  static async createApplicantHistory(ctx: Context) {
    const data = ctx.request.body as any
    const { uid } = ctx.params

    const applicant = await Applicant.findOne({ uid })
    if (!applicant) {
      throw new ApplicationError('Bạn cần lưu thông tin ứng viên trước khi chuyển đến công ty.')
    }

    const telesale = await telesaleNeedMoreApplicant()

    await Promise.all([
      data.company === COMPANY.JAVIET ? Javiet.create({ applicantId: applicant._id, company: data.company }) : TinhLoi.create({ applicantId: applicant._id, company: data.company, telesale }),
      applicant.update({ status: APPLICANT_STATUS.IN_PROGRESS }).exec()
    ])

    ctx.body = 'OK'
  }
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
