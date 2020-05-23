
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { sequelize } from '@common/dbs';

sequelize.sync({ force: true })
.then(() => console.log('done.'));
