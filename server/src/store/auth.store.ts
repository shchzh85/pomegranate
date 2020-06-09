import * as _ from 'lodash';
import { UniqueConstraintError, Op, Transaction } from 'sequelize';
import BaseStore from './base.store';
import { authRepository } from '@models/index';
import { Sequelize } from 'sequelize-typescript';

export enum AuthStatus {
  REVOKED = -1,
  WAIT_PAY = 0,
  PAID = 1
}

export enum FaceStatus {
  INIT = 0,
  FAILED = 1,
  SUCCESS = 2
}

export const FACE_MAX_TIMES = 5;

class AuthStore extends BaseStore {

  public findCanCheck(uid: string) {
    return authRepository.findOne({
      where: {
        uid,
        status: AuthStatus.PAID,
        facetimes: { [Op.lt]: FACE_MAX_TIMES }
      }
    });
  }

  public findByOrderId(orderid: string) {
    return authRepository.findOne({
      where: {
        orderid
      }
    });
  }

  public create(uid: string, username: string, orderid: string) {
    return authRepository.create({
      uid,
      username,
      orderid
    });
  }

  public async pay(orderid: string) {
    const [ affectedCount ] = await authRepository.update({
      status: AuthStatus.PAID,
    }, {
      where: { orderid, status: AuthStatus.WAIT_PAY }
    });

    return affectedCount === 1;
  }

  public async setToken(orderid: string, token: string) {
    const [ affectedCount ] = await authRepository.update({
      facetimes: Sequelize.literal('facetimes+1'),
      token,
      facestatus: 0
    }, {
      where: {
        orderid,
        facetimes: { [Op.lt]: FACE_MAX_TIMES }
      }
    });

    return affectedCount === 1;
  }

  public async done(orderid: string, idcard: string, realname: string) {
    const [ affectedCount ] = await authRepository.update({
      idcard, realname
    }, {
      where: {
        orderid
      }
    });

    return affectedCount === 1;
  }
}

export const authStore = new AuthStore();
