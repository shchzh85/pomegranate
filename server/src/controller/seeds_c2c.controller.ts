import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { seedC2CService } from '@service/index';

class SeedsC2CController extends BaseController {

  public c2cbuy(ctx: Context) {
    return seedC2CService.c2cbuy(ctx.uid, ctx.params);
  }

  public async c2cSellit(ctx: Context) {
    return seedC2CService.c2cSellit(ctx.uid, ctx.params);
  }

  public async cxdd(ctx: Context) {
    return seedC2CService.cxdd(ctx.uid, ctx.params);
  }

  public async getC2CList(ctx: Context) {
      
  }

  public async getC2COrder(ctx: Context) {
      
  }

  public async getUserC2CList(ctx: Context) {
      
  }

  public async shiming(ctx: Context) {
      
  }

  public async getC2CUser(ctx: Context) {
      
  }

  public async c2cPay(ctx: Context) {
    return seedC2CService.c2cPay(ctx.uid, ctx.params);
  }

  public async c2cConfirm(ctx: Context) {
    return seedC2CService.c2cConfirm(ctx.uid, ctx.params);
  }

  public async c2cComplaint(ctx: Context) {
    return seedC2CService.c2cComplaint(ctx.uid, ctx.params);
  }

  public async c2cRevoke(ctx: Context) {
    return seedC2CService.c2cRevoke(ctx.uid, ctx.params);
  }

  public async getSeedPriceHis(ctx: Context) {
      
  }

  public async getShiming(ctx: Context) {
      
  }

  public async getSeedPriceLine(ctx: Context) {
      
  }
}

export const seedsC2CController = new SeedsC2CController();
