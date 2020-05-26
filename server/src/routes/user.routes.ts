import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { userController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '';

const routes: Route[] = [
  {
    name: 'register',
    path: '/oauth/register',
    method: RequestMethod.POST,
    middlewares: [],
    params: Joi.object({
      username: Joi
        .string()
        .trim()
        .pattern(fieldReg.phone.reg())
        .required()
        .error(new Error(fieldReg.phone.message())),
      password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      invitecode: Joi
        .string()
        .pattern(fieldReg.scode.reg())
        .required()
        .error(new Error(fieldReg.scode.message())),
      messagecode: Joi
        .string()
        .pattern(fieldReg.smsCode.reg({ len: 6 }))
        .required()
        .error(new Error(fieldReg.smsCode.message({ len: 6 }))),      
    }),
    action: userController.register
  },
  {
    name: 'login',
    path: '/oauth/login',
    method: RequestMethod.POST,
    middlewares: [],
    params: Joi.object({
      username: Joi
        .string()
        .trim()
        .pattern(fieldReg.phone.reg())
        .required()
        .error(new Error(fieldReg.phone.message())),
      password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: userController.login
  },
  {
    name: 'logout',
    path: '/oauth/logout',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: userController.logout
  },
  {
    name: 'updateLoginPasswd',
    path: '/oauth/updateLoginPasswd',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
       password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
       dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: userController.updateLoginPasswd
  },
  {
    name: 'updateTradePasswd',
    path: '/oauth/updateTradePasswd',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
       dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      messagecode: Joi
        .string()
        .pattern(fieldReg.smsCode.reg({ len: 6 }))
        .required()
        .error(new Error(fieldReg.smsCode.message({ len: 6 })))
    }),
    action: userController.updateTradePasswd
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
