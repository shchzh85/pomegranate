import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_dealtp1'
})
export class DealModel extends Model<DealModel> {

  @Column({
    allowNull: false
  })
  public uid!: number;

  @Column
  public uname!: string;

  @Column
  public toid!: number;

  @Column
  public toname!: string;

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
    type: DataType.DECIMAL(20,4),
    allowNull: false,
    defaultValue: 0
  })
  public sxf!: number;

  @Column({
    //type: DataType.TINYINT(2),
    allowNull: false,
    defaultValue: 0
  })
  public status!: number;

  @Column
  public fktime!: number;

  @Column
  public dtime!: number;

  @Column
  public stime!: number;

  @Column
  public picpath!: string;

  @Column
  public cid!: number;

  @Column
  public paytype!: string;

  @Column
  public orderid!: number;

  @Column({
    type: DataType.DECIMAL(20,4),
    allowNull: false
  })
  public all_num!: number;
}
