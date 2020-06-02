import * as _ from 'lodash';
import BaseService from './base.service';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { redisStore, bannerStore, newsStore, businessCollegeStore } from '@store/index';
import { qrcodeStore } from '@store/qrcode.store';

class ApiService extends BaseService {

  public async banners() {
    return redisStore.remember('news_banners', () => bannerStore.list());
  }

  public async news(params: any) {
    const start = _.defaultTo(params.start, 1);
    const len = _.defaultTo(params.len, 5);
    const offset = (start - 1) * len;
    const key = 'cy:news:p' + start;
    const list = await redisStore.remember(key, async () => {
      const news = await newsStore.list(offset, len);
      news.forEach(v => v.content = _.replace(v.content, /[\n|\r|\r\n]/g, '')); // |&nbsp;
      return news;
    });

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
    return redisStore.remember(key, () => businessCollegeStore.list());
  }

  public kefuQrcode() {
    const key = 'cy:kefu_qrcode';
    return redisStore.remember(key, () => qrcodeStore.findOne());
  }
}

export const apiService = new ApiService();
