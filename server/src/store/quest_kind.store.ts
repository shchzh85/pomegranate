
import BaseStore from './base.store';
import { questKindRepository } from '@models/index';

class QuestKindStore extends BaseStore {

    public findById(id: number) {
        // TODO: get from redis
        return questKindRepository.findByPk(id);
    }

    public findAll(options?: any) {
        return questKindRepository.findAll(options);
    }
}

export const questKindStore = new QuestKindStore();