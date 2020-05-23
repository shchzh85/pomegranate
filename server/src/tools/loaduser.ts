
require('module-alias/register');
import * as _ from 'lodash';
import { sequelize, redisClient } from '@common/dbs';
import { userRepository } from '@models/index';

const limit = 20;
const SET = 'cy:uset';

async function loaduser(start: number) {

    let offset = start * limit;

    console.log('Load User Info...');

    do {
        console.log('page: ' + offset / limit);
        const us = await userRepository.findAll({
            attributes: [ 'id', 'sunshine1', 'pid' ],
            offset,
            limit
        });

        if (_.isEmpty(us))
            break;

        const cmds = us.map(u => [ 'zincrby', SET, u.sunshine1, u.pid ]);
        await redisClient.multi(cmds).exec();

        offset += limit;
    } while (true);

    console.log('Load done.');
}

async function update(start: number) {
    let offset = start * limit;

    console.log('Update User...');

    do {
        console.log('page: ' + offset / limit);
        const us = await userRepository.findAll({
            attributes: [ 'id' ],
            offset,
            limit
        });

        const cnt = _.size(us);
        if (_.isEmpty(us))
            break;

        for (let i = 0; i < cnt; i++) {
            const u = us[i];
            const score = await redisClient.zscore(SET, u.id);
            await userRepository.update({
                sunshine: _.defaultTo(score, 0)
            }, { where: { id: u.id } });
        }
    } while (true);

    console.log('Update done.');
}

async function parse(data: string) {
    const words = data.split(' ');
    const cmd = words[0];

    if (words.length !== 2) {
        console.log('input error');
        return;
    }

    if (cmd == 'load') {
        await loaduser(Number(words[1]));
    } else if (cmd == 'update') {
        await update(Number(words[1]));
    }
}

process.stdin.on('data', async data => await parse(data.toString().trim()));
