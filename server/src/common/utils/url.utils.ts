
import { configStore } from '@store/index';

export function resUrl(path: string)
{
    const host = configStore.get('app.aliyun_oss.url');
    return 'https://' + host + '/' + path;
}
