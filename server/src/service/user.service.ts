
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import BaseService from './base.service';
import { userStore, RegisterParams, redisStore, userSessionStore, configStore, walletStore, CoinType } from '@store/index';
import { sendSms } from '@common/utils';
import { authStore } from '@store/auth.store';

const PREFIX = 'cy:session:';
const EXPIRE_SECONDS = 60 * 60 * 24;

class UserService extends BaseService {

  public async updateSession(uid: string, token: string) {
    const us = await userSessionStore.find(uid);
    if (us)
      await redisStore.del(PREFIX + us.token);

    await userSessionStore.update(uid, token);
    await redisStore.setex(PREFIX + token, '' + uid, EXPIRE_SECONDS);
  }

  public async getSession(token: string) {
    const uid = await redisStore.get(PREFIX + token);
    return !_.isEmpty(uid) ? { uid } : null;
  }

  public async destorySession(token: string) {
    const key = PREFIX + token;
    const uid = await redisStore.get(key);
    if (_.isEmpty(uid))
      return;

    await redisStore.del(key);
    await userSessionStore.destroy(uid, token);
  }

  public async register(params: RegisterParams) {
    const { username, scode } = params;

    const can = await configStore.getNumber('register', 0);
    if (can == 0)
      throw new Exception(Code.REGISTER_CLOSED, '注册关闭');

    const checked = await this.checkRegisterSMS(username, scode);
    if (!checked)
      throw new Exception(Code.INVALID_SMS_CODE, '验证码错误');

    return await userStore.create(params);
  }

  public async login(params: any) {
    const { version, username, password, yzm } = params;

    const webStatus = await configStore.getNumber('web_status');
    if (webStatus == 0)
      throw new Exception(Code.SERVER_ERROR, '服务器维护中');

    const ver = await configStore.get('version');
    if (version != ver)
      throw new Exception(Code.SERVER_ERROR, '版本已经更新,请手动下载最新版本！');

    // TODO: check captcha

    const user = await userStore.login(username, password);

    // TODO: get message

    const allConfig = await configStore.all();

    return { user, allConfig };
  }

  public async logout(uid: string) {

  }

  public async updateLoginPasswd(uid: string, params: any) {
    const { password, dpassword } = params;
    await userStore.updateLoginPasswd(uid, password, dpassword);
  }

  public async updateTradePasswd(uid: string, params: any) {
    const { dpassword, scode } = params;
    const u = await userStore.findById(uid);
    if (!u)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户不存在');

    const checked = await this.checkRegisterSMS(u.username, scode);
    if (!checked)
      throw new Exception(Code.INVALID_SMS_CODE, '验证码错误');

    await userStore.updateTradePasswd(uid, dpassword, u.utime);
  }

  public async forgotPass(params: any) {
    const { username, password, scode } = params;
    const checked = await this.checkRegisterSMS(username, scode);
    if (!checked)
      throw new Exception(Code.INVALID_SMS_CODE, '验证码错误');

    await userStore.forgotPassword(username, password);
  }

  public getVer() {
    return redisStore.get('app_ver');
  }

  public getCaptcha(username: string) {
    const key = 'cy:captcha:' + username;

  }

  public async sendSMS(params: any) {
    const { phone, type } = params;

    // TODO: check captcha

    const message = await configStore.getNumber('message', 0);
    if (message == 0)
      throw new Exception(Code.SERVER_ERROR, '信息开关关闭');

    if (type == 'forgot') {
      const u = await userStore.findByUsername(phone);
      if (!u)
        throw new Exception(Code.USERNAME_NOT_FOUND, '用户名不存在');
    } else if (type == 'register') {
      const u = await userStore.findByUsername(phone);
      if (u)
        throw new Exception(Code.USERNAME_EXIST, '用户已注册');
    } else
      throw new Exception(Code.SERVER_ERROR, 'unknown type');

    const valid = await redisStore.exists('sms_out_' + phone);
    if (valid)
      throw new Exception(Code.SMS_FREQUENTLY, '请1分钟之后再次发送!');

    const code = '' + _.random(100000, 999999);
    await redisStore.setex('sms_out_' + phone, code, 60);
    await redisStore.setex('sms_' + phone, code, 300);

    const content = `您的验证码为${code}，在5分钟内有效。`;
    const user = await configStore.get('msm_appkey');
    const pass = await configStore.get('msm_secretkey');
    const sent = await sendSms({ user, pass, phone, content });
    if (!sent)
      throw new Exception(Code.SERVER_ERROR, '服务器繁忙,请重新发送');
  }

  public async checkRegisterSMS(phone: string, code: string) {
    const msm = await configStore.getNumber('message', 0);
    if (msm == 0)
      return true;

    const key = 'sms_' + phone;
    const scode = await redisStore.get(key);
    if (_.isEmpty(scode))
      return false;

    const ret = scode == code;
    await redisStore.del(key);
    return ret;
  }

  public async userExists(phone: string) {
    const u = await userStore.findByUsername(phone);
    return !_.isNil(u);
  }

  public async getUser(uid: string) {
    const u = await userStore.findById(uid);
    if (!u)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户不存在');

    return {
      ..._.pick(u, ['username','utime','ustatus','lastlog','pid','userlevel','shiming','zhitui_num','group_member_num']),
      sunshine_group: u.sunshine,
      sunshine: u.sunshine + u.sunshine_1
    };
  }

  public async userDetail(uid: string) {
    const u = await userStore.findById(uid);
    if (!u)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户不存在');

    const wallets = await walletStore.findByUid(uid);
    if (_.size(wallets) !== 2)
      throw new Exception(Code.SERVER_ERROR, '钱包数量错误');

    const activeWallet = _.find(wallets, v => v.coinid === CoinType.ACTIVE);
    const bankWallet = _.find(wallets, v => v.coinid === CoinType.BANK);

    if (!activeWallet || !bankWallet)
      throw new Exception(Code.SERVER_ERROR, '钱包错误');

    return {
      ..._.pick(u, ['username','utime','ustatus','lastlog','pid','userlevel','shiming','zhitui_num','group_member_num','fee']),
      sunshine_group: u.sunshine,
      sunshine: u.sunshine + u.sunshine_1,
      wallets: {
        balance: activeWallet.num,
        bankBalance: bankWallet.num
      }
    };
  }

  public async getAuthorization(uid: string) {
    const u = await userStore.findById(uid);
    if (!u)
      throw new Exception(Code.USER_NOT_AUTHORIZED, '用户不存在');

    let orderid;
    const au = u.shiming;
    if (au == 1) {
      const order = await authStore.findCanCheck(uid);
      if (!order)
        throw new Exception(Code.SERVER_ERROR, '支付账单为找到');

      orderid = order.orderid;
    }

    return { authorization: au, orderid };
  }
}

export const userService = new UserService();
