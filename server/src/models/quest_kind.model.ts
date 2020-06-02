import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_quest_kind'
})
export class QuestKindModel extends Model<QuestKindModel> {

  @Column({
    allowNull: false,
    comment: '任务名'
  })
  public quest_name!: string;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '价格'
  })
  public quest_price!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '回报数量'
  })
  public quest_reward!: number;

  @Column({
    allowNull: false,
    comment: '最大领取次数'
  })
  public quest_max_times!: number;

  @Column({
    allowNull: false,
    comment: '每日次数'
  })
  public quest_per_day_times!: number;

  @Column({
    allowNull: false,
    comment: '任务天数'
  })
  public quest_need_days!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '返回阳光'
  })
  public quest_sunshine!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '回报率'
  })
  public quest_reward_persent!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '每日最多获取'
  })
  public quest_per_day_give!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    comment: '每次任务给予'
  })
  public quest_per_times_give!: number;

  @Column
  public comment!: string;

  @Column({
      allowNull: false,
      defaultValue: 0,
      comment: '是否激活'
  })
  public actived!: number;

  @Column({
    comment: '图标'
  })
  public imgurl!: string;
}
