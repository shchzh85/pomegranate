import { Context } from 'koa';

import BaseController from '@controller/base.controller';
import { seedsService } from '@service/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';


class SeedsController extends BaseController {

  public getFT(ctx: Context) {
    const uid = ctx.uid;
    return seedsService.getFT({ uid, ...ctx.params });
  }

  public levelUp(ctx: Context) {
    return seedsService.levelUp(ctx.uid);
  }

  public appGetQuestList(ctx: Context) {
    return seedsService.appGetQuestList();
  }

  public appGetMyQuestList(ctx: Context) {
    return seedsService.appGetMyQuestList(ctx.uid);
  }

  public async shiming_sq(ctx: Context) {
    //return await seedsService.shiming_sq();
  }

  public waterList(ctx: Context) {
    return seedsService.waterList(ctx.uid, ctx.params);
  }

  public seedBankList(ctx: Context) {
    return seedsService.seedBankList(ctx.uid, ctx.params);
  }

  public myGroup(ctx: Context) {
    return seedsService.myGroup(ctx.uid, ctx.params);
  }

  public async check_pay_face(ctx: Context) {
    //return await seedsService.check_pay_face();
  }

}

export const seedsController = new SeedsController();
