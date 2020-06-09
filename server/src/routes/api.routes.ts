
import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { userAuth } from '@common/auths';
import { apiController } from '@controller/index';
import fieldReg from '@common/field_reg';

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
        .error(new Error('start > 0')),
      len: Joi
        .number()
        .greater(0)
        .error(new Error('len > 0'))
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
    name: 'Customer Support Qrcode',
    path: '/CSQrcode',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: apiController.kefuQrcode
  },
  {
    name: 'Qrcode payment',
    path: '/qrcodePayment',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      businessId: Joi
          .number()
          .greater(0)
          .required()
          .error(new Error('请输入商户ID')),
      payPassword: Joi
          .string()
          .trim()
          .pattern(fieldReg.password.reg())
          .required()
          .error(new Error(fieldReg.password.message())),
      payNumber: Joi
          .number()
          .greater(0)
          .required()
          .error(new Error('请输入合法的支付数量')),
    }),
    action: apiController.qrcodePayment
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
