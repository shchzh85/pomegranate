
import { Transaction } from 'sequelize';
import _ from 'lodash';
import {Exception} from '@common/exceptions';
import {ErrCode} from '@common/enums';
import BaseService from './base.service';
import { userStore, RegisterParams } from '@store/index';
import { sequelize } from '@common/dbs';

class UserService extends BaseService {

    public async hello() {
        return userStore.walletCreate();
    }

    public async updateSession(id: number, key: string, sess: any) {
        // TODO
        return;
    }

    public async getSession(key: string) {
        // TODO
        return {sess: {}, user: {}};
    }

    public async destorySession(key: string) {
        // TODO
        return;
    }

    public register(params: RegisterParams) {
        return userStore.create(params);
    }

}

export const userService = new UserService();
