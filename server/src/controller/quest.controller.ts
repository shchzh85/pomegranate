import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { questService } from '@service/index';

class QuestController extends BaseController {

  public apply(ctx: Context) {
    const uid = ctx.uid;
    return questService.apply(uid, ctx.params);
  }

  public levelUp(ctx: Context) {
    return questService.levelUp(ctx.uid);
  }

  public listQuest(ctx: Context) {
    return questService.listQuest();
  }

  public listMyQuest(ctx: Context) {
    return questService.listMyQuest(ctx.uid);
  }

  public async shiming_sq(ctx: Context) {
    //return await questService.shiming_sq();
  }

  public waterList(ctx: Context) {
    return questService.waterList(ctx.uid, ctx.params);
  }

  public seedBankList(ctx: Context) {
    return questService.seedBankList(ctx.uid, ctx.params);
  }

  public myGroup(ctx: Context) {
    return questService.myGroup(ctx.uid, ctx.params);
  }

  public async check_pay_face(ctx: Context) {
    //return await questService.check_pay_face();
  }

}

export const questController = new QuestController();
