import * as _ from 'lodash';
import BaseStore from './base.store';
import { businessCollegeRepository } from '@models/index';

class BusinessCollegeStore extends BaseStore {

  public list() {
    return businessCollegeRepository.findAll({
      order: [[ 'id', 'DESC' ]]
    });
  }

  public findById(id: number) {
    return businessCollegeRepository.findByPk(id);
  }
}

export const businessCollegeStore = new BusinessCollegeStore();
