
import * as _ from 'lodash';
import { UniqueConstraintError, Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { userRepository, coinKindRepository, walletRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { sequelize } from '@common/dbs';
import { md5 } from '@common/utils';
import { redisStore } from './redis.store';

export interface RegisterParams {
  username: string;
  password: string;
  dpassword: string;
  invitecode: string;
}

class UserStore extends BaseStore {

  public findById(uid: string) {
    return userRepository.findByPk(Number(uid));
  }

  public async create(params: RegisterParams) {
    const { username, password, dpassword, invitecode } = params;
    const parent = await userRepository.findOne({ where: { invitecode } });
    if (!parent)
      throw new Exception(ErrCode.INVALID_INVITE_CODE, '邀请码未找到');

    const ids = parent.tops.split(',');
    ids.push(parent.id);

    const wallets = await coinKindRepository.findAll();
    if (_.isEmpty(wallets))
      throw new Exception(ErrCode.SERVER_ERROR, '钱包配置未找到');

    do {
      const code = _.random(10000000, 99999999);
      let transaction;
      try {
        transaction = await sequelize.transaction();
        const u = await userRepository.create({
          username,
          password: md5(password),
          dpassword: md5(dpassword),
          invitecode: code,
          pid: parent.id, tops: parent.tops + ',' + parent.id
        }, { transaction });

        const uid = u.id;
        const up = await userRepository.update({
          group_member_num: Sequelize.literal('group_member_num+1')
        }, { where: { id: { [Op.in]: ids } }, transaction });

        const ws = wallets.map(v => {
          return {
            uid,
            coinid: v.id,
            num: 0,
            address: 0,
            item1: 0,
            freeze: 0
          };
        });

        await walletRepository.bulkCreate(ws, { transaction });
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

  public async login(username: string, password: string) {
    const user = await userRepository.findOne({
      where: { username }
    });

    if (!user)
      throw new Exception(ErrCode.USERNAME_NOT_FOUND, '账号不存在');

    if (md5(password) !== user.password)
      throw new Exception(ErrCode.INVALID_PASSWORD, '密码错误');

    return user;
  }

  public async logout() {

  }

  public async updateLoginPasswd(uid: string, password: string, dpassword: string) {
    const [rows] = await userRepository.update({ password }, {
      where: {
        id: uid,
        dpassword: md5(dpassword)
      }
    });

    return rows === 1;
  }

  public async updateTradePasswd(uid: string, yzm: string, dpassword: string) {
    const [rows] = await userRepository.update({ dpassword }, {
      where: {
        id: uid,
        ddpassword: md5(dpassword)
      }
    });

    return rows === 1;
  }

  public async forgotPassword(uid: string, password: string) {

    var utime = redisStore.get(uid).utime;
    const [rows] = await userRepository.update({ password }, {
      where: {
        id: uid,
        password: md5(password + utime)
      }
    });

    if (rows === 0) {
      throw new Exception(ErrCode.SERVER_ERROR, '用户不存在');
    }

    return rows === 1;
  }

  public async addSunshine(uids: string[], cnt: number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      sunshine: Sequelize.literal('sunshine+' + cnt)
    }, {
      where: { id: uids },
      transaction
    });

    return affectedCount === _.size(uids);
  }

  public async addSunshine1(uids: string[], cnt: number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      sunshine_1: Sequelize.literal('sunshine_1+' + cnt)
    }, {
      where: { id: uids },
      transaction
    });

    return affectedCount === _.size(uids);
  }

  public async getSunshine2(pid: string) {
    const us = await userRepository.findAll({
      attributes: [ 'sunshine', 'sunshine_1' ],
      where: { pid }
    });

    const cnt = _.size(us);
    if (cnt <= 2)
      return 0;

    const scores = us.map(u => u.sunshine + u.sunshine_1).slice(2);
    return _.sum(scores);
  }
}

export const userStore = new UserStore();
