
import {
    Table,
    Column,
    DataType,
    Model
} from 'sequelize-typescript';

@Table({
    tableName: 'tpz_admin_user',
    indexes: [
        { name: 'username', fields: [ 'username' ], unique: true },
        { name: 'invitecode', fields: [ 'invitecode' ], unique: true },
        { name: 'utime', fields: [ 'utime' ] },
        { name: 'pid', fields: [ 'pid' ] }
    ]
})
export class UserModel extends Model<UserModel> {

    @Column({
        allowNull: false,
        comment: '用户名'
    })
    public username!: string;

    @Column({
        allowNull: false,
        comment: '密码'
    })
    public password!: string;

    @Column({
        allowNull: false,
        comment: '交易密码'
    })
    public dpassword!: string;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '注册时间'
    })
    public utime!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '0正常状态，1冻结状态'
    })
    public ustatus!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '最后登录时间'
    })
    public lastlog!: number;

    @Column({
        allowNull: false,
        defaultValue: '',
        comment: '钱包地址'
    })
    public wallet!: string;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '上级'
    })
    public pid!: number;

    @Column({
        type: DataType.TEXT,
        comment: '上级们'
    })
    public tops!: string;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '个人等级'
    })
    public userlevel!: number;

    @Column
    public invitecode!: string;

    @Column({
        comment: '头像ULR'
    })
    public imgurl!: string;

    @Column
    public nickname!: string;

    @Column({
        comment: 'Phone'
    })
    public utel!: string;

    @Column({
        allowNull: false,
        defaultValue: 'zh'
    })
    public uilang!: string;

    @Column({
        allowNull: false,
        defaultValue: ''
    })
    public reason!: string;

    @Column
    public zfb!: string;

    @Column
    public mz!: string;

    @Column
    public bankname!: string;

    @Column
    public zhihang!: string;

    @Column
    public cardno!: string;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '是否实名0未实名  1审核中 2已实名 4审核失败'
    })
    public shiming!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '是否异常'
    })
    public is_error!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '是否释放'
    })
    public is_shifang!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '是否是有效会员1:是 0:不是'
    })
    public member_flg!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '直推人数'
    })
    public zhitui_num!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '团队有效人数'
    })
    public group_member_num!: number;

    @Column({
        allowNull: false,
        defaultValue: 0
    })
    public weifukuan_num!: number;

    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '阳光'
    })
    public sunshine!: number;

    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '自己的阳光值'
    })
    public sunshine_1!: number;

    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    })
    public today_in!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '免手续费标记'
    })
    public c2c_flg!: number;

    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.5,
        comment: '手续费'
    })
    public fee!: number;

    @Column({
        field: 'shiming_time',
        allowNull: false,
        defaultValue: 0,
        comment: '实名时间'
    })
    public shiming_time!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '业务等级'
    })
    public nlevel!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '今日任务收益'
    })
    public today_in_own!: number;

    @Column({
        allowNull: false,
        defaultValue: 0,
        comment: '是否是新会员'
    })
    public is_new!: number;

    @Column({
        allowNull: false,
        defaultValue: 0
    })
    public sell_times!: number;
}
