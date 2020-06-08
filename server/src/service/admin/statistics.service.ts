import * as _ from 'lodash';
import BaseService from '../base.service';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { userStore, redisStore, userSessionStore, configStore} from '@store/index';

class StatisticsService extends BaseService {
  /**
   * 总会员量
   */
  public async memberNum() {
    return userStore.count().then((result) => {
      return result;
    });
  }
}

export const adminStatisticsService = new StatisticsService();
