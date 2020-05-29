import * as _ from 'lodash';
import BaseStore from './base.store';
import { newsRepository } from '@models/index';

class NewsStore extends BaseStore {

  public list(offset: number, limit: number) {
    return newsRepository.findAll({
      offset, limit,
      order: [[ 'id', 'DESC' ]]
    });
  }

  public findById(id: number) {
      return newsRepository.findByPk(id);
  }
}

export const newsStore = new NewsStore();
