
import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_coin_log',
  indexes: [
    { name: 'co_u_x', fields: [ 'uid', 'wtype' ] },
    { name: 'cod_u_x', fields: [ 'wtype' ] }
  ]
})
export class CoinLogModel extends Model<CoinLogModel> {

  @Column({
    allowNull: false,
    comment: '用户id'
  })
  public uid!: number;

  @Column({
    allowNull: false,
    comment: '目标用户id'
  })
  public targetid!: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    comment: '变动数量'
  })
  public num!: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    comment: '变动前数量'
  })
  public oamount!: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    comment: '变动后数量'
  })
  public namount!: number;

  @Column({
    allowNull: false,
    defaultValue: '',
    comment: '用户名称'
  })
  public username!: string;

  @Column({
    allowNull: false,
    comment: '目标用户名称'
  })
  public target!: string;

  @Column({
    type: DataType.TINYINT(2),
    allowNull: false,
    comment: 'coinid'
  })
  public wtype!: number;

  @Column({
    type: DataType.TINYINT(2),
    allowNull: false,
    defaultValue: 1,
    comment: '变动类型(1增加,2减少)'
  })
  public ntype!: number;

  @Column({
    allowNull: false,
    comment: '日志类型'
  })
  public note!: string;

  @Column({
    comment: '备注补充'
  })
  public remark!: string;

  @Column({
    allowNull: false,
    comment: '日志动作行为'
  })
  public action!: string;

  @Column({
    comment: '行为id'
  })
  public actionid!: number;

  @Column({
    allowNull: false,
    comment: '变动日期'
  })
  public dtime!: Date;
}
