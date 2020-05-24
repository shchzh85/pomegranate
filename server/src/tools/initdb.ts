
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { sequelize } from '@common/dbs';
import { userRepository, coinKindRepository } from '@models/index';
import { md5 } from '@common/utils';

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
}

work()
.then(() => {
    console.log('done.');
});
