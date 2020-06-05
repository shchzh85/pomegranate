
import { configStore } from '@store/index';

const OSS_URL = process.env.OSS_URL;

export function resUrl(path: string)
{
    return 'https://' + OSS_URL + '/' + path;
}
