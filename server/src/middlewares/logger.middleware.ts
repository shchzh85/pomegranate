import { Context, Next } from 'koa';

import { logger as wlog } from '@common/utils';

interface Opts { }

export function logger(opts?: Opts) {
  return async (ctx: Context, next: Next) => {
    const start = Date.now();

    try {
      await next();
    } catch (e) {
      wlog.error(e.message);
      throw e;
    }

    const res = ctx.res;

    const onfinish = done.bind(null, 'finish');
    const onclose = done.bind(null, 'close');

    res.once('finish', onfinish);
    res.once('close', onclose);

    function done(event: string) {
      const { realIp, status, path, method } = ctx;
      if (path == '/web/notices' || path == '/web/ping_pong') return;
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      const end = Date.now();
      const delta = Math.round(end - start);
      wlog.info(`${realIp} ${ctx.headers['proxy-host'] || '-'} ${event} ${method} ${status} ${path} ${delta}ms`);
    }
  };
}
