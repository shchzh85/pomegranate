
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import BaseService from './base.service';
import {
    userStore,
    questKindStore,
    questsStore,
    walletStore,
    questRewardStore,
    questTimesStore,
    questLevelBonusStore,
    redisStore,
    questVideoStore,
    CoinType,
    coinLogStore,
    CoinLogNType,
    CoinLogParams
} from '@store/index';
import { sequelize } from '@common/dbs';
import { md5 } from '@common/utils';

const dateFormat = require('dateformat');

interface LevelContext {
    cost: number;
    qid: number;
    sunshine: number;
    sunshine2: number;
}

const LEVEL_DEFINE: LevelContext[] = [
    {
        cost: 10,
        qid: 2,
        sunshine: 500,
        sunshine2: 30
    },
    {
        cost: 30,
        qid: 3,
        sunshine: 1600,
        sunshine2: 500
    },
    {
        cost: 200,
        qid: 4,
        sunshine: 8000,
        sunshine2: 2200
    },
    {
        cost: 2000,
        qid: 6,
        sunshine: 90000,
        sunshine2: 23000
    },
];

const LIKED_VIDEO_PREFIX = 'cy:liked_video:';
const USER_VIDEO_PREFIX = 'cy:user_video:';
const VIDEO_TASK_PREFIX = 'cy:video_task:';

class QuestService extends BaseService {

    public async apply(uid: string, params: any) {
        const { dpassword, qid } = params;
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        if (md5(dpassword + user.utime) !== user.dpassword)
            throw new Exception(Code.INVALID_PASSWORD, '交易密码错误');

        if (user.ustatus !== 0)
            throw new Exception(Code.USER_LOCKED, '用户已冻结');

        if (user.shiming !== 2)
            throw new Exception(Code.USER_NOT_AUTHORIZED, '您尚未实名');

        const questKind = await questKindStore.findById(qid);
        if (!questKind)
            throw new Exception(Code.QUEST_NOT_FOUND, '任务不存在');

        const questTimes = await questTimesStore.findOrCreate(uid, qid, questKind.quest_max_times);
        if (!questTimes)
            throw new Exception(Code.SERVER_ERROR, '创建任务计数失败');

        if (questTimes.quest_times < 1)
            throw new Exception(Code.QUEST_TIMES_NOT_ENOUGH, '可购买次数不足');

        const price = questKind.quest_price;
        const wallets = await walletStore.findByUid(uid);
        const balance = _.sumBy(wallets, (v: any) => v.num);
        if (balance < price)
            throw new Exception(Code.BALANCE_NOT_ENOUGH, '余额不足');

        const bankWallet = _.find(wallets, v => v.coinid == CoinType.BANK);
        if (!bankWallet)
            throw new Exception(Code.SERVER_ERROR, '钱包未找到');

        const useBank = bankWallet.num >= price;
        const uppers = _.filter(user.tops.split(','), v => !_.isEmpty(v));

        let transaction;
        try {
            transaction = await sequelize.transaction();

            // 1. add quest
            const quest = await questsStore.create(uid, user.username, questKind, transaction);

            // 2. add sunshine for all uppers
            const add = await userStore.addSunshine(uppers, questKind.quest_sunshine, transaction);
            if (!add)
                throw new Exception(Code.SERVER_ERROR, '增加上级阳光值失败');

            // 3. decrease coin
            const logs: CoinLogParams[] = [];
            if (useBank) {
                const paid = await walletStore.pay(uid, CoinType.BANK, price, transaction);
                if (!paid)
                    throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');

                const w = await walletStore.find(uid, CoinType.BANK, transaction);
                if (!w)
                    throw new Exception(Code.SERVER_ERROR, '钱包未找到');

                logs.push({
                    uid,
                    username: user.username,
                    num: price,
                    wtype: CoinType.BANK,
                    ntype: CoinLogNType.DEC,
                    oamount: w.num + price,
                    namount: w.num,
                    note: 'A0102',
                    action: '领取福田',
                    actionid: 0  // TODO
                });
            } else {
                if (bankWallet.num > 0) {
                    const paid = await walletStore.pay(uid, CoinType.BANK, bankWallet.num, transaction);
                    if (!paid)
                        throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');

                    const w = await walletStore.find(uid, CoinType.BANK, transaction);
                    if (!w)
                        throw new Exception(Code.SERVER_ERROR, '钱包未找到');

                    logs.push({
                        uid,
                        username: user.username,
                        num: bankWallet.num,
                        wtype: CoinType.BANK,
                        ntype: CoinLogNType.DEC,
                        oamount: w.num + bankWallet.num,
                        namount: w.num,
                        note: 'A0102',
                        action: '领取福田',
                        actionid: 0  // TODO
                    });
                }

                {
                    const paid = await walletStore.pay(uid, CoinType.ACTIVE, price - bankWallet.num, transaction);
                    if (!paid)
                        throw new Exception(Code.BALANCE_NOT_ENOUGH, '流通账户余额不足');
                    
                    const w = await walletStore.find(uid, CoinType.ACTIVE, transaction);
                    if (!w)
                        throw new Exception(Code.SERVER_ERROR, '钱包未找到');
    
                    logs.push({
                        uid,
                        username: user.username,
                        num: bankWallet.num,
                        wtype: CoinType.ACTIVE,
                        ntype: CoinLogNType.DEC,
                        oamount: w.num + price - bankWallet.num,
                        namount: w.num,
                        note: 'A0102',
                        action: '领取福田',
                        actionid: 0  // TODO
                    });
                }
            }

            // 4. add coin log
            await coinLogStore.bulkCreate(logs, transaction);

            // 5. add my sunshine_1
            const add2 = await userStore.addSunshine1([ uid ], questKind.quest_sunshine, transaction);
            if (!add2)
                throw new Exception(Code.SERVER_ERROR, '增加阳光值1失败');

            const dec = await questTimesStore.decTimes(uid, qid, transaction);
            if (!dec)
                throw new Exception(Code.SERVER_ERROR, '减少任务计数失败');

            await transaction.commit();
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    public async levelUp(uid: string) {
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        const { userlevel, zhitui_num, sunshine, tops } = user;
        if (zhitui_num < 20)
            throw new Exception(Code.OPERATION_FORBIDDEN, '条件不足,升级失败');

        const sunshine2 = zhitui_num >= 3 ? (await userStore.getSunshine2(uid)) : 0;
        const activeWallet = await walletStore.find(uid, CoinType.ACTIVE);
        if (!activeWallet)
            throw new Exception(Code.SERVER_ERROR, '钱包未找到');

        const questKinds = await questKindStore.findAll();

        let balance = activeWallet.num;
        const uppers = _.filter(tops.split(','), v => !_.isEmpty(v));
        const levels = _.range(userlevel + 1, 5);
        const valids = [];

        const bonus = await questLevelBonusStore.findAll(uid, levels);
        let max = userlevel;

        for (let i = 0; i < levels.length; i++) {
            const lvl = levels[i];
            const condition = LEVEL_DEFINE[lvl - 1];
            const b = _.find(bonus, v => v.levelbonus == lvl);
            if (sunshine < condition.sunshine || sunshine2 < condition.sunshine2)
                break;

            if (!b) {
                if (balance < condition.cost)
                    break;

                balance -= condition.cost;
                valids.push(lvl);
            }

            max = lvl;
        }

        if (max == userlevel)
            throw new Exception(Code.INVALID_OPERATION, '不满足升级条件');

        const getdate = new Date();
        const bonusData = valids.map(v => {
            return {
                uid,
                levelbonus: v,
                getdate
            };
        });

        const total = activeWallet.num - balance;
        const qids = valids.map(v => LEVEL_DEFINE[v - 1].qid);
        const kinds = _.filter(questKinds, q => qids.includes(q.id));
        const sunshines = _.sumBy(kinds, q => q.quest_sunshine);

        let transaction;
        try {
            transaction = await sequelize.transaction();

            if (_.size(bonusData) > 0)
                await questLevelBonusStore.bulkCreate(bonusData, transaction);

            if (_.size(kinds) > 0)
                await questsStore.bulkCreate(uid, user.username, kinds, transaction);

            if (sunshines > 0) {
                await userStore.addSunshine1([ uid ], sunshines, transaction);
                await userStore.addSunshine(uppers, sunshines, transaction);
            }

            if (total > 0) {
                const paid = await walletStore.pay(uid, CoinType.ACTIVE, total, transaction);
                if (!paid)
                    throw new Exception(Code.BALANCE_NOT_ENOUGH, '钱包余额不足');

                const w = await walletStore.find(uid, CoinType.ACTIVE, transaction);
                if (!w)
                    throw new Exception(Code.SERVER_ERROR, '钱包未找到');

                await coinLogStore.create({
                    uid,
                    username: user.username,
                    num: total,
                    wtype: CoinType.ACTIVE,
                    ntype: CoinLogNType.DEC,
                    oamount: w.num + total,
                    namount: w.num,
                    note: 'A0103',
                    action: '升级',
                    actionid: 0  // TODO
                }, transaction);
            }

            const up = await userStore.levelUp(uid, max, transaction);
            if (!up)
                throw new Exception(Code.INVALID_OPERATION, '升级失败');

            await transaction.commit();
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    public async reward(uid: string) {
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        // 找出所有福田
        const quests = await questsStore.findActive(uid);
        if (_.size(quests) == 0)
            return [];

        const qids = quests.map(v => v.id);
        const total = _.sumBy(quests, v => v.quest_per_times_give * v.quest_every_days);

        const parent = await userStore.findById(user.pid);
        if (!parent)
            throw new Exception(Code.SERVER_ERROR, '上级不存在，请联系客服');

        let transaction;
        try {
            transaction = await sequelize.transaction();

            // 1. 更新福田的 quest_left_days > 0, quest_all_times > 0
            const reward = await questsStore.reward(qids, transaction);
            if (!reward)
                throw new Exception(Code.SERVER_ERROR, '分红失败，请联系客服');

            // 2. 把福田收益加到wallet coinid=1
            const accepted = await walletStore.accept(uid, CoinType.ACTIVE, total, transaction);
            if (!accepted)
                throw new Exception(Code.SERVER_ERROR, '分红失败，请联系客服2');

            const w = await walletStore.find(uid, CoinType.ACTIVE, transaction);
            if (!w)
                throw new Exception(Code.SERVER_ERROR, '钱包未找到');

            await coinLogStore.create({
                uid,
                username: user.username,
                num: total,
                wtype: CoinType.ACTIVE,
                ntype: CoinLogNType.ADD,
                oamount: w.num - total,
                namount: w.num,
                note: 'A0101',
                action: '分红',
                actionid: 0  // TODO
            }, transaction);

            // 3. 福田收益的8%加到上级wallet coinid=2,  shiming=2
            if (parent.shiming == 2) {
                const num = total * 0.08;
                const accepted2 = await walletStore.accept(parent.id, CoinType.BANK, num, transaction);
                if (!accepted2)
                    throw new Exception(Code.SERVER_ERROR, '分红失败，请联系客服3');

                const w2 = await walletStore.find(parent.id, CoinType.BANK, transaction);
                if (!w2)
                    throw new Exception(Code.SERVER_ERROR, '钱包未找到');

                await coinLogStore.create({
                    uid: parent.id,
                    username: parent.username,
                    num,
                    wtype: CoinType.BANK,
                    ntype: CoinLogNType.ADD,
                    oamount: w2.num - num,
                    namount: w2.num,
                    note: 'A0101',
                    action: '分红',
                    actionid: 0  // TODO
                }, transaction);
            }

            const done = await userStore.setTaskCompleted(uid, transaction);
            if (!done)
                throw new Exception(Code.SERVER_ERROR, '任务完成失败');
            
            await transaction.commit();
            return qids;
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    // 福田结算/出局
    public async settle(uid: string) {
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        const quests = await questsStore.findSettable(uid);
        if (_.size(quests) == 0)
            return [];

        const tops = _.filter(user.tops.split(','), v => !_.isEmpty(v));
        const ids = quests.map(v => v.id);
        const total = _.sumBy(quests, v => v.quest_sunshine);

        let transaction;
        try {
            transaction = await sequelize.transaction();

            const settled = await questsStore.settle(ids, transaction);
            if (!settled)
                throw new Exception(Code.SERVER_ERROR, '出局失败');

            // 1. 上级阳光值减少
            const dec = await userStore.decSunshine(tops, total, transaction)
            if (!dec)
                throw new Exception(Code.SERVER_ERROR, '减少上级阳光值失败');

            // 2. 自己阳光值1减少
            const dec2 = await userStore.decSunshine1(uid, total, transaction);
            if (!dec2)
                throw new Exception(Code.SERVER_ERROR, '减少自己阳光值1失败');

            // 3. quest_times增加
            await questTimesStore.addTimes(uid, ids, transaction);

            await transaction.commit();
            return ids;
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    public async demote() {
        // 降级
    }

    public listQuest() {
        const key = 'cy:quest_kinds';
        return redisStore.remember(key, () => questKindStore.findAll({
            where: { actived: 0 },
            limit: 20
        }), 3600);
    }

    public async listMyQuest(uid: string) {
        const list: any[] = await questsStore.findByUid(uid);
        if (_.isEmpty(list))
            return list;

        const kinds = await this.listQuest();
        const m = {};

        kinds.forEach(v => m[v.id] = m.quest_price);
        list.forEach(v => {
            v.quest_price = m[v.quest_id];
        });

        return list;
    }

    public async waterList(uid: string, params: any) {
        const start = _.defaultTo(params.start, 0);
        const len = _.defaultTo(params.len, 20);
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        const { rows, count } = await userStore.findAndCount({
            where: { pid: uid, member_flg: 1 },
            offset: start, limit: len,
            order: [ 'member_flg' ]
        });

        return {
            start,
            len,
            list: rows,
            max: count
        };
    }

    public async seedBankList(uid: string, params: any) {
        const start = _.defaultTo(params.start, 0);
        const len = _.defaultTo(params.len, 20);
        const list = await questRewardStore.findAll({
            where: { uid },
            offset: start,
            limit: len,
            order: [ 'id', 'DESC' ]
        });

        return { list, start, len, max: 0 };
    }

    public async myGroup(uid: string, params: any) {
        const start = _.defaultTo(params.start, 0);
        const len = _.defaultTo(params.len, 20);
        const { rows, count } = await userStore.findAndCount({
            attributes: [ 'mz', 'group_member_num', 'sunshine', 'username', 'today_in_own' ],
            where: { pid: uid },
            offset: start,
            limit: len,
            order: [ 'member_flg' ]
        });

        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        const parent = await userStore.findById(user.pid);
        if (!parent)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        const group_shiming_num = await userStore.countChildrenCertificated(uid);
        const sunshine1 = await userStore.getSunshine2(uid);

        return {
            max: count,
            start, len,
            list: rows,
            Topphone: parent.username,
            group_shiming_num,
            sunshine1
        };
    }

    public async getVideo(uid: string) {
        const key = USER_VIDEO_PREFIX + uid;
        const exists = await redisStore.exists(key);
        let videoes;
        if (!exists) {
            videoes = await questVideoStore.findAll();
            const vids = videoes.map((v: any) => '' + v.id);
            _.shuffle(vids);
            await redisStore.sadd(key, vids);
        }

        await redisStore.expire(key, 3600);
        const vid = await redisStore.spop(key);
        if (!videoes)
            videoes = await questVideoStore.findAll();

        return { video: _.find(videoes, v => v.id == vid) };
    }

    public async videoCompleted(uid: string, params: any) {
        const key = VIDEO_TASK_PREFIX + uid + ':' + dateFormat(new Date(), 'yyyymmdd');
        const exist = await redisStore.exists(key);
        let count = await redisStore.scard(key);
        if (count >= 6)
            return { count };
        
        await redisStore.sadd(key, [ '' + Math.floor(Date.now() / 1000) ]);
        if (!exist)
            await redisStore.expire(key, 3600 * 24);

        count = await redisStore.scard(key);
        const ret: any = { count };
        if (count == 6) {
            const rewardIds = await this.reward(uid);
            if (!_.isEmpty(rewardIds)) {
                _.assign(ret, rewardIds);
                const settleIds = await this.settle(uid);
                if (!_.isEmpty(settleIds))
                    _.assign(ret, settleIds);
            }
        }

        return ret;
    }

    public async getVideoLiked(uid: string, params: any) {
        const { vid } = params;
        const key = LIKED_VIDEO_PREFIX + vid;
        const count = await redisStore.scard(key);
        const status = await redisStore.sismember(key, uid);
        return { count: Number(count) || 0, status };
    }

    public async setVideoLiked(uid: string, params: any) {
        const { vid } = params;
        const key = LIKED_VIDEO_PREFIX + vid;
        const op = await redisStore.sadd(key, [ uid ]);
        if (!op)
            await redisStore.srem(key, [ uid ]);

        const count = await redisStore.scard(key);
        return { count: Number(count) || 0, op };
    }

    public async listLog(uid: string, params: any) {
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');
            
        const { coinid, start, len } = params;
        const offset = _.defaultTo(start, 0);
        const limit = _.defaultTo(len, 20);
        const where: any = { uid };
        
        if (!_.isNil(coinid))
            _.assign(where, { wtype: coinid });

        const { rows, count } = await coinLogStore.findAndCountAll({
            where, offset, limit, order: [[ 'id', 'DESC' ]]
        });

        return {
            max: count,
            start: offset,
            len: limit,
            list: rows
        };
    }
}

export const questService = new QuestService();
