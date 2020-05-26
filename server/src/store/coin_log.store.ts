
import * as _ from 'lodash';
import { UniqueConstraintError, Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { coinLogModelRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { sequelize } from '@common/dbs';
import { md5 } from '@common/utils';
import { redisStore } from './redis.store';

export interface CoinLogParams {
  logArr: {
    uid: number,
    username: string,
    num: number,
    target: number,
    targetid: string,
    wtype: number,
    ntype: number,
    oamount: number,
    namount: number,
    note: string,
    dtime: string,
    action: string,
    actionid: number
  }[];
}

class CoinlogStore extends BaseStore {


  public async createLog(params: CoinLogParams) {

    let transaction;

    try {
      transaction = await sequelize.transaction();
      const ws = params.logArr.map(v => {
        return {
          uid: v.uid,
          username: v.username,
          num: v.num,
          target: v.target,
          targetid: v.targetid,
          wtype: v.wtype,
          ntype: v.ntype,
          oamount: v.oamount,
          namount: v.namount,
          note: v.note,
          dtime: v.dtime,
          action: v.action,
          actionid: v.actionid
        };
      });

      await coinLogModelRepository.bulkCreate(ws, { transaction });
      transaction.commit();
    } catch (e) {
      await transaction?.rollback();
    }
  }
}
export const coinLogStroe = new CoinlogStore();
