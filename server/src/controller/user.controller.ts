
import * as _ from 'lodash';
import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { userService } from '@service/index';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';

class UserController extends BaseController {

  public async register(ctx: Context) {
    const { username, password, dpassword, invitecode, scode } = ctx.params;
    const user = await userService.register({ username, password, dpassword, invitecode, scode });
    if (ctx.session)
      ctx.session.uid = user.id;
  }

  public async login(ctx: Context) {
    const ret = await userService.login(ctx.params);
    const uid = _.get(ret, 'user.id');
    if (!_.isNil(uid) && !_.isNil(ctx.session))
      ctx.session.uid = '' + uid;

    return ret;
  }

  public async logout(ctx: Context) {
    const uid = _.get(ctx, 'session.uid');
    if (!_.isEmpty(uid))
      await userService.logout(uid);

    if (!_.isNil(ctx.session))
      ctx.session = null;
  }

  public updateLoginPasswd(ctx: Context) {
    return userService.updateLoginPasswd(ctx.uid, ctx.params);
  }

  public updateTradePasswd(ctx: Context) {
    return userService.updateTradePasswd(ctx.uid, ctx.params);
  }

  public sendSms(ctx: Context) {
    return userService.sendSMS(ctx.params);
  }

  public userExists(ctx: Context) {
    const { phone } = ctx.params;
    return userService.userExists(phone);
  }

  public resetPassword(ctx: Context) {
    return userService.forgotPass(ctx.params);
  }

  public getUser(ctx: Context) {
    return userService.getUser(ctx.uid);
  }
}

export const userController = new UserController();
