
const Core = require('@alicloud/pop-core');

const client = new Core({
  accessKeyId: 'LTAI4G9niULaoy1vNnoaZmmd',
  accessKeySecret: '9fp8ZEd4yrZZnWf4ht2PRzzumRiePN',
  endpoint: 'https://cloudauth.aliyuncs.com',
  apiVersion: '2019-03-07'
});

const params = {
  "RegionId": "cn-hangzhou",
  "BizType": "ciyinvertify"
  //"BizId": "39ecf51e-2f81-4dc5-90ee-ff86125be683"
}

const requestOption = {
  method: 'POST'
};

export function callApi(name: string, BizId: string) {
  return client.request(name, { ...params, BizId }, requestOption);
}
