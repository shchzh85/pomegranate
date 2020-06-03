# API列表

## 0. 概述
HOST=IP:Port，例如HOST

## 1. User

### 1.1. 注册发送短信:  
```
http://HOST/v1/user/sendSms
POST  'Content-Type: application/json'
{
  phone: '18700000001',
  type: 'register' | 'forgot'
}
```

### 1.2. 注册用户:  
```
http://HOST/v1/user/register
POST  'Content-Type: application/json'
{
  username: string;  // 电话号码
  password: string;  // 登录密码
  dpassword: string;  // 交易密码
  invitecode: string;  // 8位邀请码
  scode: string;  // 短信验证码
}
```

### 1.3. 登录
```
http://HOST/v1/user/login
POST  'Content-Type: application/json'
{
  username: string;  // 电话号码
  password: string;  // 登录密码
  version: string;  // 版本号，默认"2.0.0"
}
```

### 1.4. 忘记密码
```
http://HOST/v1/user/forgotPassword
POST  'Content-Type: application/json'
{
  username: string;  // 电话号码
  password: string;  // 新密码
  scode: string;  // 短信验证码
}
```

### 1.5. 修改登录密码
```
http://HOST/v1/user/setLoginPasswd  (必须处于登录状态)
POST  'Content-Type: application/json'
{
  password: string;  // 新密码
  dpassword: string;  // 交易密码
}
```

### 1.6. 修改交易密码
```
http://HOST/v1/user/setTradePasswd  (必须处于登录状态)
POST  'Content-Type: application/json'
{
  dpassword: string;  // 新交易密码
  scode: string;  // 短信验证码
}
```

### 1.7. 玩家是否存在
```
http://HOST/v1/user/userExists
POST  'Content-Type: application/json'
{
  phone: string; // 手机号码
}
```

### 1.8. 查询自己的数据
```
http://HOST/v1/user/getUser  (必须处于登录状态)
POST  'Content-Type: application/json'
{}
```

### 1.9. 登出
```
http://HOST/v1/user/logout  (必须处于登录状态)
POST  'Content-Type: application/json'
{}
```

### 1.10. 查询自己的数据(带钱包)
```
http://HOST/v1/user/userDetail  (必须处于登录状态)
POST  'Content-Type: application/json'
{}
```

## 2. C2C

### 2.1. 挂买单
```
http://HOST/v1/c2c/buy
POST  'Content-Type: application/json'
{
  num: numbe;  // 金种子个数
  dpasswod: string; // 交易密码
}
```

### 2.2. 点击购买
```
http://HOST/v1/c2c/sell
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
  dpassword: string; // 交易密码
}
```

### 2.3. 撤销挂单
```
http://HOST/v1/c2c/cancel
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
}
```

### 2.4. 付款
```
http://HOST/v1/c2c/pay
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
  dpassword: string; // 交易密码
  img: string; // 付款凭证地址
}
```

### 2.5. 确认
```
http://HOST/v1/c2c/confirm
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
  dpassword: string; // 交易密码
}
```

### 2.6. 投诉
```
http://HOST/v1/c2c/complaint
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
}
```

### 2.7. 匹配后撤销
```
http://HOST/v1/c2c/revoke
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
}
```

### 2.8. 当前所有订单(未匹配)
```
http://HOST/v1/c2c/list
POST  'Content-Type: application/json'
{
  listType: string; // buy | sell
  search: string; // 手机号(可选)
  start: number; // 分页(可选，默认0)
  len: number; // limit(可选，默认10)
}
```

### 2.9. 当前订单详情
```
http://HOST/v1/c2c/orderDetail
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
}
```

### 2.10. 已经匹配的订单
```
http://HOST/v1/c2c/myOrders
POST  'Content-Type: application/json'
{
  start: number; // 分页(可选，默认0)
  len: number; // limit(可选，默认10)
}
```

### 2.11. 填写收款地址
```
http://HOST/v1/c2c/certificate
POST  'Content-Type: application/json'
{
  dpassword: string; // 交易密码
  mz: string; // 名字
  bank: string; // 银行
  zhihang: string; // 支行
  cardno: string; //卡号
  img1: string; // 支付宝二维码地址
  img2: string; // 微信二维码地址
}
```

### 2.12. 获取付款人信息
```
http://HOST/v1/c2c/getSeller
POST  'Content-Type: application/json'
{
  oid: string; // 订单ID
}
```

### 2.13. 获取实名信息
```
http://HOST/v1/c2c/getCertification
POST  'Content-Type: application/json'
{}
```

### 2.14 价格
```
http://HOST/v1/c2c/price
POST  'Content-Type: application/json'
{}
```

### 2.15 价格线
```
http://HOST/v1/c2c/getPriceLine
POST  'Content-Type: application/json'
{}
```

# 3. Infomation

### 3.1. 获取资讯页顶部轮播图
```
http://HOST/v1/api/banners
POST  'Content-Type: application/json'
{}
```

### 3.2. 获取资讯列表（分页）
```
http://HOST/v1/api/news
POST  'Content-Type: application/json'
{
  start: number; // 分页(可选，默认0)
  len: number; // limit(可选，默认10)
}
```

### 3.3. 获取资讯消息详情
```
http://HOST/v1/api/newsDetail
POST  'Content-Type: application/json'
{
  id: number;
}
```

### 3.4. 获取商学院信息列表
```
http://HOST/v1/api/businessCollege
POST  'Content-Type: application/json'
{}
```

### 3.5. 获取客服二维码和邮箱
```
http://HOST/v1/api/CSQrcode
POST  'Content-Type: application/json'
{}
```

# 4. Quest

### 4.1. 随机获取一个视频
```
http://HOST/v1/quest/getVideo
POST  'Content-Type: application/json'
{}
```

### 4.2. 视频播放完成
```
http://HOST/v1/quest/videoCompleted
POST  'Content-Type: application/json'
{
  vid: number; 
}
```

### 4.3. 获得点赞状态
```
http://HOST/v1/quest/getVideoLiked
POST  'Content-Type: application/json'
{
  vid: number; 
}
```

### 4.4. 点赞
```
http://HOST/v1/quest/setVideoLiked
POST  'Content-Type: application/json'
{
  vid: number; 
}
```

### 4.5. 购买福田
```
http://HOST/v1/quest/apply
POST  'Content-Type: application/json'
{
  dpassword: string; // 交易密码
  qid: number; // 福田ID
}
```

### 4.6. 升级
```
http://HOST/v1/quest/levelup
POST  'Content-Type: application/json'
{}
```

### 4.7. 福田列表
```
http://HOST/v1/quest/listQuest
POST  'Content-Type: application/json'
{}
```

### 4.8. 我的福田
```
http://HOST/v1/quest/listMyQuest
POST  'Content-Type: application/json'
{}
```

### 4.9. 水滴记录
```
http://HOST/v1/quest/waterlist
POST  'Content-Type: application/json'
{}
```

### 4.10. 我的团队
```
http://HOST/v1/quest/myGroup
POST  'Content-Type: application/json'
{}
```
