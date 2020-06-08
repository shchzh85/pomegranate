
import AlipaySdk from 'alipay-sdk';

const APPID = '2019070265734364';
const PRIVATE_KEY = 'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCL2RjIRs0hdPwD69NsvuZn+YHBIFSrivpXMxWLX8owXYMGZsM7ouLNQvdX+ZTjP3Ee+3clRO0N9kBsh8FAwMKS0TLdIYDxgpbg9pmYWjZvZBIPfqTMVMvmdWG3ggVQD+3C0reeM5v1ECzWhqHPYrMt7AZHHR26Pw5Omx9iYH3oNjSkYaieuvWw80LQzYOUX33jL1HaXGGtN6UpVxgmPytqxBeKmslt60P+/UB6NJMpKO+VykdWSg+BZjFZOe329T8QGPk/xtP8uMh33sN6LegKqqzAhZXyxCy/kyvWBfrMwv7u/hFXY5go7PqRpN1PzuDSGJyfyUMBFdYk8P47XaQtAgMBAAECggEAIeNcvwNxJ99aRnT6CcsEuENc7vivq9YErebCHMD8lNXEL2PtgWEKRqUonNfs/VhdSB21lIFsVErM97+508AiJkOtaKp6vYtglmkLdUC/GiUMv1Z4Bs+xjUn6gOZv9SO3ANPhDOQCsdLWmrGLOl73fnRIXSkwD/bBt8idRVCOkhtcypRTXKaX10OEEVKECk3nVc1WIRK4l06WCdrvbDQJFwtXqIwOFMmlaG63rvMMlpnMNS9XIPwIw78lk1H7kCdU3MXOG6CQ9PMbo8Wh4EkcyzZy7XEKr2OAF9N185VUfOXxLx3mM+qKMDvaknGum+DubFOSVPjEVMA+YlCigx8GvQKBgQDD5c4NjJygp+u4Opx17AxorhEXf6r5XQDdit/gMgxcAumw69jjlCPyJcVgHKIY/MDIooKVDpCNIIiRqfwknWYxzFp4r8tgNKZsQFEZ3L7pTn8jNztft0zy2J+UpXNtyFIDBTHT2+9PAUnTsK/YOGaZd4Fd983nnGw1eSj/ajM2nwKBgQC2wQqBy4/8UE5NZe90poD/g8331kU/mBLXy9f3NtSqUAE9DHlZJIfqwrJenzNYV+yg5cdkpDvsWqUWC52OgpHKvHSLyoCwnBRZfqNAtUJLFvgxcV5T0kvrnmMQL1fCrUIOxcjdr0ip5NoXcnu/xFETzF1138mOyowT4xJ42TutswKBgQCCCFKkL8fv5EbVfSJKLCt4eMKjpHzrFU7zv7EnclE96jkQ1Rycw8Kwg13mlFsM1wlopGalZouRAh1lAz55V3l0aL9NCPOooootpOuwjRS0bQR7bbgdquCK+jvDQafDIYs+sf4HMSBCgwpsWAYBMj74c5kNtOWabfxt6kTKdcYU5QKBgQCUj4pWBr9ucW2lt1aXsf6tN10IujMixiGTMM7H1Ne99zl6ghhnIa4nZcwP5USc7SSbiw6yvltEAE+xAxI6VePkNZxcQuqoJsjYE3zsTiys0+hAcRMn+ozi5adL8eBajfNkBN4Lb8EW8sVjSBpWwmTSPlA/UQMNQ5PpWq6adKTxxwKBgQCwJC1MtCJ8aY6tnXrmBnMhE6xDmrc6CKkaouAnkjaYv1cd4jX3ucKIjUNNlLuQdHWVpYZ6p52GpOOP4gmR3WlvUnSeYe/dgRwIFbQsNwObi5LmUTIg2Q6kzI+nShgSDBirC3W1E6oqiCoDDQCFeU+XMu+JP6iaMAPDTdWO/aa73g==';
const PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp2k6kD3SRuBNEjGuFTbOMOtRxF2bukpfcIuyPzEFGAggYVRPYFN3z7i2Ty9d32wbo+MRsL26x6xYjtPDCuJ5kZwDclhOSzVDWBFN8LaNHZm0i5z9tLInh5eyyoVFI5D6Jo2dgDmaloTXAD3atrf5sD+3wKVy8zh8nJAaazPSNTd0paR0mWrVXaR6M6pUYTJJN5ttnn0noHdDoxYj8Oepk0E6YIOpAOWtQapkWQqWFfuB4PlUMOam6BGUy/H0/DUzzql0l82o8NTV1tOa2F8kqHwK3TMKdKGMGl7Rm9FI14OdlANR4aCwa0pbwlF0iESgowNLMUYTCUDI3APfd1XyWQIDAQAB';

const config = {
  appId: '2019070265734364',
  privateKey: PRIVATE_KEY,
  alipayPublicKey: PUBLIC_KEY
};

const alipaySdk = new AlipaySdk(config);

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

  const result = await alipaySdk.exec(method, params);

  console.log(result);
  return result;
}

export async function notify(out_trade_no: string) {

}

export async function check(out_trade_no: string) {
  
}
