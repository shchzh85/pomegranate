
import * as _ from 'lodash';
import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { userService } from '@service/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';

class UserController extends BaseController {

  public async register(ctx: Context) {
    const { username, password, dpassword, invitecode, messagecode } = ctx.params;

    // 1. 判断注册开关

    // 2. 判断短信验证码


    const user = await userService.register({ username, password, dpassword, invitecode });
    // ctx.session?.uid = user.id;
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
}

export const userController = new UserController();
