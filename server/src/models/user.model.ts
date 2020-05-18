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

    // id
    @Column({
        field: 'id',
        type: DataType.NUMBER(),
        allowNull: false,

    })
    public phone!: number;
    // username
    @Column({
        field: 'username',
        type: DataType.STRING(),
        allowNull: false
    })
    public username!: string;
    // password
    @Column({
        field: 'password',
        type: DataType.STRING(),
        allowNull: false
    })
    public password!: string;
    // ustatus
    @Column({
        field: 'ustatus',
        type: DataType.INTEGER,
        allowNull: false
    })
    public ustatus!: number;
    // lastlog
    @Column({
        field: 'lastlog',
        type: DataType.INTEGER,
        allowNull: false
    })
    public lastlog!: number;
    // wallet
    @Column({
        field: 'wallet',
        type: DataType.STRING(),
        allowNull: false
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
        type: DataType.STRING(),
        allowNull: false
    })
    public tops!: string;
    // userlevel
    @Column({
        field: 'userlevel',
        type: DataType.INTEGER,
        allowNull: false
    })
    public userlevel!: number;
    // invitecode
    @Column({
        field: 'invitecode',
        type: DataType.STRING(),
        allowNull: true
    })
    public invitecode!: string;
    // imgurl
    @Column({
        field: 'imgurl',
        type: DataType.STRING(),
        allowNull: true
    })
    public imgurl!: string;

    // nickname
    @Column({
        field: 'nickname',
        type: DataType.STRING(),
        allowNull: false
    })
    public nickname!: string;

    // utel
    @Column({
        field: 'utel',
        type: DataType.STRING(),
        allowNull: true
    })
    public utel!: string;

    // token
    @Column({
        field: 'token',
        type: DataType.STRING(),
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
        type: DataType.STRING(),
        allowNull: false
    })
    public uilang!: string;

    // reason
    @Column({
        field: 'reason',
        type: DataType.STRING(),
        allowNull: true
    })
    public reason!: string;

    // zfb
    @Column({
        field: 'zfb',
        type: DataType.STRING(),
        allowNull: true
    })
    public zfb!: string;

    // mz
    @Column({
        field: 'mz',
        type: DataType.STRING(),
        allowNull: true
    })
    public mz!: string;

    // bankname
    @Column({
        field: 'bankname',
        type: DataType.STRING(),
        allowNull: true
    })
    public bankname!: string;

    // zhihang
    @Column({
        field: 'zhihang',
        type: DataType.STRING(),
        allowNull: true
    })
    public zhihang!: string;

    // cardno
    @Column({
        field: 'cardno',
        type: DataType.STRING(),
        allowNull: true
    })
    public cardno!: string;

    // shiming
    @Column({
        field: 'shiming',
        type: DataType.INTEGER,
        allowNull: false,
    })
    public shiming!: number;

    // is_error
    @Column({
        field: 'is_error',
        type: DataType.INTEGER,
        allowNull: false
    })
    public is_error!: number;

    // is_shifang
    @Column({
        field: 'is_shifang',
        type: DataType.INTEGER,
        allowNull: false
    })
    public is_shifang!: number;

    // member_flg
    @Column({
        field: 'member_flg',
        type: DataType.INTEGER,
        allowNull: false
    })
    public member_flg!: number;

    // zhitui_num
    @Column({
        field: 'zhitui_num',
        type: DataType.INTEGER,
        allowNull: false
    })
    public zhitui_num!: number;

    // group_member_num
    @Column({
        field: 'group_member_num',
        type: DataType.INTEGER,
        allowNull: false
    })
    public group_member_num!: number;

    // weifukuan_num
    @Column({
        field: 'weifukuan_num',
        type: DataType.INTEGER,
        allowNull: false
    })
    public weifukuan_num!: number;

    // sunshine
    @Column({
        field: 'sunshine',
        type: DataType.INTEGER,
        allowNull: false
    })
    public sunshine!: number;

    // sunshine_1
    @Column({
        field: 'sunshine_1',
        type: DataType.INTEGER,
        allowNull: false
    })
    public sunshine_1!: number;

    // today_in
    @Column({
        field: 'today_in',
        type: DataType.DECIMAL,
        allowNull: false
    })
    public today_in!: number;


    // c2c_flg
    @Column({
        field: 'c2c_flg',
        type: DataType.INTEGER,
        allowNull: false
    })
    public c2c_flg!: number;


    // fee
    @Column({
        field: 'fee',
        type: DataType.INTEGER,
        allowNull: false
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
        allowNull: false
    })
    public nlevel!: number;

    // today_in_own
    @Column({
        field: 'today_in_own',
        type: DataType.INTEGER,
        allowNull: false
    })
    public today_in_own!: number;

    // is_new
    @Column({
        field: 'is_new',
        type: DataType.INTEGER,
        allowNull: false
    })
    public is_new!: number;

    // sell_times
    @Column({
        field: 'sell_times',
        type: DataType.INTEGER,
        allowNull: false
    })
    public sell_times!: number;



}

