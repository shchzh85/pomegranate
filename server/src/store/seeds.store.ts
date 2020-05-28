
import * as _ from 'lodash';
import { Transaction, UniqueConstraintError, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import BaseStore from './base.store';
import { userRepository, coinKindRepository, walletRepository, questsRepository } from '@models/index'
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { sequelize } from '@common/dbs';

export interface GetFTParams {
  uid: number;
  dpassword: string;
  qid: string;
}

class SeedsStore extends BaseStore {


  //增加任务共通函数
  private async addQuest(params: GetFTParams) {

    //const quests = await .findAll();

    // let transaction;
    // try {
    //   transaction = await sequelize.transaction();
    //   const u = await questsRepository.create({
    //     username, password, dpassword, invitecode: code,
    //     pid: parent.id, tops: parent.tops + ',' + parent.id
    //   }, { transaction });
    //   await transaction.commit();

      // }

      /*
        1.从quest_kind表中取出id为 params.qid 的任务详情
  
        2.向quests中插入一条数据,uid为params.uid,其他信息为 步骤<1>中取到的信息.
  
        3.返回步骤2新记录的id
      */

    }

  // 注册store
  public async getFT(params: GetFTParams) {

    /**
     * 1.验证用户token是否过期
     * 2.验证交易密码 字段 dpassword
     * 3.判断用户是否冻结 字段 ustatus (0正常 1冻结)   尚未冻结
     * 4.判断用户是否是已实名状态 字段 shiming  2已实名 需要实名
     * 5.判断该用户要购买福田是否超过次数
     *   5.1 查询 quest_kind中,qid 为 params.qid 任务信息 此为一条信息,questData
     *   5.2 查询 select quest_times from quest_times where uid = {params.uid} AND qid = {params.qid}
     *       如果有结果,则直接取结果,如果没有结果,则插入一条数据,再取结果{uid:当前用户id,username:当前用户名,quest_id:params.qid,quest_name:5.1中查询到的quest_name,questData.quest_times:5.1查询到的questData.quest_max_times}
     *   5.3 如果5.2中取到的 quest_times < 1,则表示剩余任务次数不足.返回错误
     * 6.判断用户使用哪种方式支付(仓储钱包或者仓储钱包+金种子钱包)
     *   6.1 如果仓储钱包充足,则只扣仓储钱包,
     *   6.2 如果仓储不足,金种子充足,则扣完仓储后,剩余不足的,扣金种子.
     *   6.3 如果仓储为0,金种子充足,则扣金种子
     *   6.4 两种都都不足,则提示余额不足
     * 7.获取 this.addQuest(params) 返回的id
     * 8.扣款,user_wallet中  uid为当前用户id,   coinid为1 是金种子  coinid 为2 是仓储  扣款数量为6中计算的数量
     * 9.写日志(后期在规划)
     * ------------------------------------------------------------------------------------------------
     * 伪代码
     * 
     * if(用户token过期){
     *    return 用户已过期
     * }
     * 
     * if(交易密码错误){
     *    return 交易密码错误
     * }
     * 
     * if(user.ustatus == 1){
     *    return 用户已冻结
     * }
     * 
     * let questData = select * from quest_kind where quest_id = params.qid
     * 
     * let user_times = select quest_times from quest_times where uid = {params.uid} AND qid = {params.qid}
     * 
     * if(user_times == null){
     *  insert to quest_times values({uid:当前用户id,username:当前用户名,quest_id:params.qid,quest_name:questData.quest_name,questData.quest_times:questData.quest_max_times})
     *  user_times = questData.quest_times
     * }
     * 
     * if(user_times<1){
     *  return 福田剩次数不足 
     * }
     * 
     * 
     * id = this.addQuest(params)
     * 
     * update set num = num - questData.quest_price where num > quest_price ...
     * 
     * 写日志
     * 
     */

  }

  /**
   * applogin
   */
  public async levelUP() {
    /*
      判断用户是否过期
      var level = 用户当前等级
      while(level > 1){
        level -= 1;
        查询该奖励是否领过
        res = select * from quest_level_bonus where uid = 当前用户id AND levelbonus = {level}
        if(res == null){
          //升级扣除的金种子,与赠送的任务id
          cost[3] = [200, 4];
          cost[2] = [30, 3];
          cost[1] = [10, 2];
          //写入升级奖励领取表
          data['uid'] = $user['id'];
          data['uname'] = $user['username'];
          data['levelbonus'] = $level;
          data['getdate'] = date("Y-m-d H:i:s");
          insert into quest_level_bonus values(data);
          //发放任务
          id = this.addQuest(cost[level][1],当前用户id)
          //取得任务当前赠送任务的详情
          questData = select quest_sunshine from quest_kind where id = {cost[level][1]-1}
          //给自己累加阳光.
          user.sunshine_1 += questData.quest_sunshine
          //给上级增加阳光
          update set sunshine = sunshine + {questData.quest_sunshine} where id in {user.tops}
          
          //扣款  写日志

        }
      }

    */

  }

  public async zhifu(params: /*ZhifuParams*/ any){
    /*
    判断用户是否过期

      if(user.shiming == 1){

        retrun 已付款,请直接认证
      }

      if(!身份证验证){
        return 身份证格式不正确
      }

      if(身份证存在检查){
        return 身份证已经注册!
      }

      调用支付宝...
      拉起付款..

      $data11['uid'] = user.id
      $data11['username'] = user.username
      $data11['certify_id'] = -1;
      $data11['smdate'] = date('Y-m-d H:i:s');
      $data11['status'] = 0;
      $data11['idcard'] = params.idcard
      $data11['url'] = '';
      $data11['orderid'] = 支付宝随机生成的订单id;
      $data11['xingming'] = params.xingming;
      
      Db::name("shiming_list")->insert($data11);

      返回 已签名的交易串 用于拉起支付宝

    */

  }

}

export const seedsStore = new SeedsStore();
