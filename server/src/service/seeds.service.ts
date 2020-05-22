
import { Transaction } from 'sequelize';
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import BaseService from './base.service';
import { seedsStore, GetFTParams } from '@store/index';
import { sequelize } from '@common/dbs';
class SeedsService extends BaseService {


    //购买福田
    public async getFT(params: GetFTParams) {
        // TODO
        seedsStore.getFT(params);
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

export const seedsService = new SeedsService();
