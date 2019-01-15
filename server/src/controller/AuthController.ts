import User, { getCryptPassword } from '../model/User'
import { Context } from 'koa'
import { pick, omit } from 'lodash'
import ApplicationError from '@/library/ApplicationError'

interface updateRequest {
  oldPassword: string
  newPassword: string
}
export default class AuthController {
  static async login(ctx: Context) {
    let data: { username?: string; password?: string } = pick(ctx.request.body, ['username', 'password'])

    let user = await User.findOne({ username: data.username }).lean()

    if (!user || user.password !== getCryptPassword(data.password)) {
      throw new ApplicationError('Sai tên đăng nhập hoặc mật khẩu', 400)
    }

    let resData = mapper(user)
    ctx.session.auth = user
    ctx.body = resData
  }

  static async logout(ctx: Context) {
    ctx.session.auth = null
    ctx.body = { success: 1 }
  }

  static async update(ctx: Context) {
    const user = await User.findOne({ _id: ctx.state.user._id })
    const data = <updateRequest>ctx.request.body

    if (user.password !== getCryptPassword(data.oldPassword)) {
      throw new ApplicationError('Sai tên đăng nhập hoặc mật khẩu', 400)
    }

    await User.updateOne({ _id: user._id }, { password: data.newPassword })

    ctx.body = 'OK'
  }
}

function mapper(user: object) {
  return omit(user, ['password', '_id'])
}
