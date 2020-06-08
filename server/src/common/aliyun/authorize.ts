

import { callApi } from './sdk';

export function getToken(bizId: string) {
  return callApi('DescribeVerifyToken', bizId);
}

export function getResult(bizId: string) {
  return callApi('DescribeVerifyResult', bizId);
}
