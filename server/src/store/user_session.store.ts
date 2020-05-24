
import * as _ from 'lodash';
import { userSessionRepository } from '@models/index';
import BaseStore from './base.store';

class UserSessionStore extends BaseStore {

  public async update(uid: number, token: string) {
    await userSessionRepository.upsert({ uid, token });
  }

  public async destroy(uid: string, token: string) {
    await userSessionRepository.destroy({ where: { uid, token } });
  }

}

export const userSessionStore = new UserSessionStore();
