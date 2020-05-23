
import * as _ from 'lodash';
import { Transaction, UniqueConstraintError, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { userRepository, coinKindRepository, walletRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { sequelize } from '@common/dbs';

export interface RegisterParams {
  username: string;
  password: string;
  dpassword: string;
  invitecode: string;
}

class UserStore extends BaseStore {

  // 注册store
  public async create(params: RegisterParams) {
    const { username, password, dpassword, invitecode } = params;
    const parent = await userRepository.findOne({ where: { invitecode } });
    if (!parent)
      throw new Exception(ErrCode.INVALID_INVITE_CODE, '邀请码未找到');

    const ids = parent.tops.split(',');
    ids.push(parent.id);

    const wallets = await coinKindRepository.findAll();
    if (_.isEmpty(wallets))
      throw new Exception(ErrCode.SERVER_ERROR, '钱包配置未找到');

    do {
      const code = _.random(10000000, 99999999);
      let transaction;
      try {
        transaction = await sequelize.transaction();
        const u = await userRepository.create({
          username, password, dpassword, invitecode: code,
          pid: parent.id, tops: parent.tops + ',' + parent.id
        }, { transaction });

        const uid = u.id;
        const up = await userRepository.update({
          group_member_num: Sequelize.literal('group_member_num+1')
        }, { where: { id: { [Op.in]: ids } }, transaction });

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
            throw new Exception(ErrCode.USERNAME_EXIST, '账号已存在');
          else if (_.get(e.fields, 'invitecode'))
            continue;
        }

        throw new Exception(e.code || ErrCode.SERVER_ERROR, e.code ? e.message : 'server error.');
      }
    } while (true);
  }

  /**
   * applogin
   */
  public async login(params: LoginParams) {

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
  }
  //登陆后修改密码
  public async function updatePass() {
    /**
     * {"token":"...","password":"1","dpassword":"1","type":"1"}
     * {"token":"...","password":"1","yzm":"123456","type":"2"}
     * 1.判断登陆状态
     * 2.判断参数中的 type, 为1修改登陆密码(user表  password字段),为2修改交易密码(user表  dpassword字段)
     *    2.1修改登陆密码
     *        判断传入的dpassword是否匹配,如果匹配,则用新密码替换旧密码,修改成功
     *    2.2修改交易密码
     *        判断传入的短信验证码(yzm)是否正确,如果正确,则用新交易密码替换旧交易密码,修改成功
     * 
     */
  }

  //找回登陆密码
  public async function forgotPass() { 

    /**
     * {"username":"15172611264","password":"1","yzm":"1234"}
     * 1.判断找回的账号是否存在.
     * 2.判断传入的短信验证码是否正确.
     * 3.如果正确,用新登陆密码替换旧的.
     * 
     */

  }

  //返回当前的版本号
  public function getVer()
  {
    //返回当前版本号 config表里的 version 字段
  }

  //返回图形验证码
  public function yanzhengma()
  {
  }



}

export const userStore = new UserStore();
