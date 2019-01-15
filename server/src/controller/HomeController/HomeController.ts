import { Context } from 'koa'
import { FE_VERSION } from '@/config'


export default class HomeController {
  static async init(ctx: Context) {
    ctx.body = {
      version: FE_VERSION,
      auth: ctx.session.auth
    }
  }
}


