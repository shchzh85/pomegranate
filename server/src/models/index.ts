
import { sequelize } from '@common/dbs';

import { UserModel } from './user.model';
import { WalletModel } from './wallet.model';
import { CoinKindModel } from './coin_kind.model';
import { QuestsModel } from './quests.model';
import { QuestKindModel } from './quset_kind.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const walletRepository = sequelize.getRepository<WalletModel>(WalletModel);
export const coinKindRepository = sequelize.getRepository<CoinKindModel>(CoinKindModel);
export const questsRepository = sequelize.getRepository<QuestsModel>(QuestsModel);
export const questKindRepository = sequelize.getRepository<QuestKindModel>(QuestKindModel);
