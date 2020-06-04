
import * as _ from 'lodash';
import { Transaction } from 'sequelize';
import BaseStore from './base.store';
import { coinLogRepository } from '@models/index'

export enum CoinLogNType {
  ADD = 1,
  DEC = 2
}

export interface CoinLogParams {
  uid: number | string;
  username: string;
  num: number;
  target?: string;
  targetid?: number;
  wtype: number;  // coinid
  ntype: number;  // 1增加，2减少
  oamount: number;  // 转帐前余额
  namount: number;  // 转账后余额
  note: string;     // 中文类型
  action: string;   // 函数名
  actionid: number; // wallet id
}

class CoinlogStore extends BaseStore {

  public bulkCreate(data: CoinLogParams[], transaction?: Transaction) {
    const now = new Date();
    const logs = data.map(v => { return { ...v, dtime: now } });
    return coinLogRepository.bulkCreate(logs, { transaction });
  }

  public create(data: CoinLogParams, transaction?: Transaction) {
    return coinLogRepository.create({ ...data, dtime: new Date() }, { transaction });
  }
}

export const coinLogStore = new CoinlogStore();
