import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_quest_reward',
  indexes: [
    { unique: true, fields: ['uid'] }
  ]
})
export class QuestRewardModel extends Model<QuestRewardModel> {

  @Column({
    allowNull: false
  })
  public uid!: number;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(20, 2)
  })
  public reward!: number;

  @Column({
    allowNull: false
  })
  public rdate!: Date;

  @Column
  public note!: string;
}
