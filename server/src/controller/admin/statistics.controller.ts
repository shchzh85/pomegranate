import { Context } from 'koa';
import BaseController from '@controller/admin/admin.base.controller';
import {adminStatisticsService} from '@service/admin/statistics.service';

class StatisticsController extends BaseController {

  public memberNum(ctx: Context) {
    return adminStatisticsService.memberNum();
  }
}

export const adminStatisticsController = new StatisticsController();
