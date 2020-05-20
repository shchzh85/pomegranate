
import * as _ from 'lodash';
import { Transaction, UniqueConstraintError, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { userRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { sequelize } from '@common/dbs';

export interface RegisterParams {
  username: string;
  password: string;
  dpassword: string;
  invitecode: string;
}

class UserStore extends BaseStore {

  // 注册store
  public async create(params: RegisterParams) {
    const { username, password, dpassword, invitecode } = params;
    const parent = await userRepository.findOne({ where: { invitecode } });
    if (!parent)
      throw new Exception(ErrCode.INVALID_INVITE_CODE, '邀请码未找到');

    const ids = parent.tops.split(',');
    ids.push(parent.id);

    do {
      // 邀请码
      const code = _.random(10000000, 99999999);
      let transaction;
      try {
        transaction = await sequelize.transaction();
        const u = await userRepository.create({
          username, password, dpassword, invitecode: code,
          pid: parent.id, tops: parent.tops + ',' + parent.id
        }, { transaction });

        const up = await userRepository.update({
          group_member_num: Sequelize.literal('group_member_num+1')
        }, { where: { id: { [Op.in]: ids } }, transaction });

        // TODO: create wallet here

        await transaction.commit();
        return u;
      } catch (e) {
        await transaction?.rollback();
        if (e instanceof UniqueConstraintError) {
          if (_.get(e.fields, 'username'))
            throw new Exception(ErrCode.USERNAME_EXIST, '账号已存在');
          else if (_.get(e.fields, 'invitecode'))
            continue;
        }

        throw new Exception(e.code || ErrCode.SERVER_ERROR, e.code ? e.message : 'server error.');
      }
    } while (true);
  }

  /**
   * applogin
   */
  public async walletCreate() {

    const wallets = await userRepository.findAndCountAll();

    console.log('进入了User store!');

    console.log(wallets.rows);

  }
}

export const userStore = new UserStore();
