
import { sequelize } from '@common/dbs';

import { UserModel } from './user.model';
import { WalletModel } from './wallet.model';
import { CoinKindModel } from './coin_kind.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const walletRepository = sequelize.getRepository<WalletModel>(WalletModel);
export const coinKindRepository = sequelize.getRepository<CoinKindModel>(CoinKindModel);

