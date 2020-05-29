
import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { userAuth } from '@common/auths';
import { apiController } from '@controller/index';

const prefix = '/v1/api';

const routes: Route[] = [
  {
    name: 'banners',
    path: '/banners',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: apiController.banners
  },
  {
    name: 'news',
    path: '/news',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      start: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('start不能为空')),
      len: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('len不能为空'))
    }),
    action: apiController.news
  },
  {
    name: 'newsDetail',
    path: '/newsDetail',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
        id: Joi
          .number()
          .min(0)
          .required()
          .error(new Error('id不能为空')),
    }),
    action: apiController.newsDetail
  },
  {
    name: 'businessCollege',
    path: '/businessCollege',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: apiController.businessCollege
  },
  {
    name: 'kefuQrcode',
    path: '/kefuQrcode',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: apiController.kefuQrcode
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
