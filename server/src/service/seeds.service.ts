
import _ from 'lodash';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import BaseService from './base.service';
import { userStore, questKindStore, questsStore, walletStore, questRewardStore, questTimesStore, questLevelBonusStore } from '@store/index';
import { sequelize } from '@common/dbs';
import { md5 } from '@common/utils';

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

class SeedsService extends BaseService {

    public async getFT(params: {
        uid: string,
        dpassword: string,
        qid: number
    }) {
        const { uid, dpassword, qid } = params;
        const user = await userStore.findById(uid);
        if (!user)
            throw new Exception(Code.USERNAME_NOT_FOUND, '用户不存在');

        if (md5(dpassword) !== user.dpassword)
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

        const bankWallet = _.find(wallets, v => v.coinid == 1);
        if (!bankWallet)
            throw new Exception(Code.SERVER_ERROR, '钱包未找到');

        const useBank = bankWallet.num >= price;
        const uppers = user.tops.split(',');

        // transaction start
        let transaction;

        try {
            transaction = await sequelize.transaction();

            // 1. add quest
            const quest = await questsStore.create(uid, questKind, transaction);

            // 2. add sunshine for all uppers and me
            const add = await userStore.addSunshine(uppers, questKind.quest_sunshine, transaction);
            if (!add)
                throw new Exception(Code.SERVER_ERROR, '增加上级阳光值失败');

            // 3. decrease coin
            if (useBank) {
                const paid = await walletStore.pay(uid, 2, price, transaction);
                if (!paid)
                    throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');
            } else {
                if (bankWallet.num > 0) {
                    const paid = await walletStore.pay(uid, 2, bankWallet.num, transaction);
                    if (!paid)
                        throw new Exception(Code.BALANCE_NOT_ENOUGH, '仓储账户余额不足');
                }

                {
                    const paid = await walletStore.pay(uid, 1, price - bankWallet.num, transaction);
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
        const bankWallet = await walletStore.find(uid, 1);
        if (!bankWallet)
            throw new Exception(Code.SERVER_ERROR, '钱包未找到');

        const questKinds = await questKindStore.findAll();

        let balance = bankWallet.num;
        const uppers = tops.split(',');
        const levels = _.range(userlevel + 1, 5);
        const valids = [];

        const bonus = await questLevelBonusStore.findAll(uid, levels);

        for (let i = 0; i < levels.length; i++) {
            const lvl = levels[i];
            const condition = LEVEL_DEFINE[lvl - 1];
            const b = _.find(bonus, v => v.levelbonus == lvl);
            if (sunshine < condition.sunshine || sunshine2 < condition.sunshine2)
                break;

            if (b) continue;
            if (balance < condition.cost)
                break;

            balance -= condition.cost;
            valids.push(lvl);
        }

        balance = bankWallet.num;

        const getdate = new Date();
        const bonusData = valids.map(v => {
            return {
                uid,
                levelbonus: v,
                getdate
            };
        });

        const qids = valids.map(v => LEVEL_DEFINE[v - 1].qid);
        const kinds = _.filter(questKinds, q => qids.includes(q.id));
        const sunshines = _.sumBy(kinds, q => q.quest_sunshine);
        
        let transaction;
        try {
            transaction = await sequelize.transaction();

            await questLevelBonusStore.bulkCreate(bonusData, transaction);

            await questsStore.bulkCreate(uid, kinds, transaction);

            await userStore.addSunshine1([ uid ], sunshines, transaction);

            await userStore.addSunshine(uppers, sunshines, transaction);

            await walletStore.pay(uid, 1, balance, transaction);

            // TODO: add coin log

            await transaction.commit();
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    public appGetQuestList() {
        return questKindStore.findAll({
            where: { actived: 0 },
            limit: 20
        });
    }

    public appGetMyQuestList(uid: string) {
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
}

export const seedsService = new SeedsService();
