import { Context } from 'koa'
import User from '@/model/User'
import { isEmpty, pick, omit } from 'lodash'

interface ListUserRequest {
  search: string
  role: string[]
  company: string[]
}
export default class UserController {
  static async listUser(ctx: Context) {
    const filter = <ListUserRequest>ctx.request.body
    let query: any = {}

    if (filter.search) {
      query.username = { $regex: new RegExp(`${filter.search}`, 'g') }
    }

    if (filter.role && !isEmpty(filter.role)) {
      query.role = { $in: filter.role }
    }

    if (filter.company && !isEmpty(filter.company)) {
      query.$or = []
      filter.company.forEach(company => {
        query.$or.push({ role: new RegExp(`^${company}_.*`, 'i') })
      })
    }

    ctx.body = await User.find(query).lean()
  }

  static async delete(ctx: Context) {
    const { id } = ctx.params
    await User.deleteOne({ _id: id })
    ctx.body = 'OK'
  }

  static async getUser(ctx: Context) {
    const { id } = ctx.params

    ctx.body = await User.findById(id).select(['username', 'role', 'company', 'lang']).lean()
  }

  static async update(ctx: Context) {
    const { id } = ctx.params
    const data = pick(ctx.request.body, ['username', 'role', 'company', 'lang', 'password'])
    await User.updateOne({ _id: id }, data)
    ctx.body = 'OK'
  }

  static async create(ctx: Context) {
    const data = pick(ctx.request.body, ['username', 'role', 'company', 'lang', 'password'])
    await User.create(data)
    ctx.body = 'OK'
  }

  static async loginAs(ctx: Context) {
    const { userId } = ctx.params

    const user = await User.findById(userId)

    ctx.session.auth = user
    ctx.body = omit(user, ['_id', 'password'])
  }
}
