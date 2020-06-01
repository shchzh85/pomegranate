import {
  Table,
  Column,
  Model
} from 'sequelize-typescript';
  
@Table({
  tableName: 'tpz_quest_video',
  indexes: [
    { name: 'video_uid', fields: ['video_uid'] }
  ]
})
export class QuestVideoModel extends Model<QuestVideoModel> {

  @Column({
    field: 'video_title'
  })
  public title!: string;

  @Column({
    field: 'video_uid'
  })
  public uid!: number;

  @Column({
    field: 'video_url'
  })
  public url!: string;

  @Column({
    field: 'video_text'
  })
  public text!: string;

  @Column({
    field: 'video_date'
  })
  public date!: Date;

  @Column
  public objects!: string;
}
