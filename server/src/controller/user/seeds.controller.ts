import { Context } from 'koa';

import BaseController from '@controller/base.controller';
import { seedsService } from '@service/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';


class SeedsController extends BaseController {

  public async getFT(ctx: Context) {
    //const { uid, dpassword, qid} = ctx.params;
    //return seedsService.getFT({uid, dpassword, qid});
  }

  public async levelup(ctx: Context) {
    //return await seedsService.levelup();
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
