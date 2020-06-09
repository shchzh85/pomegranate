
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
import { C2cOrderModel } from './c2c_order.model';
import { C2cShimingModel } from './c2c_shiming.model';
import { DealModel } from './deal.model';
import { PriceHistoryModel } from './price_history.model';
import { BannerModel } from './banner.model';
import { NewsModel } from './news.model';
import { BusinessCollegeModel } from './business_college.model';
import { QrcodeModel }  from './qrcode.model';
import { QuestVideoModel } from './quest_video.model';
import { AuthModel } from './auth.model';

export const userRepository = sequelize.getRepository<UserModel>(UserModel);
export const userSessionRepository = sequelize.getRepository<UserSessionModel>(UserSessionModel);
export const walletRepository = sequelize.getRepository<WalletModel>(WalletModel);
export const coinKindRepository = sequelize.getRepository<CoinKindModel>(CoinKindModel);
export const questsRepository = sequelize.getRepository<QuestsModel>(QuestsModel);
export const questKindRepository = sequelize.getRepository<QuestKindModel>(QuestKindModel);
export const questTimesRepository = sequelize.getRepository<QuestTimesModel>(QuestTimesModel);
export const questLevelBonusRepository = sequelize.getRepository<QuestLevelBonusModel>(QuestLevelBonusModel);
export const coinLogRepository = sequelize.getRepository<CoinLogModel>(CoinLogModel);
export const questRewardRepository = sequelize.getRepository<QuestRewardModel>(QuestRewardModel);
export const configRepository = sequelize.getRepository<ConfigModel>(ConfigModel);
export const dealRepository = sequelize.getRepository<DealModel>(DealModel);
export const c2cOrderRepository = sequelize.getRepository<C2cOrderModel>(C2cOrderModel);
export const c2cShimingRepository = sequelize.getRepository<C2cShimingModel>(C2cShimingModel);
export const priceHistoryRepository = sequelize.getRepository<PriceHistoryModel>(PriceHistoryModel);
export const bannerRepository = sequelize.getRepository<BannerModel>(BannerModel);
export const newsRepository = sequelize.getRepository<NewsModel>(NewsModel);
export const businessCollegeRepository = sequelize.getRepository<BusinessCollegeModel>(BusinessCollegeModel);
export const qrcodeRepository = sequelize.getRepository<QrcodeModel>(QrcodeModel);
export const questVideoRepository = sequelize.getRepository<QuestVideoModel>(QuestVideoModel);
export const authRepository = sequelize.getRepository<AuthModel>(AuthModel);