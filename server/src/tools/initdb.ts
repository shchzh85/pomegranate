
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { sequelize } from '@common/dbs';
import { userRepository, coinKindRepository } from '@models/index';

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

//    await coinKindRepository.bulkCreate([

//   ]);
}

work()
.then(() => {
    console.log('done.');
});
