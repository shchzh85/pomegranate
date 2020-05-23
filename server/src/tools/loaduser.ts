
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import * as _ from 'lodash';
import { sequelize, redisClient } from '@common/dbs';
import { userRepository } from '@models/index';
import { redisStore } from '@store/index'; 

const limit = 50;
const SET = 'cy:uset';

async function loaduser(start: number, end?: number) {

    let offset = start * limit;

    console.log('Load User Info...');

    do {
        console.log('page: ' + offset / limit);
        const us = await userRepository.findAll({
            attributes: [ 'id', 'sunshine_1', 'tops' ],
            offset,
            limit
        });

        if (_.isEmpty(us))
            break;

	const usv = _.filter(us, v => v.sunshine_1 != 0);

        if (_.size(usv) > 0) {
            const cmds = usv.map(u => {
                const ids = u.tops.split(',');
                return ids.map(id => [ 'zincrby', SET, u.sunshine_1, id ]);
            });

            await redisClient.multi(_.flatten(cmds)).exec();
        }

        if (_.isNumber(end) && offset >= end * limit)
            break;

        offset += limit;
    } while (true);

    console.log('Load done.');
}

async function update(start: number, end ?: number) {
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
            const score = await redisStore.zscore(SET, u.id);
            await userRepository.update({
                sunshine: _.defaultTo(score, 0)
            }, { where: { id: u.id } });
        }

        if (_.isNumber(end) && offset >= end * limit)
            break;

        offset += limit;
    } while (true);

    console.log('Update done.');
}

async function parse(data: string) {
    const words = data.split(' ');
    const cmd = words[0];

    console.log('enter parse: ' + cmd);

    if (words.length < 2) {
        console.log('input error');
        return;
    }

    if (cmd == 'load') {
        await loaduser(Number(words[1]), words[2] ? Number(words[2]) : undefined);
    } else if (cmd == 'update') {
        await update(Number(words[1]), words[2] ? Number(words[2]) : undefined);
    }
}

process.stdin.on('data', async data => await parse(data.toString().trim()));
