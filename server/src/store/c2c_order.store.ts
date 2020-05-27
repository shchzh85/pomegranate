
import * as _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import BaseStore from './base.store';
import { c2cOrderRepository } from '@models/index';

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
    return 'GS'/* TODO */;
  }

  public async findOne(params: {
    uid?: string;
    toid?: number | string;
    status?: number | number[];
    id?: number;
  }) {
    const { uid, toid, status, id } = params;
    const where: any = {};
    if (!_.isNil(uid))
      _.assign(where, { uid });
    if (!_.isNil(toid))
      _.assign(where, { toid });
    if (!_.isNil(status))
      _.assign(where, { status });
    if (!_.isNil(id))
      _.assign(where, { id });

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
  }) {
    const data = {
      ...params,
      order_id: this.getOrderId(),
      amount: params.num * params.price
    };

    return c2cOrderRepository.create(data);
  }

  public async pay(id: number, img: string) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.PAID, img
    }, {
      where: { id, status: OrderStatus.MATCH }
    });

    return affectedCount === 1;
  }

  public async confirm(id: number, uid: string, transaction?: Transaction) {
    const now = Date.now();
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.DONE, sktime: now
    }, {
      where: { id, status: OrderStatus.PAID, uid },
      transaction
    });

    return affectedCount === 1;
  }

  public async revoke(id: number, transaction?: Transaction) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.REVOKED
    }, {
      where: { id, status: OrderStatus.MATCH },
      transaction
    });

    return affectedCount === 1;
  }

  public async complaint(id: number, uid: string, transaction?: Transaction) {
    const [ affectedCount ] = await c2cOrderRepository.update({
      status: OrderStatus.COMPLAINT, fktime: Date.now()
    }, {
      where: { id, uid, status: [ OrderStatus.MATCH, OrderStatus.PAID ] },
      transaction
    });

    return affectedCount === 1;
  }

  public listUserOrders(uid: string, offset: number, limit: number) {
    return c2cOrderRepository.findAndCount({
      where: {
        [Op.or]: [ { uid }, { toid: uid } ],
        status: { [Op.gt]: 0 }
      },
      offset, limit,
      order: [ 'dtime', 'DESC' ]
    });
  }
}

export const c2cOrderStore = new C2COrderStore();
