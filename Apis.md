1.账号相关

#### 注册,登陆,修改密码

> 1.注册
>
> 接口地址:/user/oauth/register
>
> 传入参数:
>
> > username 用户名
> >
> > password1 登录密码
> >
> > password2 重复登录密码
> >
> > dpassword1 交易密码
> >
> > dpassword2 重复交易密码
> >
> > invitecode 邀请码
> >
> > messagecode 短信验证码
>
> 注册逻辑
>
> > ````伪代码
> > //判断注册开关
> > if(注册开关关闭){
> > 	return {msg:'注册关闭'}
> > }
> > //判断短信验证码
> > if(短信开关开启){
> > 	if(post.messagecode != 服务端生成的码){
> > 		return {msg:'短信验证码错误'}
> > 	}
> > }
> > //判断2次输入
> > if(post.password1=post.password2){
> > 	return {msg:'两次输入密码不一致'}
> > }
> > if(post.dpassword1=post.dpassword2){
> > 	return {msg:'两次输入交易密码不一致'}
> > }
> > //判断上级是否存在
> > //使用邀请码寻找上级
> > var parent = findUserByInviteCode()
> > //上级不存在
> > if(empty(parent)){
> > 	return {msg:'上级不存在'}
> > }
> > //注册逻辑
> > var invitecode = 唯一邀请码
> > ...
> > 拼接insert data
> > ...
> > 开启DB事务
> > try{
> > 
> > 	insert入数据库
> > 
> > }catch(SQLException e){
> > 	//捕获用户名已存在
> > 	回滚事务;
> > 	return {msg:'用户名已存在'}
> > }finally{
> > 	
> > }
> > 给所有上级增加1名团队人数
> > 
> > 给用户生成数值为0的钱包.
> > 
> > 提交事务
> > return {msg:'注册成功'}
> > 
> > ````
> >
> > 



#### 通用API 获取用户数据,获取日志列表

> Api.php

#### 业务

> Seeds.php

#### C2C

> SeedC2c.php