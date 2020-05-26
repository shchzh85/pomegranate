
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_user_wallet',
})
export class CoinLogModel extends Model<CoinLogModel> {

  @Column({
    field: 'uid',
    allowNull: false,
    comment: '用户id'
  })
  public uid!: number;

  @Column({
    field: 'targetid',
    allowNull: false,
    comment: '目标用户id'
  })
  public targetid!: number;

  @Column({
    field: 'num',
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '变动数量'
  })
  public num!: number;

  @Column({
    field: 'oamount',
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '变动前数量'
  })
  public oamount!: number;

  @Column({
    field: 'namount',
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '变动后数量'
  })
  public namount!: number;


  @Column({
    field: 'username',
    allowNull: false,
    defaultValue: '',
    comment: '用户名称'
  })
  public username!: string;

  @Column({
    field: 'target',
    allowNull: false,
    defaultValue: '',
    comment: '目标用户名称'
  })
  public target!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '钱包id'
  })
  public wtype!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '变动类型(1增加,2减少)'
  })
  public ntype!: number;

  @Column({
    field: 'note',
    allowNull: false,
    defaultValue: '',
    comment: '日志类型'
  })
  public note!: string;

  @Column({
    allowNull: true,
    defaultValue: '',
    comment: '备注补充'
  })
  public remark!: string;

  @Column({
    allowNull: true,
    defaultValue: '',
    comment: '日志动作行为'
  })
  public action!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '行为id'
  })
  public actionid!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: 0,
    comment: '变动日期'
  })
  public dtime!: number;



}
