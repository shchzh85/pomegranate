import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
    
@Table({
  tableName: 'tpz_c2c_orders',
  indexes: [
    { name: 'add_time', fields: ['dtime'] },
    { name: 'cid', fields: ['cid'] },
    { name: 'member_id', fields: ['uid'] },
    { name: 'trade_id', fields: ['toname'] },
    { name: 'member_id_2', fields: ['uid', 'cid', 'toname', 'price', 'num', 'status', 'paytype'] },
    { name: 'status', fields: ['paytype'] },
    { name: 'currency_id', fields: ['cid', 'dtime'] },
    { name: 'price', fields: ['price'] }
  ]
})
export class C2cOrderModel extends Model<C2cOrderModel> {

  @Column({
    allowNull: false
  })
  public uid!: number;
  
  @Column
  public uname!: string;

  @Column({
    allowNull: false
  })
  public toid!: number;

  @Column
  public toname!: string;

  @Column
  public cid!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false
  })
  public price!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false
  })
  public num!: number;
  
  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false
  })
  public amount!: number;

  @Column({
    //type: DataType.TINYINT(2),
    allowNull: false,
    defaultValue: 0,
    comment: '1:卖  2:买  3:已匹配  4:交易中 5:已完成  -1:撤单'
  })
  public status!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    defaultValue: 0,
    comment: '手续费，记录的是比例'
  })
  public fee!: number;

  @Column
  public dtime!: number;

  @Column
  public paytype!: string;

  @Column
  public pair!: string;

  @Column
  public buypid!: number;

  @Column
  public sellpid!: number;

  @Column
  public fktime!: number;

  @Column
  public sktime!: number;

  @Column
  public imgs!: string;
  
  @Column
  public orderid!: string;
}
  
