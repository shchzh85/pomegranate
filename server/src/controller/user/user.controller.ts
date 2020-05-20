import { Context } from 'koa';

import BaseController from '@controller/base.controller';
import { userService } from '@service/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';

class UserController extends BaseController {

  public async hello(ctx: Context) {
    return userService.hello();
  }

<<<<<<< HEAD
  public async register(ctx: Context) {
    const { username, password, dpassword, invitecode, messagecode } = ctx.params;

    // 1. 判断注册开关

    // 2. 判断短信验证码


    const user = await userService.register({ username, password, dpassword, invitecode });
    if (ctx.session)
      ctx.session.uid = user.id;
=======
  public async findUser(ctx: Context) {
    return userService.findUser();
  }

  public async register(ctx: Context) {
    return userService.register();
>>>>>>> 3eea63d95b2829b78ca39ece0fbb639561f8977d
  }

}

export const userController = new UserController();
