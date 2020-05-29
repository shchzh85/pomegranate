import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
    
@Table({
  tableName: 'tpz_business_college'
})
export class BusinessCollegeModel extends Model<BusinessCollegeModel> {

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
    defaultValue: ''
  })
  public title!: string;

  @Column({
    type: DataType.STRING(512),
    allowNull: false
  })
  public description!: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
    defaultValue: ''
  })
  public cover!: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
    defaultValue: ''
  })
  public audio!: string;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public ctime!: Date;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public utime!: Date;
}
