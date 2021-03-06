
import BaseStore from './base.store';
import { walletRepository } from '@models/index';
import { Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { Transaction, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export enum CoinType {
    ACTIVE = 1,
    BANK = 2
}

class WalletStore extends BaseStore {

    public findByUid(uid: string) {
        return walletRepository.findAll({ where: { uid } });
    }

    public find(uid: number | string, coinid: number, transaction?: Transaction) {
        return walletRepository.findOne({ where: { uid, coinid }, transaction });
    }

    public async pay(uid: string | number, coinid: number, count: number, transaction?: Transaction) {
        if (count <= 0)
            throw new Exception(Code.SERVER_ERROR, '扣除余额不大于0');

        const [ affectedCount ] = await walletRepository.update({
            num: Sequelize.literal('num-' + count)
        }, {
            where: { uid, coinid, num: { [Op.gte]: count } },
            transaction
        });

        return affectedCount === 1;
    }

    public async accept(uid: string | number, coinid: number, count: number, transaction?: Transaction) {
        if (count <= 0)
            throw new Exception(Code.SERVER_ERROR, '增加余额不大于0');

        const [ affectedCount ] = await walletRepository.update({
            num: Sequelize.literal('num+' + count)
        }, {
            where: { uid, coinid },
            transaction
        });

        return affectedCount === 1;
    }
}

export const walletStore = new WalletStore();
