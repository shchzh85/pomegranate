
import _ from 'lodash';
import {Exception} from '@common/exceptions';
import {ErrCode} from '@common/enums';
import BaseService from './base.service';
import { userStore, RegisterParams, redisStore, userSessionStore } from '@store/index';

const PREFIX = 'cy:session:';
const EXPIRE_SECONDS = 60 * 60 * 24;

class UserService extends BaseService {

    public async updateSession(uid: string, token: string) {
        const key = PREFIX + token;
        const us = await userSessionStore.find(uid);
        if (us)
            await redisStore.del(key);

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
}

export const userService = new UserService();
