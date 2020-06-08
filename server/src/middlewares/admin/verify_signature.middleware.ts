import { Next } from 'koa';
import { Code } from '@common/enums';

export function verifySignature() {
  return async (ctx: any, next: Next) => {
    const apiToken: string = ctx.headers['api-token'] || '';

    if (!apiToken && apiToken !== '12345678987654321QAZXSW@edc3') {
      ctx.status = 200;
      ctx.body = {
        code: Code.INVALID_TOKEN,
        message: 'Invalid api-token'
      };

      return;
    }
    await next();
  };
}
