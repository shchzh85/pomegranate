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
  },
  {
    name: 'orderNotify',
    path: '/orderNotify',
    method: RequestMethod.POST,
    action: authController.orderNotify
  },
  {
    name: 'orderResult',
    path: '/orderResult',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      orderid: Joi
        .string()
        .trim()
        .required()
        .error(new Error('orderid是必传字段.')),
      rawdata: Joi
        .string()
        .trim()
        .required()
        .error(new Error('rawdata是必传字段.'))
    }),
    action: authController.orderResult
  },
  {
    name: 'get order',
    path: 'getOrder',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: authController.getOrder
  },
  {
    name: 'get face token',
    path: '/faceToken',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      orderid: Joi
        .string()
        .trim()
        .required()
        .error(new Error('orderid是必传字段.'))
    }),
    action: authController.faceToken
  },
  {
    name: 'get face result',
    path: '/faceResult',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      orderid: Joi
        .string()
        .trim()
        .required()
        .error(new Error('orderid是必传字段.'))
    }),
    action: authController.faceResult
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
