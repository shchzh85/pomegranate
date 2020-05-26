import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { seedsController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/seeds';

const routes: Route[] = [
  {
    name: '购买福田',
    path: '/business/getFT',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      dpassword: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message())),
      qid: Joi
        .number()
        .required()
        .error(new Error('qid不能为空')),
    }),
    action: seedsController.getFT
  },
  {
    name: '升级',
    path: '/business/levelup',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.levelUp
  },
  {
    name: '福田列表',
    path: '/business/appGetQuestList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.appGetQuestList,
  },
  {
    name: '我的福田',
    path: '/business/appGetMyQuestList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.appGetMyQuestList,
  },
  {
    name: '实名申请',
    path: '/business/shiming_sq',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.shiming_sq,
  },
  {
    name: '水滴记录',
    path: '/business/waterlist',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.waterList,
  },
  {
    name: '仓储记录',
    path: '/business/appGetSeedBankList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.seedBankList,
  },
  {
    name: '我的团队',
    path: '/business/appGetSeedMyGroupList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: seedsController.myGroup,
  },
  {
    name: '异步通知未到,查询接口',
    path: '/business/appCheckPay',
    method: RequestMethod.POST,
    middlewares: [],
    action: seedsController.check_pay_face,
  },
]

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