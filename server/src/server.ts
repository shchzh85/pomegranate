
require('module-alias/register');

import app from './app';
import { sequelize } from './common/dbs';
import { logger } from './common/utils';

const START_SERVER = process.env.START_SERVER || 'user';
const port = process.env.PORT || 80;

async function run() {
  try {
    await sequelize.authenticate();
    app.listen(port, () => logger.info(`app start up, port: ${port}  --  ${START_SERVER}`));
  } catch (e) {
    logger.error(e.message);
    process.exit(1);
  }
}

run();

