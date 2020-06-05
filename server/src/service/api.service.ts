import * as _ from 'lodash';
import BaseService from './base.service';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { redisStore, bannerStore, newsStore, businessCollegeStore } from '@store/index';
import { qrcodeStore } from '@store/qrcode.store';
import { resUrl } from '@common/utils/url.utils';

class ApiService extends BaseService {

  public banners() {
    return redisStore.remember('news_banners', async () => {
      const list = await bannerStore.list();
      list.forEach(v => v.banner = resUrl(v.banner));
      return list;
    });
  }

  public async news(params: any) {
    const start = _.defaultTo(params.start, 1);
    const len = _.defaultTo(params.len, 5);
    const offset = (start - 1) * len;
    const key = 'cy:news:p' + start + '_' + len;
    const list = await redisStore.remember(key, async () => {
      const news = await newsStore.list(offset, len);
      news.forEach(v => v.content = v.content.replace(/[\n|\r|\r\n]/g, '').replace(/<[^>]*>/g, ''));
      return news;
    }, 2000);

    return { start, len, list };
  }

  public async newsDetail(params: any) {
    const { id } = params;
    const key = 'cy:news:' + id;
    const news = await redisStore.remember(key, async () => {
      const ret = await newsStore.findById(id);
      if (!ret)
        throw new Exception(Code.SERVER_ERROR, '新闻不存在');

      return ret;
    });

    return news;
  }

  public businessCollege() {
    const key = 'cy:business_college';
    return redisStore.remember(key, async () => {
      const list = await businessCollegeStore.list();
      list.forEach(v => {
        v.cover = resUrl(v.cover);
        v.audio = resUrl(v.audio);
      });
      return list;
    });
  }

  public kefuQrcode() {
    const key = 'cy:kefu_qrcode';
    return redisStore.remember(key, async () => {
      const ret = await qrcodeStore.findOne();
      ret.qrcode = resUrl(ret.qrcode);
      return ret;
    });
  }
}

export const apiService = new ApiService();
