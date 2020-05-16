
import { sequelize } from '@common/dbs';

import { UserModel } from './user.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);

