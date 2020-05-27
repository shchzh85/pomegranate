import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { seedC2CService } from '@service/index';

class SeedsC2CController extends BaseController {

  public c2cbuy(ctx: Context) {
    return seedC2CService.c2cbuy(ctx.uid, ctx.params);
  }

  public c2cSellit(ctx: Context) {
    return seedC2CService.c2cSellit(ctx.uid, ctx.params);
  }

  public cxdd(ctx: Context) {
    return seedC2CService.cxdd(ctx.uid, ctx.params);
  }

  public getC2CList(ctx: Context) {
    return seedC2CService.getC2CList(ctx.uid, ctx.params);
  }

  public getC2COrder(ctx: Context) {
    return seedC2CService.getC2COrder(ctx.uid, ctx.params);
  }

  public getUserC2CList(ctx: Context) {
    return seedC2CService.getUserC2CList(ctx.uid, ctx.params);
  }

  public shiming(ctx: Context) {
    return seedC2CService.shiming(ctx.uid, ctx.params);   
  }

  public getC2CUser(ctx: Context) {
    return seedC2CService.getC2CUser(ctx.uid, ctx.params);
  }

  public c2cPay(ctx: Context) {
    return seedC2CService.c2cPay(ctx.uid, ctx.params);
  }

  public c2cConfirm(ctx: Context) {
    return seedC2CService.c2cConfirm(ctx.uid, ctx.params);
  }

  public c2cComplaint(ctx: Context) {
    return seedC2CService.c2cComplaint(ctx.uid, ctx.params);
  }

  public c2cRevoke(ctx: Context) {
    return seedC2CService.c2cRevoke(ctx.uid, ctx.params);
  }

  public getSeedPriceHis(ctx: Context) {
    return seedC2CService.getSeedPriceHis(ctx.uid, ctx.params);
  }

  public getShiming(ctx: Context) {
    return seedC2CService.getShiming(ctx.uid, ctx.params);
  }

  public getSeedPriceLine(ctx: Context) {
    return seedC2CService.getSeedPriceLine(ctx.uid, ctx.params);
  }
}

export const seedsC2CController = new SeedsC2CController();
