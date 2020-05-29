import * as _ from 'lodash';
import BaseStore from './base.store';
import { qrcodeRepository } from '@models/index';

class QrcodeStore extends BaseStore {

  public findOne() {
    return qrcodeRepository.findOne();
  }
}

export const qrcodeStore = new QrcodeStore();
