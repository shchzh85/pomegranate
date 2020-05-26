import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';

@Table({
  tableName: 'tpz_config',
  indexes: [
    { unique: true, fields: ['name'] }
  ]
})
export class ConfigModel extends Model<ConfigModel> {
  
  @Column
  public namec!: string;

  @Column
  public name!: string;

  @Column
  public value!: string;

  @Column
  public comment!: string;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public group!: number;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public corder!: number;

  @Column
  public type!: string;
}
