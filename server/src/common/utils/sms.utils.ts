
import axios  from 'axios'
import urlencode from 'urlencode';

async function sendSms(params: {
  user: string;
  pass: string;
  phone: string;
  content: string;
}) {
  const { user, pass, phone, content } = params;
  const url = 'http://utf8.api.smschinese.cn/';
  return await axios.get(url, { params: {
    Uid: user,
    Key: pass,
    smsMob: phone,
    smsText: urlencode(content)
  }});
}

export { sendSms };
