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
    action: user.userController.register
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
