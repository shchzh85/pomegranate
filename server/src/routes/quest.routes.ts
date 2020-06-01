import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import { questController } from '@controller/index';
import { userAuth } from '@common/auths';
import fieldReg from '@common/field_reg';

const prefix = '/v1/quest';

const routes: Route[] = [
  {
    name: '购买福田',
    path: '/apply',
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
        .error(new Error('qid不能为空'))
    }),
    action: questController.apply
  },
  {
    name: '升级',
    path: '/levelup',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.levelUp
  },
  {
    name: '福田列表',
    path: '/listQuest',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.listQuest
  },
  {
    name: '我的福田',
    path: '/listMyQuest',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.listMyQuest
  },
  {
    name: '实名申请',
    path: '/shiming_sq',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.shiming_sq
  },
  {
    name: '水滴记录',
    path: '/waterlist',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.waterList
  },
  {
    name: '仓储记录',
    path: '/seedBankList',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.seedBankList
  },
  {
    name: '我的团队',
    path: '/myGroup',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.myGroup
  },
  {
    name: '异步通知未到,查询接口',
    path: '/checkPay',
    method: RequestMethod.POST,
    action: questController.check_pay_face
  },
  {
    name: '随机获取一个视频',
    path: '/getVideo',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    action: questController.getVideo
  },
  {
    name: '视频播放完成',
    path: '/videoCompleted',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      vid: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('vid不能为空'))
    }),
    action: questController.videoCompleted
  },
  {
    name: '获得点赞状态',
    path: '/getVideoLiked',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      vid: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('vid不能为空'))
    }),
    action: questController.getVideoLiked
  },
  {
    name: '点赞',
    path: '/setVideoLiked',
    method: RequestMethod.POST,
    middlewares: [ userAuth() ],
    params: Joi.object({
      vid: Joi
        .number()
        .greater(0)
        .required()
        .error(new Error('vid不能为空'))
    }),
    action: questController.setVideoLiked
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
