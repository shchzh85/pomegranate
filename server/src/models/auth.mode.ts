import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
      
@Table({
  tableName: 'tpz_auth',
  indexes: [
    { unique: true, name: 'orderid', fields: ['orderid'] },
    { name: 'uid', fields: ['uid'] },
    { name: 'username', fields: ['username'] },
    { name: 'uid_status', fields: ['uid', 'status'] }
  ]
})
export class AuthModel extends Model<AuthModel> {

  @Column({
    allowNull: false
  })
  public uid!: number;

  @Column
  public username!: string;

  @Column({
    allowNull: false
  })
  public orderid!: string;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public status!: number;  // -1 revoked, 0: wait_pay, 1: paid

  @Column
  public idcard!: string;

  @Column
  public realname!: string;

  @Column
  public token!: string;

  @Column({
    allowNull: false,
    defaultValue: 0
  })
  public facetimes!: number;

  @Column({
      allowNull: false,
      defaultValue: 0
  })
  public facestatus!: number; // 0: init, 1: failed, 2: success
}
