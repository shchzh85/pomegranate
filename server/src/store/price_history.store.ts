
import BaseStore from './base.store';
import { priceHistoryRepository } from '@models/';

class PriceHistoryStore extends BaseStore {

  public last(limit: number = 6) {
    return priceHistoryRepository.findAll({
      limit,
      order: [ ['id', 'DESC'] ]
    });
  }
}

export const priceHistoryStore = new PriceHistoryStore();
