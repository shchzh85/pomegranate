import { promisify } from 'util';

import BaseStore from '@store/base.store';
import { redisClient } from '@common/dbs';

class RedisStore extends BaseStore {

  public async set(key: string, value: string) {
    return promisify(redisClient.set).bind(redisClient)(key, value);
  }

  public async get(key: string) {
    return promisify(redisClient.get).bind(redisClient)(key);
  }

  public async incr(key: string) {
    return promisify(redisClient.incr).bind(redisClient)(key);
  }

  public async hset(key: string, field: string, value: string) {
    return promisify(redisClient.hset).bind(redisClient)(key, field, value);
  }

  public async hget(key: string, field: string) {
    return promisify(redisClient.hget).bind(redisClient)(key, field);
  }

  public async hincrby(key: string, field: string, increment: number) {
    return promisify(redisClient.hincrby).bind(redisClient)(key, field, increment);
  }

  public async zadd(key: string, ...args: Array<string | number>) {
    return new Promise((resolve, rejects) => {
      redisClient.zadd(key, ...args, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async pexpire(key: string, milliseconds: number) {
    return promisify(redisClient.pexpire).bind(redisClient)(key, milliseconds);
  }

  public async zrangebyscore(key: string, min: number | string, max: number | string) {
    return await promisify(redisClient.zrangebyscore).bind(redisClient)(key, min, max) as string[];
  }

  public async zremrangebyscore(key: string, min: number, max: number) {
    return promisify(redisClient.zremrangebyscore).bind(redisClient)(key, min, max);
  }

  public async hmget(key: string, args: string[]) {
    return new Promise<string[]>((resolve, rejects) => {
      redisClient.hmget(key, args, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async hmdel(key: string, args: string[]) {
    return new Promise((resolve, rejects) => {
      redisClient.hdel(key, args, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async exist(key: string) {
    return new Promise((resolve, rejects) => {
      redisClient.exists(key, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async zscore(key: string, member: string) {
    return promisify(redisClient.zscore).bind(redisClient)(key, member);
  }
}

export const redisStore = new RedisStore();
