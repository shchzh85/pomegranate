import * as _ from 'lodash';
import BaseStore from './base.store';
import { bannerRepository } from '@models/index';

class BannerStore extends BaseStore {

  public list() {
    return bannerRepository.findAll();
  }
}

export const bannerStore = new BannerStore();
