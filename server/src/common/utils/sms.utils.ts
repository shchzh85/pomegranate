
import * as _ from 'lodash';
import axios  from 'axios'
import urlencode from 'urlencode';

async function sendSms(params: {
  user: string;
  pass: string;
  phone: string;
  content: string;
}) {
  const { user, pass, phone, content } = params;
  const url = `http://utf8.api.smschinese.cn/?Uid=${user}&Key=${pass}&smsMob=${phone}&smsText=${urlencode(content)}`;
  const response = await axios.get(url);
  return _.get(response, 'data') == 1;
}

export { sendSms };
