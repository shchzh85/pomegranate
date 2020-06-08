
import Joi from '@hapi/joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import {adminStatisticsController} from '@controller/admin/statistics.controller';
import {verifySignature} from '@middlewares/admin/verify_signature.middleware';
const prefix = '/v1/statistics';

const routes: Route[] = [
  {
    name: 'memberNum',
    path: '/memberNum',
    method: RequestMethod.GET,
    middlewares: [verifySignature()],
    action: adminStatisticsController.memberNum
  }
]

export default routes.map(item => ({ ...item, path: `${prefix}${item.path}` }));
