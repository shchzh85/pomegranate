
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_quests',
  indexes: [
    { fields: ['uid'] }
  ]
})
export class QuestsModel extends Model<QuestsModel> {

  @Column({
    allowNull: false
  })
  public uid!: number;

  @Column({
    allowNull: false
  })
  public quest_id!: number;

  @Column({
    allowNull: false
  })
  public quest_start_date!: Date;
  
  @Column({
    allowNull: false
  })
  public quest_end_date!: Date;
  
  @Column({
    allowNull: false
  })
  public quest_every_days!: number;
  
  @Column({
    allowNull: false
  })
  public quest_left_days!: number;
  
  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false
  })
  public quest_per_times_give!: number;
  
  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false
  })
  public quest_reward_persent!: number;
  
  @Column({
    allowNull: false
  })
  public quest_all_times!: number;
  
  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public quest_active!: number;
  
  @Column({
    allowNull: false,
    defaultValue: '0'
  })
  public quest_sunshine!: number;
  
  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    defaultValue: 0
  })
  public quest_got!: number;
  
  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    defaultValue: 0
  })
  public quest_all_got!: number;

  @Column({
    allowNull: false,
    defaultValue: 1,
    comment: '1:未出局\n2：已出局'
  })
  public status!: number;
}
