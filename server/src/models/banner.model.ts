import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
    
@Table({
  tableName: 'tpz_banner'
})
export class BannerModel extends Model<BannerModel> {

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
    defaultValue: ''
  })
  public title!: string;

  @Column({
    type: DataType.STRING(38),
    allowNull: false,
    defaultValue: ''
  })
  public banner!: string;

  @Column({
    allowNull: false
  })
  public ctime!: Date;

  @Column({
    allowNull: false
  })
  public utime!: Date;
}
