
import * as _ from 'lodash';
import BaseStore from './base.store';
import { QuestKindModel } from '@models/quest_kind.model';
import { questsRepository } from '@models/index';
import { Transaction } from 'sequelize';

const QUEST_EXPIRE = 40 * 24 * 60 * 60 * 1000;

function transfer(uid: string, qs: QuestKindModel[]) {
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
            quest_sunshine: q.quest_sunshine
        };
    });

    return data;
}

class QuestsStore extends BaseStore {

    public create(uid: string, q: QuestKindModel, transaction?: Transaction) {
        const data = transfer(uid, [q]);
        return questsRepository.create(data[0], { transaction });
    }

    public bulkCreate(uid: string, qs: QuestKindModel[], transaction?: Transaction) {
        const data = transfer(uid, qs);
        return questsRepository.bulkCreate(data, { transaction });
    }

    public findByUid(uid: string) {
        return questsRepository.findAll({
            where: { uid }
        });
    }
}

export const questsStore = new QuestsStore();
