import * as _ from 'lodash';
import BaseService from './base.service';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import {
  redisStore,
  bannerStore,
  newsStore,
  businessCollegeStore,
  userStore,
  walletStore,
  CoinType,
  coinLogStore
} from '@store/index';
import { qrcodeStore } from '@store/qrcode.store';
import { resUrl } from '@common/utils/url.utils';
import {sequelize} from '@common/dbs';

class ApiService extends BaseService {

  public banners() {
    return redisStore.remember('news_banners', async () => {
      const list = await bannerStore.list();
      list.forEach(v => v.banner = resUrl(v.banner));
      return list;
    });
  }

  public async news(params: any) {
    const start = _.defaultTo(params.start, 1);
    const len = _.defaultTo(params.len, 5);
    const offset = (start - 1) * len;
    const key = 'cy:news:p' + start + '_' + len;
    const list = await redisStore.remember(key, async () => {
      const news = await newsStore.list(offset, len);
      news.forEach(v => v.content = v.content.replace(/[\n|\r|\r\n]/g, '').replace(/<[^>]*>/g, ''));
      return news;
    }, 2000);

    return { start, len, list };
  }

  public async newsDetail(params: any) {
    const { id } = params;
    const key = 'cy:news:' + id;
    const news = await redisStore.remember(key, async () => {
      const ret = await newsStore.findById(id);
      if (!ret)
        throw new Exception(Code.SERVER_ERROR, '新闻不存在');

      return ret;
    });

    return news;
  }

  public businessCollege() {
    const key = 'cy:business_college';
    return redisStore.remember(key, async () => {
      const list = await businessCollegeStore.list();
      list.forEach(v => {
        v.cover = resUrl(v.cover);
        v.audio = resUrl(v.audio);
      });
      return list;
    });
  }

  public kefuQrcode() {
    const key = 'cy:kefu_qrcode';
    return redisStore.remember(key, async () => {
      const ret = await qrcodeStore.findOne();
      if (!ret) return null;
      ret.qrcode = resUrl(ret.qrcode);
      return ret;
    });
  }
  public async qrcodePayment(uid: number, params: any) {
    const { businessId, payPassword, payNumber} = params;
    const user = await userStore.findById(uid);
    if (user == null) {
      throw new Exception(Code.USER_NOT_FOUND, '用户没找到');
    }

    if (! userStore.checkPayPassword(user, payPassword)) {
      throw new Exception(Code.INVALID_PAY_PASSWORD, '支付密码不正确');
    }

    if (businessId == uid) {
      throw new Exception(Code.INVALID_PAY_NUM, '不能给自己转账');
    }
    const businessUser = await userStore.findById(businessId);
    if (businessUser == null) {
      throw new Exception(Code.USER_NOT_FOUND, '商家用户没找到');
    }
    if (! businessUser.is_payee) {
      throw new Exception(Code.USER_NOT_PAYEE, '商户没有收款权限');
    }
    const userWallet = await walletStore.find(user.id, CoinType.ACTIVE);
    if (! userWallet) {
      throw new Exception(Code.WALLET_NOT_FOUND, '付款用户的钱包没找到1');
    }
    const businessUserWallet = await walletStore.find(businessUser.id, CoinType.ACTIVE);
    if (! businessUserWallet) {
      throw new Exception(Code.WALLET_NOT_FOUND, '商户用户的钱包没找到1');
    }
    let transaction;
    try {
      transaction = await sequelize.transaction();
      // 0. 扣钱
      const paid = await walletStore.pay(uid, CoinType.ACTIVE, payNumber, transaction);
      if (!paid) {
        throw new Exception(Code.BALANCE_NOT_ENOUGH, '流通金种子余额不足');
      }
      // 1.商家收钱
      const accepted = await walletStore.accept(businessUser.id, CoinType.ACTIVE, payNumber, transaction);
      if (! accepted) {
        throw new Exception(Code.SERVER_ERROR, '收款失败');
      }
      // 2、查询操作后余额
      const userWalletAfter = await walletStore.find(user.id, CoinType.ACTIVE);
      if (! userWalletAfter) {
        throw new Exception(Code.WALLET_NOT_FOUND, '付款用户的钱包没找到');
      }
      const businessUserWalletAfter = await walletStore.find(businessUser.id, CoinType.ACTIVE);
      if (! businessUserWalletAfter) {
        throw new Exception(Code.WALLET_NOT_FOUND, '商户用户的钱包没找到');
      }
      const logs = [
        {
          'uid': user.id,
          'username': user.username,
          'target': businessUser.username,
          'targetid': businessUser.id,
          'wtype': CoinType.ACTIVE,
          'ntype': CoinType.BANK,
          'oamount': userWallet.num, // 操作前余额
          'num': payNumber,
          'namount': userWalletAfter.num, // 操作后余额
          'note': 'A0008',
          'action': 'qrcodePayment',
          'actionid': userWalletAfter.id,
        },
        {
          'uid': businessUser.id,
          'username': businessUser.username,
          'target': user.username,
          'targetid': user.id,
          'wtype': CoinType.ACTIVE,
          'ntype': CoinType.BANK,
          'oamount': businessUserWallet.num, // 操作前余额
          'num': payNumber,
          'namount': businessUserWalletAfter.num, // 操作后余额
          'note': 'A0007', // 转入
          'action': 'qrcodePayment', // 操作函数
          'actionid': businessUserWalletAfter.id, // 操作记录的id
        }
      ];

      const createResult = await coinLogStore.bulkCreate(logs, transaction);
      if (_.isEmpty(createResult)) {
        throw new Exception(Code.SERVER_ERROR, '创建流水失败');
      }

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }
}

export const apiService = new ApiService();
