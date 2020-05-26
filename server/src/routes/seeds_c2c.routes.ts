import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { seedsC2CController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '';

const routes: Route[] = [
  {
    name: '挂买',
    path: '/seedc2cbuy',
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
    action: seedsC2CController.c2cbuy
  },
  {
    name: '点击购买',
    path: '/seedc2cSellit',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .number()
        .required()
        .error(new Error('oid是必传字段.')),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: seedsC2CController.c2cSellit
  },
  {
    name: '撤销挂单',
    path: '/seedc2cCxdd',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      oid: Joi
        .number()
        .required()
        .error(new Error('oid是必传字段.'))
    }),
    action: seedsC2CController.cxdd
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
    path: '/appGetC2COrder',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getC2COrder
  },
  {
    name: '已经匹配的订单',
    path: '/appGetC2CUserOrder',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getUserC2CList
  },
  {
    name: '填写收款地址',
    path: '/seedc2cshiming',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.shiming
  },
  {
    name: '获取付款人信息',
    path: '/seedGetC2CUser',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getC2CUser
  },
  {
    name: '付款',
    path: '/seedc2cfukuan',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.c2cPay
  },
  {
    name: '确认',
    path: '/seedc2cquren',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.c2cConfirm
  },
  {
    name: '投诉',
    path: '/seedc2ctousu',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.c2ctousu
  },
  {
    name: '匹配后撤销',
    path: '/seedc2cchexiao',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.c2cchexiao
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
    path: '/seedc2cgetshiming',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getShiming
  },
  {
    name: '实名',
    path: '/seedc2cgetPriceLine',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsC2CController.getSeedPriceLine
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
