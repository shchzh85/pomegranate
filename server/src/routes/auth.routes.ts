import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { userAuth } from '@common/auths';
import { authController } from '@controller/index';

const prefix = '/v1/auth';

const routes: Route[] = [
  {
    name: 'prepay',
    path: '/prepay',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: authController.prepay
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
