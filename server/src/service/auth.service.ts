
import * as _ from 'lodash';
import BaseService from './base.service';
import { userStore } from '@store/index';
import { prepay, checkNotifySign, checkResponseSign, getToken, getResult } from '@common/aliyun';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { authStore, AuthStatus, FACE_MAX_TIMES } from '@store/auth.store';

const dateFormat = require('dateformat');

class AuthService extends BaseService {
  private getOrderId(uid: string) {
    const now = new Date();
    const [ x, n ] = process.hrtime();
    const m = ('' + n).substr(0, 6);
    return 'AP' + dateFormat(now, 'yyyymmddHHMMss') + m + _.random(100, 999) + uid;
  }

  public async doPrepay(uid: string) {
    const user = await userStore.findById(uid);
    if (!user)
      throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

    if (user.shiming == 2)
      throw new Exception(Code.OPERATION_FORBIDDEN, '用户已实名');

    const exists = await authStore.findCanCheck(uid);
    if (exists)
      return { order: exists };

    const orderid = this.getOrderId(uid);
    const order = await authStore.create(uid, user.username, orderid);

    const url = prepay(orderid, 0.01, 'http://120.24.52.2:9000/v1/auth/orderNotify');
    return { url };
  }

  public async orderNotify(data: any) {
    const { out_trade_no, trade_no, total_amount } = data;
    const checked = checkNotifySign(data);
    if (!checked)
      console.log('orderNotify checkNotifySign fail');

    await authStore.pay(out_trade_no);
  }

  public async orderResult(uid: string, data: any) {
    const { orderid, rawdata } = data;
    const checked = checkResponseSign(rawdata);
    if (checked)
      await authStore.pay(orderid);
  }

  public getOrder(uid: string) {
    return authStore.findCanCheck(uid);
  }
  
  public async faceToken(uid: string, params: any) {
    const { orderid } = params;
    const order = await authStore.findByOrderId(orderid);
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单未找到');

    if (Number(uid) != order.uid)
      throw new Exception(Code.SERVER_ERROR, '用户ID和订单不匹配');

    if (order.status != AuthStatus.PAID)
      throw new Exception(Code.SERVER_ERROR, '订单未支付');

    if (order.facetimes >= FACE_MAX_TIMES)
      throw new Exception(Code.SERVER_ERROR, '超过最大尝试次数');

    const { RequestId, VerifyToken } = await getToken(orderid);
    if (_.isNil(VerifyToken))
      throw new Exception(Code.SERVER_ERROR, '获取Token失败');

    const up = await authStore.setToken(orderid, VerifyToken);
    if (!up)
      throw new Exception(Code.SERVER_ERROR, '保存Token失败');

    return { token: VerifyToken };
  }

  public async faceResult(uid: string, params: any) {
    const { orderid } = params;
    const order = await authStore.findByOrderId(orderid);
    if (!order)
      throw new Exception(Code.ORDER_NOT_FOUND, '订单未找到');

    if (Number(uid) != order.uid)
      throw new Exception(Code.SERVER_ERROR, '用户ID和订单不匹配');

    const { VerifyStatus, Material } = await getResult(orderid);
    if (VerifyStatus !== "1")
      throw new Exception(Code.SERVER_ERROR, '认证失败: VerifyStatus=' + VerifyStatus);

    const { IdCardName, IdCardNumber } = Material;
    await authStore.done(orderid, IdCardNumber, IdCardName);

    const exists = await userStore.findByCardNo(IdCardNumber);
    if (exists && uid != exists.id)
      throw new Exception(Code.SERVER_ERROR, '身份证号和其他用户冲突');

    await userStore.authorized(uid, IdCardNumber);
  }
}

export const authService = new AuthService();
