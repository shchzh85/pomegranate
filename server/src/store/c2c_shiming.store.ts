import BaseStore from './base.store';
import { Op } from 'sequelize';
import { c2cShimingRepository } from '@models/index';

class C2CShimingStore extends BaseStore {

  public findByUid(uid: string | number) {
    return c2cShimingRepository.findOne({ where: { uid } });
  }

  public async findAll(uids: number[]) {
    return c2cShimingRepository.findAll({ where: { uid: uids } });
  }

  public create(params: {
    uid: string | number,
    username: string,
    mz: string,
    bank: string,
    zhihang: string,
    cardno: string,
    zfbimg: string,
    wximg: string,
    smdate: Date
  }) {
    return c2cShimingRepository.upsert(params);
  }
}

export const c2cShimingStore = new C2CShimingStore();
