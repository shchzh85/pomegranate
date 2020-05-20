
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_user_wallet',

})
export class WalletModel extends Model<WalletModel> {

  @Column({
    field: 'uid',
    type: DataType.INTEGER,
    allowNull: false,
    comment: '用户id'
  })
  public uid!: string;

  @Column({
    field: 'coinid',
    type: DataType.INTEGER,
    allowNull: false,
    comment: '资产id'
  })
  public coinid!: string;

  @Column({
    field: 'num',
    type: DataType.DECIMAL(65, 4),
    allowNull: false,
    comment: '资产数量'
  })
  public num!: string;

  @Column({
    field: 'address',
    type: DataType.STRING(64),
    allowNull: false,
    comment: '资产钱包地址'
  })
  public address!: string;

  @Column({
    field: 'item1',
    type: DataType.STRING(128),
    allowNull: false,
    comment: '预留1'
  })
  public item1!: string;

  @Column({
    field: 'freeeze',
    type: DataType.DECIMAL(65, 4),
    allowNull: false,
    comment: '冻结金额'
  })
  public freeeze!: string;
}

