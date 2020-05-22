
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
    field: 'uid',
    type: DataType.INTEGER,
    allowNull: false
  })
  @Column({
    field: 'uname',
    type: DataType.STRING(255),
    allowNull: true
  }) @Column({
    field: 'quest_id',
    type: DataType.INTEGER,
    allowNull: false
  }) @Column({
    field: 'quest_name',
    type: DataType.STRING(255),
    allowNull: true
  }) @Column({
    field: 'quest_start_date',
    type: DataType.DATE,
    allowNull: false
  }) @Column({
    field: 'quest_end_date',
    type: DataType.DATE,
    allowNull: true
  }) @Column({
    field: 'quest_every_days',
    type: DataType.INTEGER,
    allowNull: true
  }) @Column({
    field: 'quest_left_days',
    type: DataType.INTEGER,
    allowNull: true
  }) @Column({
    field: 'quest_per_times_give',
    type: DataType.DECIMAL,
    allowNull: true
  }) @Column({
    field: 'quest_reward_persent',
    type: DataType.DECIMAL,
    allowNull: true
  }) @Column({
    field: 'quest_all_times',
    type: DataType.INTEGER,
    allowNull: true
  }) @Column({
    field: 'quest_active',
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: '0'
  }) @Column({
    field: 'quest_sunshine',
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: '0'
  }) @Column({
    field: 'quest_got',
    type: DataType.DECIMAL,
    allowNull: true,
    defaultValue: '0.0000'
  }) @Column({
    field: 'quest_all_got',
    type: DataType.DECIMAL,
    allowNull: true,
    defaultValue: '0.0000'
  })

  public uid!: number;
  public uname!: string;
  public quest_id!: number;
  public quest_name!: string;
  public quest_start_date!: string;
  public quest_end_date!: string;
  public quest_every_days!: string;
  public quest_left_days!: string;
  public quest_per_times_give!: number;
  public quest_reward_persent!: number;
  public quest_all_times!: number;
  public quest_active!: string;
  public quest_sunshine!: number;
  public quest_got!: number;
  public quest_all_got!: number;




}

