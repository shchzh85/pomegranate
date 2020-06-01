
import * as _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import BaseStore from './base.store';
import { c2cOrderRepository } from '@models/index';

const dateFormat = require('dateformat');

export enum OrderStatus {
  SELL = 1,
  BUY = 2,
  MATCH = 3,
  PAID = 4,
  DONE = 5,
  COMPLAINT = 6,
  REVIEW = 7,
  REVOKED = -1
}

class C2COrderStore extends BaseStore {

  private getOrderId() {
    const now = new Date();
    const [ x, n ] = process.hrtime();
    const m = ('' + n).substr(0, 6);
    return 'GS' + dateFormat(now, 'yyyymmddHHMMss') + m + _.random(100, 999);
  }

  public async findOne(params: {
    uid?: string;
    toid?: number | string;
    status?: number | number[];
    orderid?: string;
  }) {
    const { uid, toid, status, orderid } = params;
    const where: any = {};
    if (!_.isNil(uid))
      _.assign(where, { uid });
    if (!_.isNil(toid))
      _.assign(where, { toid });
    if (!_.isNil(status))
      _.assign(where, { status });
    if (!_.isNil(orderid))
      _.assign(where, { orderid });

    return await c2cOrderRepository.findOne({ where });
  }

  public create(params: {
    uid: string,
    uname: string,
    toname: string,
    toid: number,
    buypid: number,
    sellpid: number,
    num: number,
    price: number,
    fee: number,
    status: number,
    dtime: number,
    paytype: string,
    cid: number
  }, transaction?: Transaction) {
    const data = {
      ...params,
      orderid: this.getOrderId(),
      amount: params.num * params.price
    };

    return c2cOrderRepository.create(data, { transaction });
  }

  public async pay(orderid: string, imgs: string) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.PAID, imgs, fktime: Math.floor(Date.now() / 1000)
    }, {
      where: { orderid, status: OrderStatus.MATCH }
    });

    return affectedCount === 1;
  }

  public async confirm(orderid: string, uid: string, transaction?: Transaction) {
    const now = Math.floor(Date.now() / 1000);
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.DONE, sktime: now
    }, {
      where: { orderid, status: OrderStatus.PAID, uid },
      transaction
    });

    return affectedCount === 1;
  }

  public async revoke(orderid: string, transaction?: Transaction) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.REVOKED
    }, {
      where: { orderid, status: OrderStatus.MATCH },
      transaction
    });

    return affectedCount === 1;
  }

  public async complaint(orderid: string, uid: string, transaction?: Transaction) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.COMPLAINT, fktime: Math.floor(Date.now() / 1000)
    }, {
      where: { orderid, uid, status: [ OrderStatus.MATCH, OrderStatus.PAID ] },
      transaction
    });

    return affectedCount === 1;
  }

  public listUserOrders(uid: string, offset: number, limit: number) {
    return c2cOrderRepository.findAndCountAll({
      where: {
        [Op.or]: [ { uid }, { toid: uid } ],
        status: { [Op.gt]: 0 }
      },
      offset, limit,
      order: [ ['dtime', 'DESC'] ]
    });
  }
}

export const c2cOrderStore = new C2COrderStore();
