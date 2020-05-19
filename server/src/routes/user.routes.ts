import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { user } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/user';

const routes: Route[] = [
  {
    name: 'hello world例子',
    path: '/oauth/hello',
    method: RequestMethod.GET,
    middlewares: [],
    action: user.userController.hello,
  },
  {
    name: 'findUser',
    path: '/oauth/findUser',
    method: RequestMethod.GET,
    middlewares: [],
    action: user.userController.findUser
  },
  {
    name: 'register',
    path: '/oauth/register',
    method: RequestMethod.GET,
    middlewares: [],
    action: user.userController.register
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
