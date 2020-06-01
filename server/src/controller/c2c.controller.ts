import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { c2CService } from '@service/index';

class C2CController extends BaseController {

  public buy(ctx: Context) {
    return c2CService.buy(ctx.uid, ctx.params);
  }

  public sell(ctx: Context) {
    return c2CService.sell(ctx.uid, ctx.params);
  }

  public cancel(ctx: Context) {
    return c2CService.cancel(ctx.uid, ctx.params);
  }

  public pay(ctx: Context) {
    return c2CService.pay(ctx.uid, ctx.params);
  }

  public confirm(ctx: Context) {
    return c2CService.confirm(ctx.uid, ctx.params);
  }

  public complaint(ctx: Context) {
    return c2CService.complaint(ctx.uid, ctx.params);
  }

  public revoke(ctx: Context) {
    return c2CService.revoke(ctx.uid, ctx.params);
  }

  public getC2CList(ctx: Context) {
    return c2CService.getC2CList(ctx.uid, ctx.params);
  }

  public getC2COrder(ctx: Context) {
    return c2CService.getC2COrder(ctx.uid, ctx.params);
  }

  public getUserC2CList(ctx: Context) {
    return c2CService.getUserC2CList(ctx.uid, ctx.params);
  }

  public cetificate(ctx: Context) {
    return c2CService.cetificate(ctx.uid, ctx.params);   
  }

  public getSeller(ctx: Context) {
    return c2CService.getSeller(ctx.uid, ctx.params);
  }

  public getSeedPriceHis(ctx: Context) {
    return c2CService.getSeedPriceHis(ctx.uid, ctx.params);
  }

  public getCertification(ctx: Context) {
    return c2CService.getCertification(ctx.uid, ctx.params);
  }

  public getSeedPriceLine(ctx: Context) {
    return c2CService.getSeedPriceLine(ctx.uid, ctx.params);
  }
}

export const c2CController = new C2CController();
