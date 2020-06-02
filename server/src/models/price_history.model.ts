import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_price_history'
})
export class PriceHistoryModel extends Model<PriceHistoryModel> {

  @Column({
    type: DataType.DECIMAL(20, 4),
    allowNull: false
  })
  public price!: number;

  @Column({
      allowNull: false
  })
  public pdate!: Date;
}
