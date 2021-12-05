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
# src/main.js

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
  npm install nodemon -D
  ```

- 编写package.json脚本

  ```js
  # package.json
  
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
# .env

APP_PORT=8000;
```

创建`src/config/config.default.js`

```js
# src/config/config.default.js

const dotenv = require('dotenv');

dotenv.config()

// console.log(process.env.APP_PORT);

module.exports = process.env
```

改写main.js

```js
# src/main.js

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



## 四、添加路由

路由：根据不同的URL，调用对应处理函数

### 1、安装koa-router

```shell
npm install koa-router
```

步骤：

- 导入包
- 实例化对象
- 编写路由
- 注册中间件

### 2、编写路由

创建`src/router`目录，编写`user.route.js`

```js
# src/router/user.route.js

const Router = require('koa-router');

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
    ctx.body = 'hello users';
})

module.exports = router;
```

### 3、改写main.js

```js
# src/main.js

const Koa = require('koa');

const { APP_PORT } = require('./config/config.default');

const userRouter = require('./router/user.route');

const app = new Koa();

app.use(userRouter.routes());

app.listen(APP_PORT, () => {
    console.log(`server is running on http://localhost:${APP_PORT}`)
});
```



## 五、目录结构优化

### 1、将http服务和app业务拆分

创建`src/app/index.js`

```js
# src/app/index.js

const Koa = require('koa');

const userRouter = require('../router/user.route');

const app = new Koa();

app.use(userRouter.routes());

module.exports = app;
```

改写main.js

```js
# src/main.js

const { APP_PORT } = require('./config/config.default');

const app = require('./app');

app.listen(APP_PORT, () => {
	console.log(`server is running on http://localhost:${APP_PORT}`);
});
```

### 2、将路由和控制器拆分

路由：解析URL，分发给控制器对应的方法

控制器：处理不同的业务

改写`user.route.js`

```js
# src/router/user.route.js

const Router = require('koa-router');

const { register,  login } = require('../controller/user.controller');

const router = new Router({ prefix: '/users' });

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);

module.exports = router;
```

创建`controller/user.controller.js`

```js
# src/controller/user.controller.js

class UserController {
	async register(ctx, next) {
		ctx.body = '用户注册成功';
	}
	
	async login(ctx, next) {
		ctx.body = '用户登录成功';
	}
}

module.exports = new UserController();
```



## 六、解析body

### 1、安装koa-body

```shell
npm install koa-body
```

### 2、注册中间件

改写`app/index.js`

```js
# app/index.js

const KoaBody = require('koa-body');

app.use(KoaBody());
```

![](C:\Users\cm\AppData\Roaming\Typora\typora-user-images\image-20211205170857411.png)

### 3、解析请求数据

改写`controller/user.controller.js`

```js
# src/controller/user.controller.js

const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body;
    // 2. 操作数据库
    const res = await createUser(user_name, password);
    console.log(res);
    // 3. 返回结果
    ctx.body = ctx.request.body;
  }

  async login(ctx, next) {
    ctx.body = '登录成功';
  }
}

module.exports = new UserController();
```

### 4、拆分service层

service层主要是做数据库处理

创建`src/service/user.service.js`

```js
# src/service/user.service.js

class userService {
	async createUser(user_name, password) {
		// todo: 写入数据库
		return '写入数据库成功';
	}
}
```

