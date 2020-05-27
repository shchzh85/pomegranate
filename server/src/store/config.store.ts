
import * as _ from 'lodash';
import BaseStore from './base.store';
import { configRepository } from '@models/index';
import { redisStore } from './redis.store';

const KEY = 'cy:config';

class ConfigStore extends BaseStore {

  private async init() {
    const args: { [key: string]: string } = {};
    const cs = await configRepository.findAll();
    cs.forEach(v => args[v.name] = v.value);
    return await redisStore.hmset(KEY, args);
  }

  public async get(name: string, defaultValue: any = null) {
    let ret = await redisStore.hget(KEY, name);
    if (_.isEmpty(ret)) {
      const exists = await redisStore.exists(KEY);
      if (!exists) {
        await this.init();
        ret = await redisStore.hget(KEY, name);
      }
    }

    return !_.isEmpty(ret) ? ret : defaultValue;
  }

  public async getNumber(name: string, defaultValue: number = 0) {
    const v = await this.get(name);
    return !_.isEmpty(v) ? _.toNumber(v) : defaultValue;
  }

  public all() {
    return redisStore.hgetall(KEY);
  }
}

export const configStore = new ConfigStore();
