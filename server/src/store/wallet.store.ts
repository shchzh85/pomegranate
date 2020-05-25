
import BaseStore from './base.store';
import { walletRepository } from '@models/';
import { Exception } from '@common/exceptions';
import { ErrCode } from '@common/enums';
import { Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

class WalletStore extends BaseStore {

    public findByUid(uid: string) {
        return walletRepository.findAll({ where: { uid } });
    }

    public find(uid: string, coinid: number) {
        return walletRepository.findOne({ where: { uid, coinid } });
    }

    public async pay(uid: string, coinid: number, count: number, transaction?: Transaction) {
        if (count <= 0)
            throw new Exception(ErrCode.SERVER_ERROR, '扣除余额不大于0');

        const { affectedCount } = await walletRepository.update({
            num: Sequelize.literal('num-' + count)
        }, {
            where: { uid, coinid, num: { [Op.gte]: count } },
            transaction
        });

        return affectedCount === 1;
    }
}

export const walletStore = new WalletStore();
