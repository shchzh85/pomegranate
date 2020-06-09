import { Context } from 'koa';
import BaseController from '@controller/base.controller';
import { apiService } from '@service/index';
import * as _ from 'lodash';

class ApiController extends BaseController {

  public banners(ctx: Context) {
    return apiService.banners();
  }

  public news(ctx: Context) {
    return apiService.news(ctx.params);
  }

  public newsDetail(ctx: Context) {
    return apiService.newsDetail(ctx.params);
  }

  public businessCollege(ctx: Context) {
    return apiService.businessCollege();
  }

  public kefuQrcode(ctx: Context) {
    return apiService.kefuQrcode();
  }

  public qrcodePayment(ctx: Context) {
    const uid = _.get(ctx, 'session.uid');
    return apiService.qrcodePayment(uid, ctx.params);
  }
}

export const apiController = new ApiController();
