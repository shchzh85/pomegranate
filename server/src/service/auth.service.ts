
import * as _ from 'lodash';
import BaseService from './base.service';
import { prepay } from '@common/aliyun';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';

const dateFormat = require('dateformat');

class AuthService extends BaseService {
  private getOrderId() {
    const now = new Date();
    const [ x, n ] = process.hrtime();
    const m = ('' + n).substr(0, 6);
    return 'AP' + dateFormat(now, 'yyyymmddHHMMss') + m + _.random(100, 999);
  }

  public async doPrepay(uid: string) {

    // 1. 判断是否已实名

    // 2. alipay sdk prepay

    const orderid = this.getOrderId();

    console.log('orderid: ' + orderid);
    await prepay(orderid, 0.01, 'http://120.24.52.2:9000/v1/auth/orderNotify');
  }


  public async verifyToken(uid: string, orderid: string) {
    // 1. 从支付订单里查到orderid

    // 2. getToken
  }

  public async verifyResult(uid: string, orderid: string) {
    
  }
}

export const authService = new AuthService();
