import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { userController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/v1/user/';

const routes: Route[] = [
  {
    name: 'register',
    path: '/register',
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
        .error(new Error(fieldReg.smsCode.message({ len: 6 })))
    }),
    action: userController.register
  },
  {
    name: 'login',
    path: '/login',
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
    path: '/logout',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: userController.logout
  },
  {
    name: 'setLoginPasswd',
    path: '/setLoginPasswd',
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
    name: 'setTradePasswd',
    path: '/setTradePasswd',
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
  },
  {
    name: 'send SMS',
    path: '/sendSms',
    method: RequestMethod.POST,
    params: Joi.object({
      phone: Joi
        .string()
        .trim()
        .pattern(fieldReg.phone.reg())
        .required()
        .error(new Error(fieldReg.phone.message())),
      type: Joi
        .string()
        .trim()
        .pattern(/^forgot$|^register$/)
        .error(new Error('必须指定短信类型'))
    }),
    action: userController.sendSms
  },
  {
    name: 'check username exists',
    path: '/userExists',
    method: RequestMethod.POST,
    params: Joi.object({
      phone: Joi
        .string()
        .trim()
        .pattern(fieldReg.phone.reg())
        .required()
        .error(new Error(fieldReg.phone.message()))
    }),
    action: userController.userExists
  },
  {
    name: 'reset password',
    path: '/forgotPassword',
    method: RequestMethod.POST,
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
      scode: Joi
        .string()
        .pattern(fieldReg.smsCode.reg({ len: 6 }))
        .required()
        .error(new Error(fieldReg.smsCode.message({ len: 6 })))
    }),
    action: userController.resetPassword
  },
  {
    name: 'get user',
    path: '/getUser',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: userController.getUser
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
