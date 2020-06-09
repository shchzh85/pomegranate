
const Core = require('@alicloud/pop-core');

const ALI_FACE_ACCESS_KEY = process.env.ALI_FACE_ACCESS_KEY || '';
const ALI_FACE_ACCESS_SECRET = process.env.ALI_FACE_ACCESS_SECRET || '';

const client = new Core({
  accessKeyId: ALI_FACE_ACCESS_KEY,
  accessKeySecret: ALI_FACE_ACCESS_SECRET,
  endpoint: 'https://cloudauth.aliyuncs.com',
  apiVersion: '2019-03-07'
});

const params = {
  "RegionId": "cn-hangzhou",
  "BizType": "ciyinvertify"
}

const requestOption = {
  method: 'POST'
};

export function callApi(name: string, BizId: string) {
  return client.request(name, { ...params, BizId }, requestOption);
}
