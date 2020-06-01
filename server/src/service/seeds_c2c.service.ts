
import * as _ from 'lodash';
import BaseService from './base.service';
import { configStore, userStore, c2cOrderStore, OrderStatus, DealStatus, dealStore, walletStore } from '@store/index';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { md5 } from '@common/utils';
import { sequelize } from '@common/dbs';
import { c2cShimingStore } from '@store/c2c_shiming.store';
import { priceHistoryStore } from '@store/price_history.store';

class SeedsC2CService extends BaseService {

  public async buy(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const buyMax = await configStore.getNumber('buyMax', 20000);
    const buyMin = await configStore.getNumber('buyMin', 5);
    const { num, dpassword } = params;
    if (num < buyMin)
      throw new Exception(Code.BAD_PARAMS, '最小数量不能低于' + buyMin);
    if (num > buyMax)
      throw new Exception(Code.BAD_PARAMS, '最大数量不能超过' + buyMax);
    if (user.dpassword !== md5(dpassword + user.utime))
      throw new Exception(Code.BAD_PARAMS, '交易密码错误');
    if (user.ustatus === 1)
      throw new Exception(Code.USER_LOCKED, '用户已冻结');
    if (user.shiming !==2)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户尚未完成实名');
    
    const matchOrder = await c2cOrderStore.findOne({
      toid: user.id,
      status: OrderStatus.MATCH
    });
    if (matchOrder)
      throw new Exception(Code.ORDER_NOT_PAY, '存在未付款,禁止购买');

    const activeBuyOrder = await dealStore.findActiveBuyOrder(uid);
    if (activeBuyOrder)
      throw new Exception(Code.ORDER_BUY_EXISTS, '存在买单,禁止购买');

    const price = await configStore.getNumber('c2cPrice', 0.35);
    const now = Math.floor(Date.now() / 1000);

    // TODO: orderid should be unique
    const order = await dealStore.create({
      uid,
      uname: user.username,
      price,
      num,
      sxf: 0,
      status: 0,
      dtime: now,
      stime: 0,
      cid: 1,
      paytype: 'buy',
      orderid: now
    });

    return order;
  }

  public async sell(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const { oid, dpassword } = params;
    if (user.dpassword !== md5(dpassword + user.utime))
      throw new Exception(Code.BAD_PARAMS, '交易密码错误');
    if (user.ustatus === 1)
      throw new Exception(Code.USER_LOCKED, '用户已冻结');
    if (user.shiming !==2)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户尚未完成实名');
    if (user.zhitui_num < 1)
      throw new Exception(Code.INVALID_OPERATION, '尚无有效直推用户，交易失败');

    const order = await dealStore.findActiveOrderById(oid);
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在');
    if (user.id == order.uid)
      throw new Exception(Code.INVALID_OPERATION, '自己不能购买自己的订单');

    if (user.c2c_flg == 1)
      user.fee = 0;

    const wallet = await walletStore.find(user.id, 1);
    if (!wallet)
      throw new Exception(Code.WALLET_NOT_FOUND, '钱包未找到');

    const total = order.num * (1 + user.fee);
    if (wallet.num < total)
      throw new Exception(Code.BALANCE_NOT_ENOUGH, '余额不足');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      // 0. 扣钱
      const paid = await walletStore.pay(uid, 1, total, transaction);
      if (!paid)
        throw new Exception(Code.BALANCE_NOT_ENOUGH, '余额不足');

      // 1. 增加每日卖出次数
      const inc = await userStore.addSellTimes(uid, transaction);
      if (!inc)
        throw new Exception(Code.INVALID_OPERATION, '卖出次数达到上限');

      const now = Math.floor(Date.now() / 1000);
      // 2. 写入order, TODO: orderid should be unique
      await c2cOrderStore.create({
        uid,
        uname: user.username,
        toname: order.uname,
        toid: order.uid,
        buypid: order.id,
        sellpid: 0,
        num: order.num,
        price: order.price,
        fee: user.fee,
        status: OrderStatus.REVIEW,
        dtime: now,
        paytype: order.paytype,
        cid: 1
      }, transaction);

      // 3. 更新deal
      const deal = await dealStore.deal(oid, order.num, transaction);
      if (!deal)
        throw new Exception(Code.INVALID_OPERATION, '订单金额不够');

      // 4. coin log, TODO

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async cancel(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');
    if (user.ustatus === 1)
      throw new Exception(Code.USER_LOCKED, '用户已冻结');
    
    const { oid } = params;
    const order = await dealStore.findActiveOrderById(oid);
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在');
    if (order.uid != Number(uid))
      throw new Exception(Code.INVALID_OPERATION, '不是你的订单');
    if (order.paytype == 'sell')
      throw new Exception(Code.INVALID_OPERATION, '卖单无法撤销!');

    const up = await dealStore.updateStatus(oid, DealStatus.REVOKED);
    if (!up)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在');
  }

  public async pay(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const { oid, dpassword, img } = params;
    if (user.dpassword !== md5(dpassword + user.utime))
      throw new Exception(Code.BAD_PARAMS, '交易密码错误');

    const order = await c2cOrderStore.findOne({
        orderid: oid,
        status: OrderStatus.MATCH,
        toid: uid
    });
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在或状态变化');

    const paid = await c2cOrderStore.pay(oid, img);
    if (!paid)
      throw new Exception(Code.INVALID_OPERATION, '订单更新失败');
  }

  public async confirm(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const { oid, dpassword } = params;
    if (user.ustatus === 1)
      throw new Exception(Code.USER_LOCKED, '用户已冻结');
    if (user.dpassword !== md5(dpassword + user.utime))
      throw new Exception(Code.BAD_PARAMS, '交易密码错误');

    const order = await c2cOrderStore.findOne({
      orderid: oid, status: OrderStatus.PAID, uid
    });
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const up = await c2cOrderStore.confirm(oid, uid, transaction);
      if (!up)
        throw new Exception(Code.INVALID_OPERATION, '订单更新失败');

      const accepted = await walletStore.accept(order.toid, order.cid, order.num, transaction);
      if (!accepted)
        throw new Exception(Code.SERVER_ERROR, '收款失败');

      // TODO: coin log

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async revoke(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid } = params;
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    if (user.weifukuan_num >= 3)
      throw new Exception(Code.INVALID_OPERATION, '今日撤单次数已达上限');

    const order = await c2cOrderStore.findOne({
      orderid: oid, status: OrderStatus.MATCH, toid: uid
    });
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const revoked = await c2cOrderStore.revoke(oid, transaction);
      if (!revoked)
        throw new Exception(Code.ORDER_NOT_FOUND, '订单撤销失败');

      const accepted = await walletStore.accept(order.uid, order.cid, order.num * (1 + order.fee), transaction);
      if (!accepted)
        throw new Exception(Code.SERVER_ERROR, '退款失败');

      const add = await userStore.addNotPayTimes(order.toid, transaction);
      if (!add)
        throw new Exception(Code.SERVER_ERROR, '增加未付款次数失败');

      // TODO: coin log

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async complaint(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const { oid } = params;
    if (user.ustatus === 1)
      throw new Exception(Code.USER_LOCKED, '用户已冻结');

    const order = await c2cOrderStore.findOne({
      orderid: oid, status: [ OrderStatus.MATCH, OrderStatus.PAID ], uid
    });
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const up = await c2cOrderStore.complaint(oid, uid, transaction);
      if (!up)
        throw new Exception(Code.ORDER_NOT_FOUND, '订单投诉失败');
  
      const freezed = await userStore.freeze([ order.uid, order.toid ], uid + '投诉', transaction)
      if (!freezed)
        throw new Exception(Code.USER_LOCK_FAILED, '冻结用户失败');

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async getC2CList(uid: string, params: any) {
    const start = _.defaultTo(params.start, 0);
    const len = _.defaultTo(params.len, 10);
    const { listType, search } = params;
    const data: any = {
      paytype: listType,
      offset: start,
      limit: len
    }

    if (!_.isEmpty(search))
      _.assign(data, { uname: search });

    const { rows, count } = await dealStore.list(data);
    return { max: count, start, len, list: rows };
  }

  public async getC2COrder(uid: string, params: any) {
    const { oid } = params;
    const order: any = await c2cOrderStore.findOne({ orderid: oid });
    if (order) {
      const us = await c2cShimingStore.findAll([ order.uid, order.toid ]);
      order['seller'] = _.find(us, u => u.uid == order.uid);
      order['buyer'] = _.find(us, u => u.uid == order.toid);
    }

    return order;
  }

  public async getUserC2CList(uid: string, params: any) {
    const start = _.defaultTo(params.start, 0);
    const len = _.defaultTo(params.len, 10);
    const { rows, count } = await c2cOrderStore.listUserOrders(uid, start, len);
    return {
      max: count,
      list: rows,
      start, len
    };
  }

  public async cetificate(uid: string, params: any) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    const { dpassword, mz, bank, zhihang, cardno, img1, img2 } = params;
    if (user.dpassword !== md5(dpassword + user.utime))
      throw new Exception(Code.BAD_PARAMS, '交易密码错误');
      
    await c2cShimingStore.create({
      uid,
      username: user.username,
      mz,
      bank,
      zhihang,
      cardno,
      zfbimg: img1,
      wximg: img2,
      smdate: new Date()
    });
  }

  public async getSeller(uid: string, params: any) {
    const { oid } = params;
    const order: any = await c2cOrderStore.findOne({ orderid: oid });
    if (!order)
      return null;
      
    const us = await c2cShimingStore.findAll([ order.uid, order.toid ]);
    const seller = _.find(us, u => u.uid == order.uid);
    const buyer = _.find(us, u => u.uid == order.toid);

    if (!seller || !buyer)
      throw new Exception(Code.USER_NOT_FOUND, '用户不存在');

    return {
      oid,
      amount: order.amount,
      zfb: seller.zfbimg,
      mz: seller.mz,
      bankname: seller.bank,
      zhihang: seller.zhihang,
      cardno: seller.cardno
    };
  }

  public async getSeedPriceHis(uid: string, params: any) {
    const nowPrice = await configStore.getNumber('c2cPrice');
    return { nowPrice };
  }

  public async getCertification(uid: string, params: any) {
    const certification = await c2cShimingStore.findByUid(uid);
    return { certification };
  }

  public async getSeedPriceLine(uid: string, params: any) {
    const history = await priceHistoryStore.last(6);
    const all_buy = await dealStore.sumInit();

    return { history, all_buy };
  }
}

export const seedC2CService = new SeedsC2CService();
