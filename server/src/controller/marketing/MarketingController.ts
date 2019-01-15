import { Context } from 'koa'
import { map } from 'lodash'
import Applicant from '@/model/Applicant'

export default class MarketingController {
  static async listSource(ctx: Context) {
    const sources = await Applicant.aggregate([
      {
        $group: {
          _id: '$source'
        }
      }
    ])

    ctx.body = map(sources, '_id')
  }
}
