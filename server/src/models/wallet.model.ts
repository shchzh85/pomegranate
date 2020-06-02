
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_user_wallet',
  indexes: [
    { unique: true, fields: ['uid', 'coinid'] }
  ]
})
export class WalletModel extends Model<WalletModel> {

  @Column({
    allowNull: false,
    comment: '用户id'
  })
  public uid!: number;

  @Column({
    allowNull: false,
    comment: '资产id'
  })
  public coinid!: number;

  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    defaultValue: 0,
    comment: '资产数量'
  })
  public num!: number;

  @Column({
    field: 'address',
    allowNull: false,
    defaultValue: '',
    comment: '资产钱包地址'
  })
  public address!: string;

  @Column({
    comment: '预留1'
  })
  public item1!: string;

  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    defaultValue: 0,
    comment: '冻结金额'
  })
  public freeeze!: number;

}
