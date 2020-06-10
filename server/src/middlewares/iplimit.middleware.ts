
import { Next, Middleware } from 'koa';

interface Opts {
  api: string;
  count: number;
  expire?: number;
}

export function iplimit(api: string, count: number, expire?: number): Middleware {

  return async (ctx: any, next: Next) => {

  // TODO: check iplimit
/*  if check failed, return
  ctx.status = 200;
  ctx.body = {
    code: Code.INVALID_HEADERS,
    message: 'content-type is not application/json'
  };

  return;
*/

    await next();
  };
}