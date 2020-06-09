import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { authService } from '@service/index';

class AuthController extends BaseController {

  public prepay(ctx: Context) {
      return authService.doPrepay(ctx.uid);
  }

  public orderNotify(ctx: Context) {
    return authService.orderNotify(ctx.request.body);
  }

  public orderResult(ctx: Context) {
    return authService.orderResult(ctx.uid, ctx.params);
  }

  public getOrder(ctx: Context) {
    return authService.getOrder(ctx.uid);
  }

  public faceToken(ctx: Context) {
    return authService.faceToken(ctx.uid, ctx.params);
  }

  public faceResult(ctx: Context) {
    return authService.faceResult(ctx.uid, ctx.params);
  }
}

export const authController = new AuthController();
