import {
    Table,
    Column,
    DataType,
    Model
} from 'sequelize-typescript';

@Table({
    tableName: 'tpz_admin_user',

})
export class UserModel extends Model<UserModel> {

    // username
    @Column({
        field: 'username',
        type: DataType.STRING(255),
        allowNull: false,
        comment: '用户名',
        unique: true
    })
    public username!: string;
    // password
    @Column({
        field: 'password',
        type: DataType.STRING(255),
        allowNull: false,
        comment: '用户密码'
    })
    public password!: string;
        // password
    @Column({
        field: 'dpassword',
        type: DataType.STRING(255),
        allowNull: false,
        comment: '用户密码'
    })
    public dpassword!: string;
    // ustatus
    @Column({
        field: 'ustatus',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0

    })
    public ustatus!: number;
    // lastlog
    @Column({
        field: 'lastlog',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public lastlog!: number;
    // wallet
    @Column({
        field: 'wallet',
        type: DataType.STRING(255),
        allowNull: false,
        defaultValue: 0
    })
    public wallet!: string;
    // pid
    @Column({
        field: 'pid',
        type: DataType.INTEGER,
        allowNull: false
    })
    public pid!: number;
    // tops
    @Column({
        field: 'tops',
        type: DataType.STRING(255),
        allowNull: false
    })
    public tops!: string;
    // userlevel
    @Column({
        field: 'userlevel',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public userlevel!: number;
    // invitecode
    @Column({
        field: 'invitecode',
        type: DataType.STRING(255),
        allowNull: true,
        unique: true
    })
    public invitecode!: string;
    // imgurl
    @Column({
        field: 'imgurl',
        type: DataType.STRING(255),
        allowNull: true
    })
    public imgurl!: string;

    // nickname
    @Column({
        field: 'nickname',
        type: DataType.STRING(255),
        allowNull: false,
        defaultValue: 0
    })
    public nickname!: string;

    // utel
    @Column({
        field: 'utel',
        type: DataType.STRING(255),
        allowNull: true,
    })
    public utel!: string;

    // token
    @Column({
        field: 'token',
        type: DataType.STRING(255),
        allowNull: true
    })
    public token!: string;

    // lasttime
    @Column({
        field: 'lasttime',
        type: DataType.INTEGER,
        allowNull: true
    })
    public lasttime!: number;

    // uilang
    @Column({
        field: 'uilang',
        type: DataType.STRING(255),
        allowNull: false,
        defaultValue: 'zh'
    })
    public uilang!: string;

    // reason
    @Column({
        field: 'reason',
        type: DataType.STRING(255),
        allowNull: true
    })
    public reason!: string;

    // zfb
    @Column({
        field: 'zfb',
        type: DataType.STRING(255),
        allowNull: true
    })
    public zfb!: string;

    // mz
    @Column({
        field: 'mz',
        type: DataType.STRING(255),
        allowNull: true
    })
    public mz!: string;

    // bankname
    @Column({
        field: 'bankname',
        type: DataType.STRING(255),
        allowNull: true
    })
    public bankname!: string;

    // zhihang
    @Column({
        field: 'zhihang',
        type: DataType.STRING(255),
        allowNull: true
    })
    public zhihang!: string;

    // cardno
    @Column({
        field: 'cardno',
        type: DataType.STRING(255),
        allowNull: true,
        unique: true
    })
    public cardno!: string;

    // shiming
    @Column({
        field: 'shiming',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public shiming!: number;

    // is_error
    @Column({
        field: 'is_error',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public is_error!: number;

    // is_shifang
    @Column({
        field: 'is_shifang',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public is_shifang!: number;

    // member_flg
    @Column({
        field: 'member_flg',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public member_flg!: number;

    // zhitui_num
    @Column({
        field: 'zhitui_num',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public zhitui_num!: number;

    // group_member_num
    @Column({
        field: 'group_member_num',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public group_member_num!: number;

    // weifukuan_num
    @Column({
        field: 'weifukuan_num',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public weifukuan_num!: number;

    // sunshine
    @Column({
        field: 'sunshine',
        type: DataType.DECIMAL(65, 4),
        allowNull: false,
        defaultValue: 0
    })
    public sunshine!: number;

    // sunshine_1
    @Column({
        field: 'sunshine_1',
        type: DataType.DECIMAL(65, 4),
        allowNull: false,
        defaultValue: 0
    })
    public sunshine_1!: number;

    // today_in
    @Column({
        field: 'today_in',
        type: DataType.DECIMAL(65, 4),
        allowNull: false,
        defaultValue: 0
    })
    public today_in!: number;


    // c2c_flg
    @Column({
        field: 'c2c_flg',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public c2c_flg!: number;


    // fee
    @Column({
        field: 'fee',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public fee!: number;

    // shiming_time
    @Column({
        field: 'shiming_time',
        type: DataType.INTEGER,
        allowNull: true
    })
    public shiming_time!: number;

    // nlevel
    @Column({
        field: 'nlevel',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public nlevel!: number;

    // today_in_own
    @Column({
        field: 'today_in_own',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public today_in_own!: number;

    // is_new
    @Column({
        field: 'is_new',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    public is_new!: number;

    // sell_times
    @Column({
        field: 'sell_times',
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    public sell_times!: number;



}

