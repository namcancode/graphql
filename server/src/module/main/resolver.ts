import { Context } from 'koa'
import { FE_VERSION } from '@/config'
import User, { getCryptPassword } from '@/model/User'
import { UserInputError } from 'apollo-server'

export const query = {
  version: () => FE_VERSION,
  auth(parent, params, ctx: Context) {
    return ctx.session.auth
  }
}

export const directiveResolvers = {
  role(next, source, { role }, ctx) {},
  auth(next, source, params, ctx) {}
}

export const mutation = {
  async login(parent, { username, password }, ctx: Context) {
    const user = await User.findOne({ username, password: getCryptPassword(password) }).lean()

    if (!user) {
      throw new UserInputError('Sai tên đăng nhập hoặc mật khẩu.')
    }

    ctx.session.auth = user
    return user
  },

  async logout(parent, params, ctx: Context) {
    ctx.session.auth = null
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
