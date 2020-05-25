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

  public async appGetQuestList(ctx: Context) {
    //return await seedsService.appGetQuestList();
  }

  public async appGetMyQuestList(ctx: Context) {
    //return await seedsService.appGetMyQuestList();
  }

  public async shiming_sq(ctx: Context) {
    //return await seedsService.shiming_sq();
  }

  public async waterlist(ctx: Context) {
    //return await seedsService.waterlist();
  }

  public async appGetSeedBankList(ctx: Context) {
    //return await seedsService.appGetSeedBankList();
  }

  public async appGetSeedMyGroupList(ctx: Context) {
    //return await seedsService.appGetSeedMyGroupList();
  }

  public async check_pay_face(ctx: Context) {
    //return await seedsService.check_pay_face();
  }

}

export const seedsController = new SeedsController();
