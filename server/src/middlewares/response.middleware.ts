import { Context } from 'koa';
import { ErrCode } from '@common/enums';
import { logger } from '@common/utils';

interface Params {
  action: (ctx: Context) => any;
}

export function response({ action }: Params) {
  return async (ctx: any) => {
    try {
      const data = await action(ctx);
      ctx.body = data ? { success: true, data } : { success: true };
    } catch (e) {

      let eSource = e.source || '';
      let eMessage = e.message || 'unknow';
      let eParams = e.params ? JSON.stringify(e.params) : '';
      logger.error(`${eSource} ${eMessage} ${eParams} ${ctx.path} ${JSON.stringify(ctx.params)} ${ctx.user?.id}`);

      ctx.body = {
        success: false,
        error: {
          code: e.code || ErrCode.SERVER_ERROR,
          message: e.code ? e.message : 'server error.',
        },
      };
    }
  };
}
