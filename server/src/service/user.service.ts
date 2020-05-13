import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import BaseService from './base.service';

class UserService extends BaseService {

  public async hello() {
    return { world: true };
  }

  public async updateSession(id: number, key: string, sess: any) {
    // TODO
    return;
  }

  public async getSession(key: string) {
    // TODO
    return { sess: {}, user: {} };
  }

  public async destorySession(key: string) {
    // TODO
    return;
  }

}

export const userService = new UserService();
