import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
    
@Table({
  tableName: 'tpz_qrcode'
})
export class QrcodeModel extends Model<QrcodeModel> {

  @Column({
    type: DataType.STRING(38),
    allowNull: false,
    defaultValue: ''
  })
  public qrcode!: string;

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
    defaultValue: ''
  })
  public email!: string;

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
