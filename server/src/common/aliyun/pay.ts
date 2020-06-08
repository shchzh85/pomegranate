
import fs from 'fs';
import AlipaySdk from 'alipay-sdk';
import { sign } from './node_modules/alipay-sdk/lib/util';

const APPID = '2019070265734364';
const PRIVATE_KEY = fs.readFileSync('app-private-key.pem', 'ascii');
const PUBLIC_KEY = fs.readFileSync('alipay-public-key.pem', 'ascii');

const config = {
  appId: '2019070265734364',
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
      requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${key}=${val}`;
      delete params[key];
    }
  }

  return { execParams: params, url: requestUrl };
}

export async function prepay(out_trade_no: string, total_amount: number, notify_url: string, subject?: string) {
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
  return formatUrl(sdk.config.gateway || '', signData);
}

export async function notify(out_trade_no: string) {

}

export async function check(out_trade_no: string) {
  
}
