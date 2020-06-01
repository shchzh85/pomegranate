
import * as _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import BaseStore from './base.store';
import { dealRepository } from '@models/index';
import { Sequelize } from 'sequelize-typescript';

export enum DealStatus {
  INIT = 0,
  PARTIAL = 1,
  DONE = 2,
  REVOKED = 9
}

class DealStore extends BaseStore {

  public findActiveBuyOrder(uid: string) {
    return dealRepository.findOne({
      where: { uid, paytype: 'buy', status: { [Op.lt]: DealStatus.DONE } }
    });
  }

  public findActiveOrderById(orderid: string) {
    return dealRepository.findOne({
      where: { orderid, status: { [Op.lt]: DealStatus.DONE } }
    });
  }

  public async list(params: {
    paytype: string,
    uname?: string,
    offset: number,
    limit: number
  }) {
    const { paytype, uname, offset, limit } = params;
    const where: any = { paytype, status: { [Op.lt]: DealStatus.DONE } };
    if (!_.isNil(uname))
      _.assign(where, { uname });

    return dealRepository.findAndCountAll({ where, offset, limit, order: [ 'price' ] });
  }

  public create(params: {
    uid: string,
    uname: string,
    price: number,
    num: number,
    sxf: number,
    status: number,
    dtime: number,
    stime: number,
    cid: number,
    paytype: string,
    orderid: number
  }, transaction?: Transaction) {
    const data = { ...params, amount: params.num * params.price, all_num: params.num };
    return dealRepository.create(data, { transaction });
  }

  public async deal(orderid: number, cnt: number, transaction?: Transaction) {
    const [ affectedCount ] = await dealRepository.update({
      num: Sequelize.literal('num-' + cnt),
      status: DealStatus.DONE
    }, {
      where: { orderid, num: { [Op.gte]: cnt } },
      transaction
    });

    return affectedCount === 1;
  }

  public async updateStatus(orderid: number, status: number, transaction?: Transaction) {
      const [ affectedCount ] = await dealRepository.update({
          status
      }, { where: { orderid }, transaction });

      return affectedCount === 1;
  }

  public sumInit() {
    return dealRepository.sum('num', { where: { status: 0 } });
  }
}

export const dealStore = new DealStore();
