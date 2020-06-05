
import * as _ from 'lodash';
import BaseStore from './base.store';
import { QuestKindModel } from '@models/quest_kind.model';
import { questsRepository } from '@models/index';
import { Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

enum QuestStatus {
    ACTIVE = 1,
    SETTLED = 2
}

const QUEST_EXPIRE = 40 * 24 * 60 * 60 * 1000;

function transfer(uid: string, uname: string, qs: QuestKindModel[]) {
    const now = new Date();
    const data = qs.map(q => {
        return {
            uid,
            quest_id: _.get(q, 'id'),
            quest_start_date: now,
            quest_end_date: new Date(now.getTime() + QUEST_EXPIRE),
            quest_every_days: q.quest_per_day_times,
            quest_left_days: q.quest_need_days,
            quest_per_times_give: q.quest_per_times_give,
            quest_reward_persent: q.quest_reward_persent,
            quest_all_times: q.quest_per_day_times * q.quest_need_days,
            quest_got: 0,
            quest_all_got: q.quest_reward,
            quest_sunshine: q.quest_sunshine,
            uname,
            quest_name: q.quest_name
        };
    });

    return data;
}

class QuestsStore extends BaseStore {

    public create(uid: string, uname: string, q: QuestKindModel, transaction?: Transaction) {
        const data = transfer(uid, uname, [q]);
        return questsRepository.create(data[0], { transaction });
    }

    public bulkCreate(uid: string, uname: string, qs: QuestKindModel[], transaction?: Transaction) {
        const data = transfer(uid, uname, qs);
        return questsRepository.bulkCreate(data, { transaction });
    }

    public findByUid(uid: string) {
        return questsRepository.findAll({
            where: { uid }
        });
    }

    public findActive(uid: string) {
        return questsRepository.findAll({
            where: { uid, status: 1, quest_got: { [Op.lt]: Sequelize.literal('quest_all_got') } }
        });
    }

    public async reward(ids: number[], transaction?: Transaction) {
        const cnt = _.size(ids);
        const [ affectedCount ] = await questsRepository.update({
            quest_got: Sequelize.literal('quest_got+quest_per_times_give*quest_every_days'),
            quest_left_days: Sequelize.literal('quest_left_days-1')
        }, {
            where: { id: ids, status: QuestStatus.ACTIVE, quest_got: { [Op.lte]: Sequelize.literal('quest_all_got-quest_per_times_give*quest_every_days') } },
            transaction
        });

        return cnt === affectedCount;
    }

    public findSettable(uid: string) {
        const now = new Date();
        return questsRepository.findAll({
            where: { uid, status: QuestStatus.ACTIVE, [Op.or]: [
                { quest_end_date: { [Op.lt]: now } },
                Sequelize.literal('quest_got=quest_all_got')
            ]}
        });
    }

    public async settle(ids: number[], transaction?: Transaction) {
        const now = new Date();
        const cnt = _.size(ids);
        const [ affectedCount ] = await questsRepository.update({
            status: QuestStatus.SETTLED
        }, {
            where: { status: QuestStatus.ACTIVE, [Op.or]: [
                { quest_end_date: { [Op.lt]: now } },
                Sequelize.literal('quest_got=quest_all_got')
            ]},
            transaction
        });

        return affectedCount === cnt;
    }
}

export const questsStore = new QuestsStore();
