
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import BaseService from './base.service';
import { userStore, questKindStore, questsStore, walletStore, questRewardStore, questTimesStore, questLevelBonusStore, redisStore, questVideoStore, CoinType } from '@store/index';
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
            const quest = await questsStore.create(uid, questKind, transaction);

            // 2. add sunshine for all uppers
            const add = await userStore.addSunshine(uppers, questKind.quest_sunshine, transaction);
            if (!add)
                throw new Exception(Code.SERVER_ERROR, '增加上级阳光值失败');

            // 3. decrease coin
            if (useBank) {
                const paid = await walletStore.pay(uid, CoinType.BANK, price, transaction);
                if (!paid)
                    throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');
            } else {
                if (bankWallet.num > 0) {
                    const paid = await walletStore.pay(uid, CoinType.BANK, bankWallet.num, transaction);
                    if (!paid)
                        throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');
                }

                {
                    const paid = await walletStore.pay(uid, CoinType.ACTIVE, price - bankWallet.num, transaction);
                    if (!paid)
                        throw new Exception(Code.BALANCE_NOT_ENOUGH, '流通账户余额不足');
                }
            }

            // 4. TODO: add coin log

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
        const uppers = tops.split(',');
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
                await questsStore.bulkCreate(uid, kinds, transaction);

            if (sunshines > 0) {
                await userStore.addSunshine1([ uid ], sunshines, transaction);
                await userStore.addSunshine(uppers, sunshines, transaction);
            }

            if (total > 0) {
                const paid = await walletStore.pay(uid, CoinType.ACTIVE, balance, transaction);
                if (!paid)
                    throw new Exception(Code.BALANCE_NOT_ENOUGH, '钱包余额不足');
            }

            const up = await userStore.levelUp(uid, max, transaction);
            if (!up)
                throw new Exception(Code.INVALID_OPERATION, '升级失败');

            // TODO: add coin log

            await transaction.commit();
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    public listQuest() {
        return questKindStore.findAll({
            where: { actived: 0 },
            limit: 20
        });
    }

    public listMyQuest(uid: string) {
        return questsStore.findByUid(uid);
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
            attributes: [ 'mz', 'group_member_num', 'sunshine', 'username' ],
            where: { pid: uid },
            offset: start,
            limit: len,
            order: [ 'member_flg' ]
        });

        return {
            max: count,
            start, len,
            list: rows
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
        const count = await redisStore.scard(key);
        if (count >= 6)
            return { count };
        
        await redisStore.sadd(key, [ '' + Math.floor(Date.now() / 1000) ]);
        if (!exist)
            await redisStore.expire(key, 3600 * 24);

        return { count: count + 1 };
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
}

export const questService = new QuestService();
