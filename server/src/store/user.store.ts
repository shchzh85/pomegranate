
import * as _ from 'lodash';
import { UniqueConstraintError, Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { userRepository, coinKindRepository, walletRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { sequelize } from '@common/dbs';
import { md5 } from '@common/utils';
import { redisStore } from './redis.store';

export interface RegisterParams {
  username: string;
  password: string;
  dpassword: string;
  invitecode: string;
  scode: string;
}

class UserStore extends BaseStore {

  public findById(uid: string | number) {
    return userRepository.findByPk(Number(uid));
  }

  public findByUsername(username: string) {
    return userRepository.findOne({ where: { username } });
  }

  public async create(params: RegisterParams) {
    const { username, password, dpassword, invitecode } = params;
    const parent = await userRepository.findOne({ where: { invitecode } });
    if (!parent)
      throw new Exception(Code.INVALID_INVITE_CODE, '邀请码未找到');

    const ids = parent.tops.split(',');
    ids.push(parent.id);

    const wallets = await coinKindRepository.findAll();
    if (_.isEmpty(wallets))
      throw new Exception(Code.SERVER_ERROR, '钱包配置未找到');

    do {
      const code = _.random(10000000, 99999999);
      const now = Math.floor(Date.now() / 1000);
      let transaction;
      try {
        transaction = await sequelize.transaction();
        const u = await userRepository.create({
          username,
          password: md5(password + now),
          dpassword: md5(dpassword + now),
          invitecode: code,
          is_new: 1,
          uilang: 'zh',
          utime: now,
          lastlog: now,
          today_in_own: 0,
          pid: parent.id,
          tops: parent.tops + ',' + parent.id
        }, { transaction });

        const uid = u.id;
        const up = await userRepository.update({
          group_member_num: Sequelize.literal('group_member_num+1')
        }, { where: { id: ids }, transaction });

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
            throw new Exception(Code.USERNAME_EXIST, '账号已存在');
          else if (_.get(e.fields, 'invitecode'))
            continue;
        }

        throw new Exception(e.code || Code.SERVER_ERROR, e.code ? e.message : 'server error.');
      }
    } while (true);
  }

  public async login(username: string, password: string) {
    const user = await userRepository.findOne({
      where: { username }
    });

    if (!user)
      throw new Exception(Code.USERNAME_NOT_FOUND, '账号不存在');
    if (md5(password + user.utime) !== user.password)
      throw new Exception(Code.INVALID_PASSWORD, '密码错误');
    if (user.ustatus == 1)
      throw new Exception(Code.USER_LOCKED, '用户被冻结');

    const now = Math.floor(Date.now() / 1000);
    await userRepository.update({
      lastlog: now
    }, {
      where: { id: user.id }
    })

    return user;
  }

  public async logout() {

  }

  public async levelUp(uid: string, userlevel: number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      userlevel
    }, {
      where: { id: uid, userlevel: { [Op.lt]: userlevel } },
      transaction
    });

    return affectedCount === 1;
  }

  public async updateLoginPasswd(uid: string, password: string, dpassword: string) {
    const u = await userRepository.findByPk(uid);
    if (!u)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户不存在');

    if (md5(dpassword + u.utime) != u.dpassword)
      throw new Exception(Code.INVALID_PASSWORD, '交易密码错误');

    const [ rows ] = await userRepository.update({ password: md5(password + u.utime) }, {
      where: { id: uid }
    });

    return rows === 1;
  }

  public async updateTradePasswd(uid: string, dpassword: string, utime: number) {
    const [ rows ] = await userRepository.update({
      dpassword: md5(dpassword + utime)
    }, {
      where: { id: uid }
    });

    return rows === 1;
  }

  public async forgotPassword(username: string, password: string) {
    const u = await userRepository.findOne({ where: { username } });
    if (!u)
      throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

    const [ rows ] = await userRepository.update({
      password: md5(password + u.utime)
    }, {
      where: { id: u.id }
    });

    return rows === 1;
  }

  public async checkTradePassword(uid: string, password: string) {
    const u = await userRepository.findByPk(uid);
    if (!u)
      throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');
  
    return md5(password + u.utime) == u.dpassword;
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

  public async decSunshine(uids: string[], cnt: number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      sunshine: Sequelize.literal('sunshine-' + cnt)
    }, {
      where: { id: uids, sunshine: { [Op.gte]: cnt } },
      transaction
    });

    return affectedCount === _.size(uids);
  }

  public async decSunshine1(uid: string, cnt: number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      sunshine_1: Sequelize.literal('sunshine_1-' + cnt)
    }, {
      where: { id: uid, sunshine_1: { [Op.gte]: cnt } },
      transaction
    });

    return affectedCount === 1;
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

  public findAll(options?: any) {
    return userRepository.findAll(options);
  }

  public findAndCount(options?: any) {
    return userRepository.findAndCountAll(options);
  }

  public countChildrenCertificated(uid: string) {
    return userRepository.count({
      where: {
        pid: uid,
        shiming: 2
      }
    });
  }

  public async addSellTimes(uid: string, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      sell_times: Sequelize.literal('sell_times+1')
    },{
      where: { id: uid, sell_times: { [Op.lt]: 1000 } },
      transaction
    });

    return affectedCount === 1;
  }

  public async addNotPayTimes(uid: string | number, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      weifukuan_num: Sequelize.literal('weifukuan_num+1')
    },{
      where: { id: uid },
      transaction
    });

    return affectedCount === 1;
  }

  public async freeze(uids: number[], reason: string, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      ustatus: 1, reason
    }, {
      where: { id: uids },
      transaction
    });

    return affectedCount === _.size(uids);
  }

  public async setTaskCompleted(uid: string, transaction?: Transaction) {
    const [ affectedCount ] = await userRepository.update({
      today_in_own: 6
    }, { where: { id: uid, today_in_own: { [Op.lt]: 6 } }, transaction });

    return affectedCount === 1;
  }

  public async getTaskCompleted(uid: string) {
    const u = await this.findById(uid);
    if (!u)
      throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

    return u.today_in_own === 6;
  }
}

export const userStore = new UserStore();
