import {
  Table,
  Column,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_quest_level_bonus',
  indexes: [
    { unique: true, fields: ['uid', 'levelbonus'] }
  ]
})
export class QuestLevelBonusModel extends Model<QuestLevelBonusModel> {
    
  @Column({
    allowNull: false
  })
  public uid!: number;

  @Column({
    allowNull: false
  })
  public levelbonus!: number;

  @Column({
    allowNull: false
  })
  public getdate!: Date;
}
