import { Context } from 'koa'
import * as Raven from 'raven'
import { map } from 'lodash'
import { SENTRY } from '@/config'
import { $t } from '@/library/Language'

Raven.config(SENTRY).install()

export default () => async (ctx: Context, next) => {
  try {
    // await timeout(1000)
    await next()
  } catch (err) {
    process.env.PRODUCTION ? Raven.captureException(err) : console.log(err)
    ctx.status = err.status || 400

    const listErrorMessage = getListMessageFromError(err)

    if(!listErrorMessage) {
      ctx.throw(err)
      return
    }

    ctx.body = listErrorMessage
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getListMessageFromError(err): string[] | null {
  if (err.constructor.name === 'MongooseError') {
    return map(err.errors, 'message')
  }

  if (err.constructor.name === 'ApplicationError') {
    return err.listMessage.map($t)
  }

  return null
}
