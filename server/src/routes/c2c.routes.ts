import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { c2CController } from '@controller/index';
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
    action: c2CController.buy
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
    action: c2CController.sell
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
    action: c2CController.cancel
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
    action: c2CController.pay
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
    action: c2CController.confirm
  },
  {
    name: '投诉',
    path: '/complaint',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: c2CController.complaint
  },
  {
    name: '匹配后撤销',
    path: '/revoke',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: c2CController.revoke
  },
  {
    name: '当前所有订单',
    path: '/list',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      listType: Joi
        .string()
        .required()
        .pattern(/^buy$|^sell$/)
        .error(new Error('listType是必传字段.')),
      search: Joi
        .string(),
      start: Joi
        .number()
        .min(0),
      len: Joi
        .number()
        .min(1)
    }),
    action: c2CController.getC2CList
  },
  {
    name: '当前订单详情',
    path: '/orderDetail',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: c2CController.getC2COrder
  },
  {
    name: '已经匹配的订单',
    path: '/myOrders',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      start: Joi
        .number()
        .min(0),
      len: Joi
        .number()
        .min(1)
    }),
    action: c2CController.getUserC2CList
  },
  {
    name: '填写收款地址',
    path: '/certificate',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      mz: Joi
        .string()
        .trim()
        .required()
        .min(2)
        .error(new Error('名字是必传字段.')),
      bank: Joi
        .string()
        .trim()
        .required()
        .error(new Error('银行是必传字段.')),
      zhihang: Joi
        .string()
        .trim()
        .required()
        .error(new Error('支行是必传字段.')),
      cardno: Joi
        .string()
        .trim()
        .required()
        .error(new Error('卡号是必传字段.')),
      img1: Joi
        .string()
        .trim()
        .required()
        .error(new Error('支付宝二维码是必传字段.')),
      img2: Joi
        .string()
        .trim()
        .required()
        .error(new Error('微信二维码是必传字段.'))
    }),
    action: c2CController.cetificate
  },
  {
    name: '获取付款人信息',
    path: '/getSeller',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .string()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: c2CController.getSeller
  },
  {
    name: '价格',
    path: '/price',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: c2CController.getSeedPriceHis
  },
  {
    name: '实名',
    path: '/getCertification',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: c2CController.getCertification
  },
  {
    name: '价格线',
    path: '/getPriceLine',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: c2CController.getSeedPriceLine
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
