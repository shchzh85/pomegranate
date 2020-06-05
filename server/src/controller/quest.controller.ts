import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { questService } from '@service/index';

class QuestController extends BaseController {

  public apply(ctx: Context) {
    return questService.apply(ctx.uid, ctx.params);
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

  public getVideo(ctx: Context) {
    return questService.getVideo(ctx.uid);
  }

  public videoCompleted(ctx: Context) {
    return questService.videoCompleted(ctx.uid, ctx.params);
  }

  public getVideoLiked(ctx: Context) {
    return questService.getVideoLiked(ctx.uid, ctx.params);
  }

  public setVideoLiked(ctx: Context) {
    return questService.setVideoLiked(ctx.uid, ctx.params);
  }

  public listLog(ctx: Context) {
    return questService.listLog(ctx.uid, ctx.params);
  }
}

export const questController = new QuestController();
