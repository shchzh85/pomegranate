import { Context } from 'koa';

import BaseController from '@controller/base.controller';
import { userService } from '@service/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';

class UserController extends BaseController {

  public async hello(ctx: Context) {
    return await userService.hello();
  }

  public async findUser(ctx: Context) {
    return await userService.findUser();
  }

}

export const userController = new UserController();
