## 一、项目的初始化

### 1、npm初始化

```shell
npm init -y
```

生成`packag.json`文件：

- 记录项目的依赖

### 2、git初始化

```shell
git init
```

生成`.git`隐藏文件夹，git的本地仓库

### 3、创建README文件



## 二、搭建项目

### 1、安装koa框架

```
npm install koa
```

### 2、 编写最基础的app

创建`src/main.js`

```js
const Koa = require('koa');

const app = new Koa();

app.use((ctx, next) => {
  ctx.body = 'hello world!';
})

app.listen(3000, () => {
  console.log('server is running on http://localhost:3000');
});
```

### 3、测试

在终端，使用`node src/main.js`

![image-20211202181600040](C:\Users\cm\AppData\Roaming\Typora\typora-user-images\image-20211202181600040.png)



## 三、项目的基本优化

### 1、自动重启服务

- 安装nodemon工具

  ```shell
  npm install nodemon
  ```

- 编写package.json脚本

  ```js
  "scripts": {
      "dev": "nodemon ./src/main.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

- 执行`npm run dev`启动服务

![image-20211202183809786](C:\Users\cm\AppData\Roaming\Typora\typora-user-images\image-20211202183809786.png)

### 2、读取配置文件

安装dotenv，读取根目录中的`.env`文件，将配置写到`process.env`中

```shell
npm install dotenv
```

创建.env文件

```
APP_PORT=8000;
```

创建`src/config/config.default.js`

```js
const dotenv = require('dotenv');

dotenv.config()

// console.log(process.env.APP_PORT);

module.exports = process.env
```

改写main.js

```js
const Koa = require('koa');

const { APP_PORT } = require('./config/config.default.js');

const app = new Koa();

app.use((ctx, next) => {
	ctx.body = 'hello api';
})

app.listen(APP_PORT, () => {
	console.log(`server is runnning on http://localhost:${APP_PORT}`);
}) 
```



