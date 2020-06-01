import BaseStore from './base.store';
import { questVideoRepository } from '@models/index';
import { redisStore } from './redis.store';

const QUEST_VIDEO_KEY = 'cy:quest_video';

class QuestVideoStore extends BaseStore {

  public findAll() {
    return redisStore.remember(QUEST_VIDEO_KEY, () => questVideoRepository.findAll());
  }
}

export const questVideoStore = new QuestVideoStore();
