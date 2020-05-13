import { Next, Middleware } from 'koa';
import * as _ from 'lodash';
import { ErrCode } from '../enums';

interface Opts { }

export function userAuth(opts?: Opts): Middleware {
  //  @types/koa-session, 导致type不兼容，暂时定义ctx为any
  return async (ctx: any, next: Next) => {
    if (!ctx.session || (ctx.session && !ctx.session.user)) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: { code: ErrCode.UNAUTHORIZATION, message: 'unauthorization' },
      };
      return;
    }

    ctx.user = ctx.session.user;
    await next();
  }
}

