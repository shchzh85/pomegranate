import BaseStore from './base.store';
import { questRewardRepository } from '@models/index';

class QuestRewardStore extends BaseStore {

    public findAll(options?: any) {
        return questRewardRepository.findAll(options);
    }
}

export const questRewardStore = new QuestRewardStore();
