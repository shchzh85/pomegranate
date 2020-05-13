import { Context, Next } from 'koa';
import _ from 'lodash';

interface Opts { }

export function realIp(opts?: Opts) {
  return async (ctx: Context, next: Next) => {
    const forwarded = ctx.headers['x-forwarded-for'] || '';
    const { via = '', tlyrealip = '' } = ctx.headers;
    ctx.realIp = (
      via.match(/cdn77/)
        ? forwarded.split(',').shift()
        : tlyrealip || (forwarded && forwarded.split(',').pop()) || ctx.ip || ''
    ).trim();
    await next();
  };
}
