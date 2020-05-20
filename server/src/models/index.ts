
import { sequelize } from '@common/dbs';

import { UserModel } from './user.model';
import { WalletModel } from './wallet.model';
import { CoinKind } from './coinkind.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const walletModel = sequelize.getRepository<WalletModel>(WalletModel);
export const coinKind = sequelize.getRepository<CoinKind>(CoinKind);

