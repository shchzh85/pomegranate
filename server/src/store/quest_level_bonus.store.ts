
import { Transaction } from 'sequelize';
import BaseStore from './base.store';
import { questLevelBonusRepository } from '@models/index';

class QuestLevelBonusStore extends BaseStore {

    public findAll(uid: string, levels: number[]) {
        return questLevelBonusRepository.findAll({ where: { uid, levelbonus: levels } });
    }

    public bulkCreate(data: {
        uid: string;
        levelbonus: number;
        getdate: Date
    }[], transaction: Transaction) {
        return questLevelBonusRepository.bulkCreate(data, { transaction });
    }
}

export const questLevelBonusStore = new QuestLevelBonusStore();
