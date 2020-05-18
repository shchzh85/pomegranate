import { sequelize } from '@common/dbs';
sequelize.sync({ force: true })
    .then(() => console.log('done.'));