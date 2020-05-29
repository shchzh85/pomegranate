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
    allowNull: false,
    defaultValue: 0
  })
  public ctime!: number;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public utime!: number;
}
