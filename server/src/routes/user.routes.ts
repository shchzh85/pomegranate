import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { user } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/user';

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
    action: user.userController.register
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
    action: user.userController.login
  },
  {
    name: 'logout',
    path: '/oauth/logout',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: user.userController.logout
  }
];

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));




/*
//Seed 控制器

//领取福田
Route::post('/getFT', 'index/Seeds/getFT');
//升级
Route::post('/levelup', 'index/Seeds/levelup');
//看视频做任务
Route::post('/finishQuest', 'index/Seeds/finishQuest');
//福田列表
Route::post('/appGetQuestList', 'index/Seeds/appGetQuestList');
//我的福田
Route::post('/appGetMyQuestList', 'index/Seeds/appGetMyQuestList');
//实名申请
Route::post('/shiming_rg', 'index/Seeds/shiming_rengong');
//实名申请(alipay)
Route::post('/shiming_sq', 'index/Seeds/shiming_shenqing');
//水滴记录
Route::post('/waterlist', 'index/Seeds/waterlist');
//互转
Route::post('/sendcoin', 'index/Seeds/sendcoin');
//仓储记录
Route::post('/appGetSeedBankList', 'index/Seeds/seedBankList');
//我的团队
Route::post('/appGetSeedMyGroupList', 'index/Seeds/myGroup');
//存入背包
Route::post('/appCleanSeedBank', 'index/Seeds/cleanSeedBank');
//审核
Route::get('/shimingshenhe', 'index/Schedule/checkMember');
//查询今日可做任务数量
Route::post('/taskLeft', 'index/Seeds/getTaskLeft');
//今日金种子
Route::post('/todaySeed', 'index/Seeds/todaySeed');
//今日金种子
//Route::post('/appGetQuestVideo', 'index/Seeds/getVideo');
//异步通知未到,查询接口
Route::post('/appCheckPay', 'index/Seeds/check_pay_face');
*/

/*

//seed C2c

//挂买
Route::post('/seedc2cbuy', 'index/Seedc2c/c2cbuy');
//点击购买
Route::post('/seedc2cSellit', 'index/Seedc2c/c2cSellit');
//撤销挂单
Route::post('/seedc2cCxdd', 'index/Seedc2c/cxdd');
//当前所有订单
Route::post('/appGetC2CList', 'index/Seedc2c/getC2CList');
//当前订单详情
Route::post('/appGetC2COrder', 'index/Seedc2c/getC2COrder');
//已经匹配的订单
Route::post('/appGetC2CUserOrder', 'index/Seedc2c/getUserC2CList');
//填写收款地址
Route::post('/seedc2cshiming', 'index/Seedc2c/shiming');
//获取付款人信息
Route::post('/seedGetC2CUser', 'index/Seedc2c/getC2CUser');
//付款
Route::post('/seedc2cfukuan', 'index/Seedc2c/c2cfukuan');
//确认
Route::post('/seedc2cquren', 'index/Seedc2c/c2cqueren');
//投诉
Route::post('/seedc2ctousu', 'index/Seedc2c/c2ctousu');
//匹配后撤销
Route::post('/seedc2cchexiao', 'index/Seedc2c/c2cchexiao');
//价格历史
Route::post('/getSeedPriceHis', 'index/Seedc2c/getSeedPriceHis');
//实名
Route::post('/seedc2cgetshiming', 'index/Seedc2c/getShiming');
//实名
Route::post('/seedc2cgetPriceLine', 'index/Seedc2c/getSeedPriceLine');

*/
