
import * as _ from 'lodash';
import { Transaction, UniqueConstraintError } from 'sequelize';
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

  public async create(params: RegisterParams) {
    const { username, password, dpassword, invitecode } = params;
    const parent = await userRepository.findOne({ where: { invitecode } });
    if (!parent)
      throw new Exception(ErrCode.INVALID_INVITE_CODE, '邀请码未找到');
    
    let transaction: Transaction;
 
    do {
        const code = _.random(10000000, 99999999);
        try {
            transaction = await sequelize.transaction();
            const u = await userRepository.create({
                username, password, dpassword, invitecode: code
            }, { transaction });

            await transaction.commit();
            return u;
        } catch (e) {
            await transaction?.rollback();
            if (e instanceof UniqueConstraintError) {
                console.log(e.fields);
                throw new Exception(ErrCode.USERNAME_EXIST, '账号已存在');
            }

            throw new Exception(e.code || ErrCode.SERVER_ERROR, e.code ? e.message : 'server error.');
        }
    } while (true);
  }
}

export const userStore = new UserStore();