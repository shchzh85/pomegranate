import { Next, Middleware } from 'koa';
import * as _ from 'lodash';
import { Code } from '../enums';

interface Opts { }

export function userAuth(opts?: Opts): Middleware {
  //  @types/koa-session, 导致type不兼容，暂时定义ctx为any
  return async (ctx: any, next: Next) => {
    const uid = _.get(ctx, 'session.uid');
    if (_.isNil(uid)) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: { code: Code.UNAUTHORIZATION, message: 'unauthorization' },
      };
      return;
    }

    ctx.uid = ctx.session.uid;
    await next();
  }
}

