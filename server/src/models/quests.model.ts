
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_quests',
})
export class QuestsModel extends Model<QuestsModel> {

  @Column({
    field: 'phone',
    type: DataType.STRING(12),
    allowNull: false
  })
  public phone!: string;



}

