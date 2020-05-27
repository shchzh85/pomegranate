
import * as _ from 'lodash';
import { Op } from 'sequelize';
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

  public findActiveOrderById(id: number) {
    return dealRepository.findOne({
      where: { id, status: { [Op.lt]: DealStatus.DONE } }
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

    return dealRepository.findAndCount({ where, offset, limit, order: [ 'price' ] });
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
  }) {
    const data = { ...params, amount: params.num * params.price, all_num: params.num };
    return dealRepository.create(data);
  }

  public async deal(id: number, cnt: number) {
    const [ affectedCount ] = await dealRepository.update({
      num: Sequelize.literal('num-' + cnt)
    }, {
      where: { id, num: { [Op.gte]: cnt } }
    });

    return affectedCount === 1;
  }

  public async updateStatus(id: number, status: number) {
      const [ affectedCount ] = await dealRepository.update({
          status
      }, { where: { id } });

      return affectedCount === 1;
  }
}

export const dealStore = new DealStore();
