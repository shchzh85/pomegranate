
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import BaseService from './base.service';
import { userStore, RegisterParams, redisStore, userSessionStore, configStore } from '@store/index';

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
    return { uid };
  }

  public async destorySession(token: string) {
    const key = PREFIX + token;
    const uid = await redisStore.get(key);
    if (_.isEmpty(uid))
      return;

    await redisStore.del(key);
    await userSessionStore.destroy(uid, token);
  }

  public register(params: RegisterParams) {
    return userStore.create(params);
  }

  public async login(params: any) {
    const { version, username, password, yzm } = params;

    const webStatus = await configStore.getNumber('web_status');
    if (webStatus == 0)
      throw new Exception(ErrCode.SERVER_ERROR, '服务器维护中');

    const ver = configStore.get('version');
    if (version != ver)
      throw new Exception(ErrCode.SERVER_ERROR, '版本已经更新,请手动下载最新版本！');

    // TODO: 验证码匹配

    const user = await userStore.login(username, password);

    // TODO: get message

    const allConfig = await configStore.all();

    return { user, allConfig };
  }

  public async logout(uid: string) {

  }

  public updateLoginPasswd(uid: string, params: any) {
    const { password, dpassword } = params;
    return userStore.updateLoginPasswd(uid, password, dpassword);
  }

  public async updateTradePasswd(uid: string, params: any) {
    const { dpassword, yzm } = params;
    // TODO: check yzm

    return userStore.updateTradePasswd(uid, dpassword, yzm);
  }

  //找回登陆密码
  public async forgotPass(username: string, input_zmy: string, password: string) {

    /**
     * {"username":"15172611264","password":"1","yzm":"1234"}
     * 1.判断找回的账号是否存在.
     * 2.判断传入的短信验证码是否正确.
     * 3.如果正确,用新登陆密码替换旧的.
     * 
     */
    const server_yzm = await redisStore.get(username + 'msm');
    if (input_zmy == server_yzm) {
      return userStore.forgotPassword(username, password);
    }else{
      throw new Exception(ErrCode.INVALID_INVITE_CODE, '短信验证码错误');
    }

  }

  //返回当前的版本号
  public getVer() {
    //返回当前版本号 config表里的 version 字段
    return redisStore.get('app_ver')
  }

  //返回图形验证码
  public yanzhengma() {

  }

}

export const userService = new UserService();
