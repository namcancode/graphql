import { Context } from 'koa'
import { setLang } from '@/library/Language'
import ApplicationError from '@/library/ApplicationError';

export async function checkAuthSession(ctx: Context, next) {
  if (!ctx.session.auth) {
    throw new ApplicationError('Mời bạn đăng nhập', 401)
  }
  ctx.state.user = ctx.session.auth
  setLang(ctx.state.user.lang || 'vi')
  await next()
}

export const checkRole = (allowRole: string[] | string) => async (ctx: Context, next) => {
  if (typeof allowRole === 'string') {
    allowRole = [allowRole]
  }

  if (allowRole.indexOf(ctx.session.auth.role) === -1) {
    throw new ApplicationError('Mời bạn đăng nhập', 401)
  }

  await next()
}
