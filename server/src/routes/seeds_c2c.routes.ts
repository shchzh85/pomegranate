import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { seedsC2CController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/v1/c2c';

const routes: Route[] = [
  {
    name: '挂买',
    path: '/buy',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      num: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('num是必传字段(>0).')),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))     
    }),
    action: seedsC2CController.buy
  },
  {
    name: '点击购买',
    path: '/sell',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.')),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: seedsC2CController.sell
  },
  {
    name: '撤销挂单',
    path: '/cancel',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: seedsC2CController.cancel
  },
  {
    name: '付款',
    path: '/pay',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.')),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      img: Joi
        .string()
        .trim()
        .required()
        .error(new Error('img是必传字段.'))
    }),
    action: seedsC2CController.pay
  },
  {
    name: '确认',
    path: '/confirm',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.')),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: seedsC2CController.confirm
  },
  {
    name: '投诉',
    path: '/complaint',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.complaint
  },
  {
    name: '匹配后撤销',
    path: '/revoke',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.revoke
  },
  {
    name: '当前所有订单',
    path: '/appGetC2CList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getC2CList
  },
  {
    name: '当前订单详情',
    path: '/getC2COrder',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getC2COrder
  },
  {
    name: '已经匹配的订单',
    path: '/getC2CUserOrder',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getUserC2CList
  },
  {
    name: '填写收款地址',
    path: '/shiming',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.shiming
  },
  {
    name: '获取付款人信息',
    path: '/getC2CUser',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getC2CUser
  },
  {
    name: '价格历史',
    path: '/getSeedPriceHis',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getSeedPriceHis
  },
  {
    name: '实名',
    path: '/getshiming',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getShiming
  },
  {
    name: '实名',
    path: '/getPriceLine',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getSeedPriceLine
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
