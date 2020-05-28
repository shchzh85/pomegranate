import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_c2c_shiming',
  indexes: [
    { unique: true, fields: ['uid'], name: 'uid' },
    { unique: true, fields: ['username'], name: 'username' }
  ]
})
export class C2cShimingModel extends Model<C2cShimingModel> {

  @Column({
      allowNull: false
  })
  public uid!: number;

  @Column({
    allowNull: false
  })
  public username!: string;

  @Column
  public mz!: string;

  @Column
  public smdate!: Date;

  @Column
  public zfbimg!: string;

  @Column
  public wximg!: string;

  @Column
  public bank!: string;

  @Column
  public zhihang!: string;

  @Column
  public cardno!: string;
}
