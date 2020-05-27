
import BaseService from './base.service';
import { configStore, userStore, c2cOrderStore, OrderStatus, DealStatus, dealStore, walletStore } from '@store/index';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { md5 } from '@common/utils';
import { sequelize } from '@common/dbs';

class SeedsC2CService extends BaseService {

  public async c2cbuy(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const buyMax = await configStore.getNumber('buyMax', 20000);
    const buyMin = await configStore.getNumber('buyMin', 5);
    const { num, dpassword } = params;
    if (num < buyMin)
      throw new Exception(ErrCode.BAD_PARAMS, '最小数量不能低于' + buyMin);
    if (num > buyMax)
      throw new Exception(ErrCode.BAD_PARAMS, '最大数量不能超过' + buyMax);
    if (user.dpassword !== md5(dpassword))
      throw new Exception(ErrCode.BAD_PARAMS, '交易密码错误');
    if (user.ustatus === 1)
      throw new Exception(ErrCode.USER_LOCKED, '用户已冻结');
    if (user.shiming !==2)
      throw new Exception(ErrCode.USER_NOT_AUTHORIZED, '用户尚未完成实名');
    
    const matchOrder = await c2cOrderStore.findOne({
      toid: user.id,
      status: OrderStatus.MATCH
    });
    if (matchOrder)
      throw new Exception(ErrCode.ORDER_NOT_PAY, '存在未付款,禁止购买');

    const activeBuyOrder = await dealStore.findActiveBuyOrder(uid);
    if (activeBuyOrder)
      throw new Exception(ErrCode.ORDER_BUY_EXISTS, '存在买单,禁止购买');

    const price = await configStore.getNumber('c2cPrice', 0.35);

    const now = new Date().getTime();
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

  public async c2cSellit(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid, dpassword } = params;
    if (user.dpassword !== md5(dpassword))
      throw new Exception(ErrCode.BAD_PARAMS, '交易密码错误');
    if (user.ustatus === 1)
      throw new Exception(ErrCode.USER_LOCKED, '用户已冻结');
    if (user.shiming !==2)
      throw new Exception(ErrCode.USER_NOT_AUTHORIZED, '用户尚未完成实名');
    if (user.zhitui_num < 1)
      throw new Exception(ErrCode.INVALID_OPERATION, '尚无有效直推用户，交易失败');

    const order = await dealStore.findActiveOrderById(oid);
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在');
    if (uid == user.id)
      throw new Exception(ErrCode.INVALID_OPERATION, '自己不能购买自己的订单');

    if (user.c2c_flg == 1)
      user.fee = 0;

    const wallet = await walletStore.find(user.id, 1);
    if (!wallet)
      throw new Exception(ErrCode.WALLET_NOT_FOUND, '钱包未找到');

    const total = order.num * (1 + user.fee);
    if (wallet.num < total)
      throw new Exception(ErrCode.BALANCE_NOT_ENOUGH, '余额不足');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      // 0. 扣钱
      const paid = await walletStore.pay(uid, 1, total, transaction);
      if (!paid)
        throw new Exception(ErrCode.BALANCE_NOT_ENOUGH, '余额不足');

      // 1. 增加每日卖出次数
      const inc = await userStore.addSellTimes(uid, transaction);
      if (!inc)
        throw new Exception(ErrCode.INVALID_OPERATION, '卖出次数达到上限');

      const now = Date.now();
      // 2. 写入order
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
      });

      // 3. 更新deal
      const deal = await dealStore.deal(oid, order.num);
      if (!deal)
        throw new Exception(ErrCode.INVALID_OPERATION, '订单金额不够');

      // 4. coin log, TODO

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async cxdd(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid } = params;
    if (user.ustatus === 1)
      throw new Exception(ErrCode.USER_LOCKED, '用户已冻结');

    const order = await dealStore.findActiveOrderById(oid);
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在');
    if (order.uid != uid)
      throw new Exception(ErrCode.INVALID_OPERATION, '不是你的订单');
    if (order.paytype == 'sell')
      throw new Exception(ErrCode.INVALID_OPERATION, '卖单无法撤销!');

    const up = await dealStore.updateStatus(oid, DealStatus.REVOKED);
    if (!up)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在');
  }

  public async c2cPay(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid, dpassword, img } = params;
    if (user.dpassword !== md5(dpassword))
      throw new Exception(ErrCode.BAD_PARAMS, '交易密码错误');

    const order = await c2cOrderStore.findOne({
        id: oid,
        status: OrderStatus.MATCH,
        toid: uid
    });
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在或状态变化');

    const paid = await c2cOrderStore.pay(oid, img);
    if (!paid)
      throw new Exception(ErrCode.INVALID_OPERATION, '订单更新失败');
  }

  public async c2cConfirm(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid, dpassword } = params;
    if (user.ustatus === 1)
      throw new Exception(ErrCode.USER_LOCKED, '用户已冻结');
    if (user.dpassword !== md5(dpassword))
      throw new Exception(ErrCode.BAD_PARAMS, '交易密码错误');

    const order = await c2cOrderStore.findOne({
      id: oid, status: OrderStatus.PAID, uid
    });
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const up = await c2cOrderStore.confirm(oid, uid, transaction);
      if (!up)
        throw new Exception(ErrCode.INVALID_OPERATION, '订单更新失败');

      const accepted = await walletStore.accept(order.toid, order.cid, order.num, transaction);
      if (!accepted)
        throw new Exception(ErrCode.SERVER_ERROR, '收款失败');

      // TODO: coin log

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async c2cRevoke(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid } = params;
    if (user.weifukuan_num >= 3)
      throw new Exception(ErrCode.INVALID_OPERATION, '今日撤单次数已达上限');

    const order = await c2cOrderStore.findOne({
      id: oid, status: OrderStatus.MATCH, uid
    });
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const revoked = await c2cOrderStore.revoke(oid, transaction);
      if (!revoked)
        throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单撤销失败');

      const accepted = await walletStore.accept(order.uid, order.cid, order.num * (1 + order.fee), transaction);
      if (!accepted)
        throw new Exception(ErrCode.SERVER_ERROR, '退款失败');

      const add = await userStore.addNotPayTimes(order.toid, transaction);
      if (!add)
        throw new Exception(ErrCode.SERVER_ERROR, '增加未付款次数失败');

      // TODO: coin log

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  public async c2cComplaint(uid: string, params: any) {
    const user = await userStore.findById(uid);
    const { oid } = params;
    if (user.ustatus === 1)
      throw new Exception(ErrCode.USER_LOCKED, '用户已冻结');

    const order = await c2cOrderStore.find({
      id: oid, status: [ OrderStatus.MATCH, OrderStatus.PAID ], uid
    });
    if (!order)
      throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单不存在或状态变化');

    let transaction;
    try {
      transaction = await sequelize.trasaction();
      const up = await c2cOrderStore.complaint(oid, uid, transaction);
      if (!up)
        throw new Exception(ErrCode.ORDER_NOT_FOUND, '订单投诉失败');
  
      const freezed = await userStore.freeze([ order.uid, order.toid ], uid + '投诉', transaction)
      if (!freezed)
        throw new Exception(ErrCode.USER_LOCK_FAILED, '冻结用户失败');

      await transaction.commit();
    } catch (e) {
      await transaction?.rollback();
      throw e;
    }
  }

  
}

export const seedC2CService = new SeedsC2CService();
