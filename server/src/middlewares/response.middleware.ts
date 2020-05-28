import { Context } from 'koa';
import { Code } from '@common/enums';
import { logger } from '@common/utils';

interface Params {
  action: (ctx: Context) => any;
}

export function response({ action }: Params) {
  return async (ctx: any) => {
    try {
      const data = await action(ctx);
      ctx.body = data ? { code: Code.OK, data } : { code: Code.OK };
    } catch (e) {
      const eSource = e.source || '';
      const eMessage = e.message || 'unknow';
      const eParams = e.params ? JSON.stringify(e.params) : '';
      logger.error(`${eSource} ${eMessage} ${eParams} ${ctx.path} ${JSON.stringify(ctx.params)} ${ctx.user?.id}`);

      ctx.body = {
        code: e.code || Code.SERVER_ERROR,
        message: e.code ? e.message : 'server error.'
      };
    }
  };
}
