
import * as _ from 'lodash';
import { Transaction } from 'sequelize';
import BaseStore from './base.store';
import { coinLogRepository } from '@models/index'

interface CoinLogParams {
  uid: number;
  username: string;
  num: number;
  target: string;
  targetid: number;
  wtype: number;
  ntype: number;
  oamount: number;
  namount: number;
  note: string;
  action: string;
  actionid: number;
}

class CoinlogStore extends BaseStore {

  public bulkCreate(data: CoinLogParams[], transaction?: Transaction) {
    const now = new Date();
    const logs = data.map(v => { return { ...v, dtime: now } });
    return coinLogRepository.bulkCreate(logs, { transaction });
  }
}

export const coinLogStroe = new CoinlogStore();
