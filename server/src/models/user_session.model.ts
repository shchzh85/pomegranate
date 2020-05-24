import {
  Table,
  Column,
  Model,
  DataType
} from 'sequelize-typescript';
    
@Table({
  tableName: 'user_session',
  indexes: [
    { unique: true, fields: ['uid'] }
  ]
})
export class UserSessionModel extends Model<UserSessionModel> {
  
  @Column
  public uid!: number;

  @Column({
    type: DataType.STRING(64)
  })
  public token!: string;
  
}
