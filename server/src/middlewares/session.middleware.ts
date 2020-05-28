
import * as _ from 'lodash';
import koaSession from 'koa-session';
import Koa from 'koa';
import { userService } from '@service/index';

const START_SERVER = process.env.START_SERVER || 'user';
const prefix = START_SERVER.endsWith('_') ? START_SERVER : `${START_SERVER}_`;

interface Opts {}

export function session(app: Koa, opts?: Opts) {
  return koaSession({
    key: process.env.SESSION_KEY || 'usersession',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
    store: new Store(),
    secure: false,
    prefix
  }, app);
}

class Store {

  public getService(key: string) {
    if (prefix === 'user_') {
      return { service: userService };
    } else {
      throw new Error(`key is invalid, get key: ${key}`);
    }
  }

  public async get(key: string) {
    const { service } = this.getService(key);
    return await service.getSession(key);
  }

  public async set(key: string, sess: any) {
    const { service } = this.getService(key);
    await service.updateSession(sess.uid, key);
  }

  public async destroy(key: string) {
    const { service } = this.getService(key);
    await service.destorySession(key);
  }

}
