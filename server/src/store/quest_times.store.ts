
import * as _ from 'lodash';
import BaseStore from './base.store';
import { questTimesRepository } from '@models/index';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, Op } from 'sequelize';


class QuestTimesStore extends BaseStore {

    public async findOrCreate(uid: string, quest_id: number, quest_times: number) {
        const [ result, created ] = await questTimesRepository.findOrCreate({
            where: { uid, quest_id },
            defaults: { uid, quest_id, quest_times }
        });

        return result;
    }

    public async decTimes(uid: string, quest_id: number, transaction?: Transaction) {
        const [ affectedCount ] = await questTimesRepository.update({
            quest_times: Sequelize.literal('quest_times-1')
        }, {
            where: { uid, quest_id, quest_times: { [Op.gte]: 1 } },
            transaction
        });

        return affectedCount === 1;
    }

    public async addTimes(uid: string, quest_ids: number[], transaction?: Transaction) {
        const [ affectedCount ] = await questTimesRepository.update({
            quest_times: Sequelize.literal('quest_times+1')
        }, {
            where: { uid, quest_id: quest_ids, quest_times: { [Op.lt]: 6 } },
            transaction
        });

        return affectedCount === _.size(quest_ids);
    }
}

export const questTimesStore = new QuestTimesStore();
