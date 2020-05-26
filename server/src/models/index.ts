
import { sequelize } from '@common/dbs';
import { UserModel } from './user.model';
import { UserSessionModel } from './user_session.model';
import { WalletModel } from './wallet.model';
import { CoinKindModel } from './coin_kind.model';
import { QuestsModel } from './quests.model';
import { QuestKindModel } from './quest_kind.model';
import { QuestTimesModel } from './quest_times.model';
import { QuestLevelBonusModel } from './quest_level_bonus.model';
import { CoinLogModel } from './coin_log.model';
import { QuestRewardModel } from './quest_reward.model';
import { ConfigModel } from './config.model';
import { C2COrderModel } from './c2c_order.model';
import { C2CShimingModel } from './c2c_shiming.model';
import { DealModel } from './deal.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const userSessionRepository = sequelize.getRepository<UserSessionModel>(UserSessionModel);
export const walletRepository = sequelize.getRepository<WalletModel>(WalletModel);
export const coinKindRepository = sequelize.getRepository<CoinKindModel>(CoinKindModel);
export const questsRepository = sequelize.getRepository<QuestsModel>(QuestsModel);
export const questKindRepository = sequelize.getRepository<QuestKindModel>(QuestKindModel);
export const questTimesRepository = sequelize.getRepository<QuestTimesModel>(QuestTimesModel);
export const questLevelBonusRepository = sequelize.getRepository<QuestLevelBonusModel>(QuestLevelBonusModel);
export const coinLogModelRepository = sequelize.getRepository<CoinLogModel>(CoinLogModel);
export const questRewardRepository = sequelize.getRepository<QuestRewardModel>(QuestRewardModel);
export const configRepository = sequelize.getRepository<ConfigModel>(ConfigModel);
export const dealRepository = sequelize.getRepository<DealModel>(DealModel);
export const c2cOrderRepository = sequelize.getRepository<C2COrderModel>(C2COrderModel);
export const c2cShimingRepository = sequelize.getRepository<C2CShimingModel>(C2CShimingModel);
