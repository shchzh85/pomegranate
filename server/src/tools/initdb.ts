
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { sequelize } from '@common/dbs';
import { userRepository, coinKindRepository, configRepository } from '@models/index';

async function work() {
    await sequelize.sync({ force: true });

    await userRepository.create({
        username: 'root',
        password: '111111',
        dpassword: '111111',
        invitecode: '88888888',
        pid: 0,
        tops: ''
    });

    await coinKindRepository.bulkCreate([
        {
            coinname: 'goldseed',
            showname: '金种子',
            price: 10,
            rpcip: '127.0.0.1',
            rpcuser: '',
            rpcpass: '',
            rpcport: '8545',
            coinlog: '',
            buyfee: 0,
            sellfee: 0,
            status: 1,
            jumpid: 2,
            recharge_flg: 1,
            send_flg: 0,
            c2c_flg: 1
        },
        {
            coinname: 'seedbank',
            showname: '仓储金种子',
            price: 7,
            rpcip: '',
            rpcuser: '',
            rpcpass: '',
            rpcport: '',
            coinlog: '',
            buyfee: 0,
            sellfee: 0,
            status: 1,
            jumpid: 3,
            recharge_flg: 1,
            send_flg: 0,
            c2c_flg: 0
        }
    ]);

    await configRepository.bulkCreate([
        {
            name: 'version',
            value: '2.0.0'
        },
        {
            name: 'web_status',
            value: '1'
        },
        {
            name: 'banner1',
            value: 'http://pics1.baidu.com/feed/8b82b9014a90f603f70603e7f4e3b91db251edd0.jpeg?token=f963dde2e87f5dd93e9ab0cf13647dbe&amp;s=1889DD5F52F06790E604A15D0300C033'
        },
        {
            name: 'banner2',
            value: 'http://pics1.baidu.com/feed/8b82b9014a90f603f70603e7f4e3b91db251edd0.jpeg?token=f963dde2e87f5dd93e9ab0cf13647dbe&amp;s=1889DD5F52F06790E604A15D0300C033'
        },
        {
            name: 'fktime',
            value: '30'
        },
        {
            name: 'sktime',
            value: '30'
        },
        {
            name: 'c2cPrice',
            value: '0.35'
        },
        {
            name: 'c2c_flg',
            value: '1'
        },
        {
            name: 'buyMax',
            value: '20000'
        },
        {
            name: 'buyMin',
            value: '5'
        },
        {
            name: 'opentime',
            value: '8'
        },
        {
            name: 'closetime',
            value: '24'
        },
        {
            name: 'tixiansxf',
            value: '0'
        },
        {
            name: 'txLimit',
            value: '0'
        },
        {
            name: 'message',
            value: '0'
        },
        {
            name: 'msm_appkey',
            value: 'bicun520'
        },
        {
            name: 'msm_secretkey',
            value: '9362ff126e459aff8bad'
        },
        {
            name: 'register',
            value: '1'
        },
        {
            name: 'c2cchaoshiall',
            value: '1'
        },
        {
            name: 'android_update',
            value: '1'
        }
        {
            name: 'ios_update',
            value: '0'
        }
        {
            name: 'package_url',
            value: 'https://'
        }
        {
            name: 'hot_update_url',
            value: 'http://120.24.52.2:9103/update/202005280007.wgt'
        },
        {
            name: 'android_download_url',
            value: 'http://120.24.52.2:9103/update/release-202005280007.apk'
        },
        {
            name: 'ios_download_url',
            value: ''
        }
    ]);
}

work()
.then(() => {
    console.log('done.');
    process.exit(0);
});
