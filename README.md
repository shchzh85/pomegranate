# Pomegranate Project

## 1. Setup with docker

### 1.1. 安装docker
### 1.2. 设置环境变量
在根目录下创建.env文件，设置以下变量: (根据实际情况修改)
```
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=cyvideo

REDIS_HOST=redis

WEB_SERVER_EXPOSE_PORT=9000
DB_EXPOSE_PORT=13307

```

### 1.3. 启动docker-composer
其中-d表示以daemon方式运行
```
$ docker-compose -f docker-compose.dev.yml -p ${your name} up [-d]
```

### 1.4. 停止docker-composer
```
$ docker-compose -f docker-compose.dev.yml -p ${your name} down
```

### 1.5. 查看所有docker实例
```
$ docker container ls -a
```

### 1.6. 进入某个docker实例
```
$ docker exec -it ${container name} bash
```

### 1.7. 重启某个docker实例
```
$ docker container restart ${container name}
```
