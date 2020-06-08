
import fs from 'fs';
import AlipaySdk from 'alipay-sdk';
import { sign } from 'alipay-sdk/lib/util';

const APPID = '2019101768447665';
const PRIVATE_KEY = fs.readFileSync('dist/config/app-private-key.pem', 'ascii');
const PUBLIC_KEY = fs.readFileSync('dist/config/alipay-public-key.pem', 'ascii');

const config = {
  appId: APPID,
  privateKey: PRIVATE_KEY,
  alipayPublicKey: PUBLIC_KEY
};

const sdk = new AlipaySdk(config);

function formatUrl(url: string, params: any) {
  let requestUrl = url;
  const urlArgs = [
    'app_id', 'method', 'format', 'charset',
    'sign_type', 'sign', 'timestamp', 'version',
    'notify_url', 'return_url', 'auth_token', 'app_auth_token',
    'appCertSn', 'alipayRootCertSn'
  ];

  for (const key in params) {
    if (urlArgs.includes(key)) {
      const val = encodeURIComponent(params[key]);
      requestUrl = `${requestUrl}&${key}=${val}`;  // ${requestUrl.includes('?') ? '&' : '?'}
      delete params[key];
    }
  }

  //return { execParams: params, url: requestUrl };
  return (requestUrl + '&biz_content=' + encodeURIComponent(params.biz_content)).substr(1);
}

export function prepay(out_trade_no: string, total_amount: number, notify_url: string, subject?: string) {
  const method = 'alipay.trade.app.pay';
  const params = {
    notify_url,
    bizContent: {
      out_trade_no,
      total_amount,
      subject: encodeURIComponent(subject || '认证费用'),
      product_code: 'QUICK_MSECURITY_PAY'
    }
  };

  const signData = sign(method, params, sdk.config);
  return formatUrl('', signData);
}

export function checkNotifySign(data: any) {
  return sdk.checkNotifySign(data);
}

