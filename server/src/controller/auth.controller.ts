import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { authService } from '@service/index';

class AuthController extends BaseController {

  public prepay(ctx: Context) {
      return authService.doPrepay(ctx.uid);
  }
}

export const authController = new AuthController();
