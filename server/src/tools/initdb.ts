
require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { sequelize } from '@common/dbs';
import { userRepository, coinKindRepository, configRepository, bannerRepository, newsRepository, businessCollegeRepository, qrcodeRepository, questVideoRepository, questKindRepository } from '@models/index';

async function work() {
    await sequelize.sync({ force: true });

    const now = new Date();

    await userRepository.create({
        username: 'root',
        password: '111111',
        dpassword: '111111',
        invitecode: '88888888',
        pid: 0,
        tops: ''
    });

    await coinKindRepository.bulkCreate([
        {
            coinname: 'goldseed',
            showname: '金种子',
            price: 10,
            rpcip: '127.0.0.1',
            rpcuser: '',
            rpcpass: '',
            rpcport: '8545',
            coinlog: '',
            buyfee: 0,
            sellfee: 0,
            status: 1,
            jumpid: 2,
            recharge_flg: 1,
            send_flg: 0,
            c2c_flg: 1
        },
        {
            coinname: 'seedbank',
            showname: '仓储金种子',
            price: 7,
            rpcip: '',
            rpcuser: '',
            rpcpass: '',
            rpcport: '',
            coinlog: '',
            buyfee: 0,
            sellfee: 0,
            status: 1,
            jumpid: 3,
            recharge_flg: 1,
            send_flg: 0,
            c2c_flg: 0
        }
    ]);

    await configRepository.bulkCreate([
        {
            name: 'version',
            value: '2.0.0'
        },
        {
            name: 'web_status',
            value: '1'
        },
        {
            name: 'banner1',
            value: 'http://pics1.baidu.com/feed/8b82b9014a90f603f70603e7f4e3b91db251edd0.jpeg?token=f963dde2e87f5dd93e9ab0cf13647dbe&amp;s=1889DD5F52F06790E604A15D0300C033'
        },
        {
            name: 'banner2',
            value: 'http://pics1.baidu.com/feed/8b82b9014a90f603f70603e7f4e3b91db251edd0.jpeg?token=f963dde2e87f5dd93e9ab0cf13647dbe&amp;s=1889DD5F52F06790E604A15D0300C033'
        },
        {
            name: 'fktime',
            value: '30'
        },
        {
            name: 'sktime',
            value: '30'
        },
        {
            name: 'c2cPrice',
            value: '0.35'
        },
        {
            name: 'c2c_flg',
            value: '1'
        },
        {
            name: 'buyMax',
            value: '20000'
        },
        {
            name: 'buyMin',
            value: '5'
        },
        {
            name: 'opentime',
            value: '8'
        },
        {
            name: 'closetime',
            value: '24'
        },
        {
            name: 'tixiansxf',
            value: '0'
        },
        {
            name: 'txLimit',
            value: '0'
        },
        {
            name: 'message',
            value: '0'
        },
        {
            name: 'msm_appkey',
            value: 'bicun520'
        },
        {
            name: 'msm_secretkey',
            value: '9362ff126e459aff8bad'
        },
        {
            name: 'register',
            value: '1'
        },
        {
            name: 'c2cchaoshiall',
            value: '1'
        },
        {
            name: 'android_update',
            value: '1'
        },
        {
            name: 'ios_update',
            value: '0'
        },
        {
            name: 'package_url',
            value: 'https://'
        },
        {
            name: 'hot_update_url',
            value: 'http://120.24.52.2:9103/update/202005280007.wgt'
        },
        {
            name: 'android_download_url',
            value: 'http://120.24.52.2:9103/update/release-202005280007.apk'
        },
        {
            name: 'ios_download_url',
            value: ''
        }
    ]);

    await bannerRepository.bulkCreate([
        {
            title: '1',
            banner: '1fd6a0e0c15743100a258afdffbca4e9.jpg',
            ctime: now,
            utime: now
        },
        {
            title: '2',
            banner: '0c471e7f1c7590cda7e28e84b1eb55db.jpg',
            ctime: now,
            utime: now
        }
    ]);

    await newsRepository.bulkCreate([
        {
            title: '111',
            content: '<p>sfsdfsdfsdfsdfdsfsd</p>',
            ctime: now,
            utime: now
        },
        {
            title: '333',
            content: '<p>sfsdfsdfsdfsdfdsfsd</p>',
            ctime: now,
            utime: now
        }
    ]);

    await businessCollegeRepository.bulkCreate([
        {
            title: '关于学习内容的通知',
            description: '今年春天，奶奶家阳台上的花盆里不知怎么的，冒出了两株苦瓜树，我可从来没见过苦瓜树，忽然，一个想法在我脑海中隐隐出现了。为了观察苦瓜树，我每天中午一放了学就去奶奶家认真打量它。',
            cover: '1fd6a0e0c15743100a258afdffbca4e9.jpg',
            audio: '3919e0bd3028a1ca6fc732b42eb163db.mp3',
            ctime: now,
            utime: now
        }
    ]);

    await qrcodeRepository.create({
        qrcode: '1cbdc6c8ac48186486138ad6cfc9a87e.png',
        email: '24624508091@qq.com',
        ctime: now,
        utime: now
    });

    await questVideoRepository.bulkCreate([
        {
            title: '哈哈哈哈哈哈',
            uid: 0,
            url: 'https://ossvdo.reechi.cn/180363224.mp4',
            date: now,
            text: '达成',
            objects: '180363224.mp4'
        },
        {
            title: '测试测试',
            uid: 0,
            url: 'https://ossvdo.reechi.cn/180388017.mp4',
            date: now,
            text: '怕怕怕怕怕',
            objects: '180388017.mp4'
        }
    ]);

    await questKindRepository.bulkCreate([
        {
            quest_name: '仁田',
            quest_price: 10,
            quest_reward: 12,
            quest_max_times: 1,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 1,
            quest_reward_persent: 0.2,
            quest_per_day_give: 0.3,
            quest_per_times_give: 0.05,
            actived: -1
        },
        {
            quest_name: '義田',
            quest_price: 10,
            quest_reward: 12,
            quest_max_times: 8,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 1,
            quest_reward_persent: 0.2,
            quest_per_day_give: 0.3,
            quest_per_times_give: 0.05,
            actived: 0
        },
        {
            quest_name: '礼田',
            quest_price: 100,
            quest_reward: 125,
            quest_max_times: 8,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 10,
            quest_reward_persent: 0.25,
            quest_per_day_give: 3.125,
            quest_per_times_give: 0.5208,
            actived: 0
        },
        {
            quest_name: '智田',
            quest_price: 1000,
            quest_reward: 1280,
            quest_max_times: 5,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 100,
            quest_reward_persent: 0.28,
            quest_per_day_give: 32,
            quest_per_times_give: 5.3333,
            actived: 0
        },
        {
            quest_name: '信田',
            quest_price: 5000,
            quest_reward: 6700,
            quest_max_times: 2,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 500,
            quest_reward_persent: 0.34,
            quest_per_day_give: 167.5,
            quest_per_times_give: 27.9167,
            actived: 0
        },
        {
            quest_name: '敬田',
            quest_price: 10000,
            quest_reward: 13500,
            quest_max_times: 1,
            quest_per_day_times: 6,
            quest_need_days: 40,
            quest_sunshine: 1000,
            quest_reward_persent: 0.35,
            quest_per_day_give: 337.5,
            quest_per_times_give: 56.25,
            actived: 0
        }
    ]);
}

work()
.then(() => {
    console.log('done.');
    process.exit(0);
});
