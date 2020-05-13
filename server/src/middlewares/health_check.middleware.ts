import { Context, Next } from 'koa';

export function healthCheck() {
  return async (ctx: Context, next: Next) => {
    if (ctx.path === '/web/health_check') {
      ctx.body = process.env.START_SERVER + ' ' + 'build time:' + ' ' + process.env.BUILD_TIME;
    } else {
      await next();
    }
  };
}
