import {
  Table,
  Column,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_quest_times',
  indexes: [
    { unique: true, fields: ['uid', 'quest_id'] }
  ]
})
export class QuestTimesModel extends Model<QuestTimesModel> {

  @Column({
    allowNull: false,
    comment: '用户id'
  })
  public uid!: number;

  @Column({
    allowNull: false,
    comment: '任务id'
  })
  public quest_id!: number;

  @Column({
    allowNull: false,
    comment: '任务剩下可完成次数'
  })
  public quest_times!: number;
}
