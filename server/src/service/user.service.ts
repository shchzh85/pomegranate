
import _ from 'lodash';
import {Exception} from '@common/exceptions';
import {ErrCode} from '@common/enums';
import BaseService from './base.service';
import { userStore, RegisterParams, redisStore, userSessionStore } from '@store/index';

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

    public async login(params: {
        username: string,
        password: string
    }) {
        /**
     * 接受参数
     * {username,password,yzm,version}
     * //验证服务器是否关闭
     * web_status = select web_status from config where name = 'web_status'
     * 
     * ver =  select web_status from config where name = 'version'
     * 
     * if(web_status == 0){
     *    return 服务器关闭
     * }
     * 
     * if(ver!=params.version){
     *    return 版本已经更新,请手动下载最新版本
     * }
     * 
     * if(验证码不匹配){
     *    return 图形验证码错误
     * }
     * 
     * if(!判断登陆){   加密方式 md5(user.password + user.utime)
     *    return 登陆失败
     * }else{
     *    更新登陆时间  user表 lastlog字段
     *    生成token,持续时间,写入redis,以及user表中的token,lasttime字段
     *    message = select * from message
     *    config = select * from config
     *    
     *    返回 {message:登陆成功,allConfig:config,message:message,uilang:zh,token:token,code:S0001}
     * }
     */
      const { username, password } = params;
      const user = await userStore.login(username, password);
      
      // TODO

      

      return { user };
    }

    public async logout(uid: string) {
      
    }

    //登陆后修改密码
    public updateLoginPasswd(uid: string, params: {
      password: string,
      dpassword: string,
    }) {
      const { password, dpassword } = params;
      return userStore.updateLoginPasswd(uid, password, dpassword);
    }

    public async updateTradePasswd(uid: string, params: {
        dpassword: string,
        yzm: string
    }) {

       /* {"token":"...","dpassword":"1","yzm":"123456","type":"2"}
       *    2.2修改交易密码
       *        判断传入的短信验证码(yzm)是否正确,如果正确,则用新交易密码替换旧交易密码,修改成功
       */
    }
  
    //找回登陆密码
    public async forgotPass() { 
  
      /**
       * {"username":"15172611264","password":"1","yzm":"1234"}
       * 1.判断找回的账号是否存在.
       * 2.判断传入的短信验证码是否正确.
       * 3.如果正确,用新登陆密码替换旧的.
       * 
       */
  
    }
  
    //返回当前的版本号
    public getVer()
    {
      //返回当前版本号 config表里的 version 字段
    }
  
    //返回图形验证码
    public yanzhengma()
    {
    }

}

export const userService = new UserService();
