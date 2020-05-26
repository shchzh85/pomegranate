
import * as _ from 'lodash';

import BaseStore from './base.store';
import { c2cOrderRepository } from '@models/index';

export enum OrderStatus {
  SELL = 1,
  BUY = 2,
  MATCH = 3,
  PAID = 4,
  DONE = 5,
  REVOKED = -1
}

class C2COrderStore extends BaseStore {

  private getOrderId() {
    const now = new Date();
    return 'GS'/* TODO */;
  }

  public async findOne(params: {
    toid?: number | string;
    status: number;
    id?: number;
  }) {
    const { toid, status, id } = params;
    const where: any = {};
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
}

export const c2cOrderStore = new C2COrderStore();
