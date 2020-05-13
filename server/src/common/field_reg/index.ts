import { FieldReg } from '../interfaces';

export default {
  phone: {
    reg: () => /^1[3-8]{1}[0-9]{9}/,
    message: () => '手机号格式为11位数字.',
  },
  password: {
    reg: () => /\w{6,18}/,
    message: () => '密码由字母或数字组成，长度为6-18位.',
  },
  ip: {
    reg: () => /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    message: () => 'ipv4地址格式错误.',
  },
  username: {
    reg: () => /^[a-zA-Z]\w{5,17}/,
    message: () => '账号首字母开头，长度为6-18个字符.',
  },
  scode: {
    reg: () => /s/,
    message: () => '邀请码个格式错误',
  },
  smsCode: {
    reg: (opts) => opts?.len ? RegExp(`\\d{${opts.len}}`) : /\d+/,
    message: (opts) => opts?.len ? `短信验证码长度为${opts.len}个数字` : '邀请码格式错误.',
  },
  smsId: {
    reg: () => /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
    message: () => '短信id格式错误.',
  },
} as {
  [key: string]: FieldReg;
};
