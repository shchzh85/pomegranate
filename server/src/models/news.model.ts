import {
  Table,
  Column,
  DataType,
  Model
} from 'sequelize-typescript';
    
@Table({
  tableName: 'tpz_news'
})
export class NewsModel extends Model<NewsModel> {

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
    defaultValue: ''
  })
  public title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  public content!: string;

  @Column({
    allowNull: false
  })
  public ctime!: Date;

  @Column({
    allowNull: false
  })
  public utime!: Date;
}
