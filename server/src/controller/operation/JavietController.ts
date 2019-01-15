import { Context } from 'koa'
import JavietApplicantEngage from '@/model/ApplicantEngage/Javiet'
import Javiet from '@/model/ApplicantHistory/Javiet'
import Applicant from '@/model/Applicant'
import { isEmpty, map, pick } from 'lodash'
import { endOfDay, startOfDay, format } from 'date-fns'
import User from '@/model/User'
import { USER_ROLE, IUser } from '@/interface/User'
import axios, { AxiosRequestConfig } from 'axios'
import { getOption } from '@/model/Option'
import { IJavietEngage, JAVIET_STEP } from '@/interface/ApplicantEngage/Javiet'
import * as Raven from 'raven'
import exportToExcel from '@/library/ExportToExcel'
import { capitalize, toString } from 'lodash'

interface IListApplicantQuery {
  search: string
  dateRange: [Date, Date] | null | undefined
  engageStatus: string[]
  recruiter: string[]
  page: number
  limit: number
}
interface IFilterReport {
  dateRange: [Date, Date]
}

interface IReasonEngageStop {
  reason: string
  historyId: string
}

interface IEngageRequest extends IJavietEngage {
  applicant: {
    uid: string
    name: string
  }
  engage: {
    method: string
    content: string
    note: string | undefined
  }
}

export default class JavietController {
  static async listEngage(ctx: Context) {
    const { historyId } = ctx.params
    const [listEngage, history] = await Promise.all([
      JavietApplicantEngage.find({ historyId })
        .sort('createdAt')
        .populate('user')
        .lean(),
      Javiet.findById(historyId)
        .populate('applicant')
        .lean()
    ])

    ctx.body = { listEngage, applicant: history.applicant }
  }

  static async createEngage(ctx: Context) {
    const { historyId } = ctx.params
    const { engage, applicant } = ctx.request.body as IEngageRequest
    const user = ctx.state.user

    if (engage.note && engage.note.trim()) {
      sendMessageToRecuiters({ ...applicant, ...engage })
    }

    const newEngage = await JavietApplicantEngage.create({
      ...pick(engage, ['method', 'note', 'content']),
      userId: user._id,
      historyId
    })

    await newEngage.populate('user').execPopulate()
    ctx.body = newEngage.toJSON({ virtuals: true })
  }

  static async updateEngage(ctx: Context) {
    const { engageId } = ctx.params
    const { engage, applicant } = ctx.request.body as IEngageRequest

    const engageDB = await JavietApplicantEngage.findOne({ _id: engageId })

    if (engage.note && engage.note !== engageDB.note && engage.note.trim()) {
      sendMessageToRecuiters({ ...applicant, ...engage })
    }

    await JavietApplicantEngage.updateOne({ _id: engageId }, engage)

    ctx.body = 'OK'
  }

  static async deleteEngage(ctx: Context) {
    const { engageId } = ctx.params

    await JavietApplicantEngage.deleteOne({ _id: engageId })

    ctx.body = 'OK'
  }

  static async listApplicantHistory(ctx: Context) {
    const filter = ctx.request.body as IListApplicantQuery
    const user = ctx.state.user

    const page = filter.page || 1
    const limit = filter.limit || 20

    let applicantQuery = {} as any

    if (filter.search) {
      applicantQuery.$or = [
        { name: new RegExp(`.*${filter.search}.*`, 'i') },
        { phone: new RegExp(`.*${filter.search}.*`, 'i') },
        { uid: new RegExp(`.*${filter.search}.*`, 'i') }
      ]
    }

    const listApplicant = await Applicant.find(applicantQuery)
    const listApplicantId = map(listApplicant, '_id')

    let query = { company: user.company, recruiter: ctx.state.user.username, applicantId: { $in: listApplicantId } } as any
    let options = {
      sort: '-createdAt',
      lean: true,
      page,
      limit,
      populate: ['applicant', { path: 'listEngage', populate: { path: 'user' } }]
    }

    if (user.role === USER_ROLE.JAVIET_ADMIN) {
      delete query.recruiter
      if (!isEmpty(filter.recruiter)) {
        query.recruiter = { $in: filter.recruiter }
      }
    }

    if (!isEmpty(filter.engageStatus)) {
      query.engageStatus = { $in: filter.engageStatus }
    }

    if (!isEmpty(filter.dateRange)) {
      query.createdAt = {
        $gte: startOfDay(filter.dateRange[0]),
        $lte: endOfDay(filter.dateRange[1])
      }
    }

    ctx.body = await Javiet.paginate(query, options)
  }

  static async updateApplicantHistoryStatus(ctx: Context) {
    const { engageStatus, historyId } = ctx.request.body as any

    await Javiet.updateOne({ _id: historyId }, { engageStatus, reasonEngageStop: '' })

    ctx.body = 'OK'
  }

  static async getListRecruiter(ctx: Context) {
    const listUser = await User.find({ role: USER_ROLE.JAVIET_RECRUITER }).lean()
    ctx.body = map(listUser, 'username')
  }

  static async updateRecruiter(ctx: Context) {
    const { recruiter, _id } = ctx.request.body as any

    await Javiet.updateOne({ _id }, { recruiter })
    ctx.body = 'OK'
  }

  static async getListHistoryToReport(ctx: Context) {
    const filter = ctx.request.body as IFilterReport
    const query = {}

    if (!isEmpty(filter.dateRange)) {
      query['createdAt'] = {
        $gte: startOfDay(filter.dateRange[0]),
        $lte: endOfDay(filter.dateRange[1])
      }
    }

    const listData = await Javiet.find(query).lean()
    ctx.body = listData
  }

  static async getListHistoryByRecuiterToReport(ctx: Context) {
    const filter = ctx.request.body as IFilterReport
    const query = {}

    if (!isEmpty(filter.dateRange)) {
      query['createdAt'] = {
        $gte: startOfDay(filter.dateRange[0]),
        $lte: endOfDay(filter.dateRange[1])
      }
    }
    query['recruiter'] = ctx.state.user.username

    const listData = await Javiet.find(query).lean()
    ctx.body = listData
  }

  static async updateResonEngageStop(ctx: Context) {
    const engage = ctx.request.body as IReasonEngageStop

    await Javiet.updateOne({ _id: engage.historyId }, { reasonEngageStop: engage.reason, engageStatus: 6 })
    ctx.body = 'OK'
  }

  static async exportData(ctx: Context) {
    const options = {
      createdAt: {
        displayName: 'Ngày import',
        width: 120
      },
      recruiter: {
        displayName: 'Người chăm sóc',
        width: 120,
        cellFormat: capitalize
      },
      name: {
        displayName: 'Họ và tên',
        width: 140,
        cellFormat: capitalize
      },
      status: {
        displayName: 'Trạng thái',
        width: 140
      },
      yearOfBirth: {
        displayName: 'Năm sinh',
        width: 80,
        cellFormat: toString
      },
      phone: {
        displayName: 'Số điện thoại',
        width: 110
      },
      facebook: {
        displayName: 'Facebook',
        width: 200
      },
      note: {
        displayName: 'Ghi chú',
        width: 500
      },
      province: {
        displayName: 'Tỉnh',
        width: 120,
        cellFormat: capitalize
      },
      source: {
        displayName: 'Nguồn',
        width: 100,
        cellFormat: capitalize
      }
    }
    
    ctx.attachment('iHR Solution - Javiet.xlsx')
    ctx.body = exportToExcel('iHR Solution', await getExportData(ctx.state.user), options)
  }
}

async function sendMessageToRecuiters({ name, uid, note }) {
  const chatfuelConfig = {
    botId: '5bf6603176ccbc3d548bdad9',
    token: 'mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD',
    messageTag: 'NON_PROMOTIONAL_SUBSCRIPTION',
    blockName: 'javiet notification'
  }

  const options: AxiosRequestConfig = {
    headers: { 'Content-Type': 'application/json' },
    params: {
      chatfuel_token: chatfuelConfig.token,
      chatfuel_message_tag: chatfuelConfig.messageTag,
      chatfuel_block_name: chatfuelConfig.blockName,
      applicant_name: name,
      applicant_uid: uid,
      ihr_message: note
    }
  }

  const listMessengerId = await getOption('listMessengerId', [])

  listMessengerId.forEach(messengerId => {
    axios.post(`https://api.chatfuel.com/bots/${chatfuelConfig.botId}/users/${messengerId}/send`, {}, options).catch(err => Raven.captureException(err))
  })
}

async function getExportData(user: IUser) {
  const listHistory = await Javiet.find({
    recruiter: user.username
  }).populate('applicant')
  
  return listHistory.map(history => ({
      createdAt: format(history.createdAt, 'dd/MM hh:mm:ss'),
      recruiter: history.recruiter,
      status: JAVIET_STEP[history.engageStatus],
      facebook: `https://fb.com/${history.applicant.uid}`,
      ...pick(history.applicant, ['name', 'phone', 'yearOfBirth', 'note', 'province', 'source'])
  }))
}
