import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_coinkind'
})
export class CoinKindModel extends Model<CoinKindModel> {

  @Column({
    field: 'coinname',
    type: DataType.STRING(255),
    allowNull: false,
    comment: '资产名称',
    unique: true
  })
  public coinname!: string;

  @Column({
    field: 'showname',
    type: DataType.STRING(255),
    allowNull: false,
    comment: '显示名称'
  })
  public showname!: string;

  @Column({
    field: 'price',
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    comment: '货币价格'
  })
  public price!: number;

  @Column({
    field: 'rpcip',
    type: DataType.STRING(64),
    allowNull: true,
    comment: '节点服务器ip'
  })
  public rpcip!: string;

  @Column({
    field: 'rpcuser',
    type: DataType.STRING(128),
    allowNull: true,
    comment: 'RPC用户名'
  })
  public rpcuser!: string;

  @Column({
    field: 'rpcpass',
    type: DataType.STRING(128),
    allowNull: true,
    comment: 'RPC密码'
  })
  public rpcpass!: string;

  @Column({
    field: 'buyfee',
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    comment: '购买手续费',
    defaultValue: 0
  })
  public buyfee!: number;

  @Column({
    field: 'sellfee',
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    comment: '卖出手续费',
    defaultValue: 0
  })
  public sellfee!: number;

  @Column({
    field: 'status',
    allowNull: false,
    comment: '货币状态',
    defaultValue: 0
  })
  public status!: number;

  @Column({
    field: 'jumpid',
    allowNull: false,
    comment: '钱包类型',
    defaultValue: 1
  })
  public jumpid!: number;

  @Column({
    field: 'iconpath',
    type: DataType.STRING(255),
    allowNull: true,
    comment: '图标路径'
  })
  public iconpath!: string;

  @Column({
    field: 'recharge_flg',
    allowNull: false,
    defaultValue: 1,
    comment: '是否允许充币'
  })
  public recharge_flg!: string;

  @Column({
    field: 'send_flg',
    allowNull: false,
    defaultValue: 0,
    comment: '是否允转币'
  })
  public send_flg!: number;

  @Column({
    field: 'c2c_flg',
    allowNull: false,
    defaultValue: 0,
    comment: '是否允许C2C'
  })
  public c2c_flg!: number;

  @Column({
    field: 'chongLimit',
    type: DataType.DECIMAL(20, 4),
    allowNull: false,
    defaultValue: 0,
    comment: '到账标准'
  })
  public chongLimit!: number;

  @Column({
    field: 'gjaddress',
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '归集地址'
  })
  public gjaddress!: string;

  @Column({
    field: 'offset',
    allowNull: false,
    defaultValue: 0,
    comment: '上次区块扫描地址位置'
  })
  public offset!: number;
}
