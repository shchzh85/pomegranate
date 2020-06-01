import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { seedC2CService } from '@service/index';

class SeedsC2CController extends BaseController {

  public buy(ctx: Context) {
    return seedC2CService.buy(ctx.uid, ctx.params);
  }

  public sell(ctx: Context) {
    return seedC2CService.sell(ctx.uid, ctx.params);
  }

  public cancel(ctx: Context) {
    return seedC2CService.cancel(ctx.uid, ctx.params);
  }

  public pay(ctx: Context) {
    return seedC2CService.pay(ctx.uid, ctx.params);
  }

  public confirm(ctx: Context) {
    return seedC2CService.confirm(ctx.uid, ctx.params);
  }

  public complaint(ctx: Context) {
    return seedC2CService.complaint(ctx.uid, ctx.params);
  }

  public revoke(ctx: Context) {
    return seedC2CService.revoke(ctx.uid, ctx.params);
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
