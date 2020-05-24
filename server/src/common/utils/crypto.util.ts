
import crypto from 'crypto';

function md5(key: string) {
    return crypto.createHash('md5').update(key).digest('hex');
}

export { md5 };
