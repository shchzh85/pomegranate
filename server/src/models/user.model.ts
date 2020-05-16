
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'user',
})
export class UserModel extends Model<UserModel> {

  @Column({
    field: 'phone',
    type: DataType.STRING(12),
    allowNull: false
  })
  public phone!: string;



}

