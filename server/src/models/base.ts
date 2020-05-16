import { Model } from 'sequelize-typescript';

class BaseModel<T, M> extends Model<M> {

  public serializer(opts?: { exclude?: Array<keyof T> }) {
    const { exclude } = opts || {};
    const entity = this.toJSON() as Required<T>;

    if (exclude) {
      exclude.forEach(key => delete entity[key]);
    }

    return entity;
  }

}

export default BaseModel;
