
import { sequelize } from '@common/dbs';

import { UserModel } from './user.model';
import { WalletModel } from './wallet.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const walletModel = sequelize.getRepository<WalletModel>(WalletModel);

