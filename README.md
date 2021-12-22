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



## 七、数据库操作

sequelize ORM数据库工具

ORM：对象关系映射

- 数据表映射（对应）一个类
- 数据表中的数据行（记录）对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

### 1、安装sequelize

```shell
npm install mysql2 sequelize
```

### 2、编写配置文件

```
#.env

APP_PORT = 8000

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = 123456
MYSQL_DB = zdsc
```

### 3、连接数据库

`src/db/seq.js`

```js
# src/db/seq.js

const { Sequelize } = require('sequelize')

const {
	MYSQL_HOST,
  	MYSQL_PORT,
  	MYSQL_USER,
  	MYSQL_PWD,
  	MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  	host: MYSQL_HOST,
    dialect: 'mysql',
})

seq.authenticate().then(() => {
	console.log('数据库连接成功')
}).catch((err) => {
	console.log('数据库连接失败', err)
})

module.exports = seq;
```



## 八、创建User模型

### 1、拆分Model层

sequelize 主要通过 Model 对应数据表

创建`src/model/use.model.js`

```js
# src/model/use.model.js

const { DataTypes } = require('sequelize');

const seq = require('../db/seq');

// 创建模型（Model zd_user -> 表 zd_users ）
const User = seq.define('zd_user', {
	user_name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		comment: '用户名, 唯一'
	}, 
	password: {
		type: DataTypes.CHAR(64),
		allowNull: false,
		comment: '密码'
	},
	is_admin: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: 0,
		comment: '是否为管理员， 0: 不是管理员(默认); 1: 是管理员'
	}
});

// 强制同步数据库(创建数据表)
// User.sync({ force: true })

module.exports = User;
```



## 九、添加用户入库

所有数据库的操作都在 Service 层完成，Service 调用 Model 完成数据库操作

改写`src/service/user.service.js`

```js
# src/service/user.service.js

const User = require('../model/user.model');

class UserService {
	// 插入数据
    // User.create({
    //   // 表的字段
    //   user_name: user_name,
    //   password: password
    // })
    
    // await表达式： promise对象的值
    const res = await User.create({ user_name, password });
    // console.log(res);
    
    return res.dataValues
}

module.exports = new UserService()
```

同时，改写`user.controller.js`

```js
# user.controller.js

const { createUser } = require('../service/user.service');

class UserController {
	async register(ctx, next) {
		// 1. 获取数据
		// console.log(ctx.request.body);
		const { user_name, password } = ctx.request.body;
		// 2. 操作数据库
		const res = await createUser(user_name, password);
		console.log(res);
		// 3. 返回结果
		ctx.body = {
			code: 0,
			message: '用户注册成功',
			result: {
				id: res.id,
				user_name: res.user_name
			}
		}
	}
	
	async login(ctx, next) {
		ctx.body = '登录成功';
	}
}

module.exports = new UserController();
```



## 十、错误处理

在控制器中，对不同的错误进行处理，返回不同的错误提示，提高代码质量

```js
# src/controller/user.controller.js

const { createUser, getUserInfo } = require('../service/user.service');

class UserController {
	async register(ctx, next) {
		// 1. 获取数据
		// console.log(ctx.request.body);
		const { user_name, password } = ctx.request.body;
		
		// 合法性
		if(!user_name || !password ) {
			console.error('用户名或密码为空', ctx.request.body);
			ctx.status = 400;
			ctx.body = {
				code: '10001',
				message: '用户名或密码为空',
				result: ''
			}
			return;
		}
		// 合理性
		if(getUserInfo({ user_name })) {
			ctx.status = 409;
			ctx.body = {
				code: '10002',
				message: '用户已经存在',
				result: ''
			}
			return;
		}
		// 2. 操作数据库
		const res = await createUser(user_name, password);
		// console.log(res);
		// 3. 返回结果
		ctx.body = {
			code: 0,
			message: '用户注册成功',
			result: {
				id: res.id,
				user_name: res.user_name
			}
		}
	}
	async login(ctx, next) {
		ctx.body = '登录成功';
	}
}

module.exports = new UserController();
```

在`server`中封装函数

```js
# src/server/user.server.js

const User = require('../model/user.model');

class UserService {
	async createUser {
		// 插入数据
		// await表达式: promise对象的值
		const res = await User.create({ user_name, password });
		// console.log(res);
		
		return res.dataValues;
	}
	
	async getUserInfo({ id, user_name, password, is_admin }) {
		const whereOpt = {};
		
		id && Object.assign(whereOpt, { id });
		user_name && Object.assign(whereOpt, { user_name });
		password && Object.assign(whereOpt, { password });
		is_admin && Object.assign(whereOpt, { is_admin });
		
		const res = await User.findOne({
			attributes: ['id', 'user_name', 'password', 'is_admin'],
			where: whereOpt
		})
		return res ? res.dataValues : null;
	}
}

module.exports = new UserService()
```



## 十一、拆分中间件

为了使代码的逻辑更加清晰，我们可以拆分一个中间件层，封装多个中间件函数

![img](https://camo.githubusercontent.com/c9c69e7a6c7a03c0a8b04971148c33c3363ec421f9cacbbcaef0c1cf3e0a221a/687474703a2f2f696d6167652e62726f6a69652e636e2f696d6167652d32303231303532343135343335333532302e706e67)

### 1、拆分中间件

添加`src/middleware/user.middleware`

```js
# src/middleware/user.middleware

const { getUserInfo } = require('../service/user.service');
const { userFormateError, userAlreadyExited } = require('../constant/err.type');

const userValidator = async (ctx, next) => {
      const { user_name, password } = ctx.request.body;
      // 合法性
      if (!user_name || !password) {
		console.error('用户名或密码为空', ctx.request.body);
    	ctx.app.emit('error', userFormateError, ctx);
    	return;
      }

      await next();
}

const verifyUser = async (ctx, next) => {
	const { user_name } = ctx.request.body;

	if (getUerInfo({ user_name })) {
		ctx.app.emit('error', userAlreadyExited, ctx);
		return;
  }

	await next();
}

module.exports = {
  userValidator,
  verifyUser,
}
```

### 2、统一错误处理

- 在出错的地方使用`ctx.app.emit`提交错误
- 在 app 中通过`app.on`监听

编写统一的错误定义文件

```js
# src/constant/err.type.js

module.exports = {
	userFormateError: {
    	code: '10001',
    	message: '用户名或密码为空',
        result: '',
  	},
  	userAlreadyExited: {
    	code: '10002',
    	message: '用户已经存在',
    	result: '',
  	},
}
```

### 3、错误处理函数

```js
# src/app/errHandler.js

module.exports = (err, ctx) => {
	let status = 500;
    switch (err.code) {
    	case '10001':
      		status = 400;
      		break;
    	case '10002':
            status = 409;
      		break;
    	default:
      		status = 500;
  	}
  	ctx.status = status;
  	ctx.body = err;
}
```

改写`app/index.js`

```js
# src/app/index.js

const errHandler = require('./errHandler');
// 统一的错误处理
app.on('error', errHandler);
```



## 十二、加密

在将密码保存到数据库之前，要对密码进行加密处理

123123abc（加盐）加盐加密

### 1、安装 bcryptjs

```shell
npm install bcryptjs
```

### 2、编写加密中间件

```js
# middleware/user.middleware.js

const bcrypt = require('bcryptjs');

const cryptPassword = async(ctx, next) => {
	const { password } = ctx.request.body;
	
	const salt = bcrypt.genSaltSync(10);
	// hash保存的是 密文
	const hash = bcrypt.hashSync(passowrd, salt);
	
	ctx.request.body.password = hash;
	
	await next();
}
```

### 3、在router中使用

改写user.router.js

```js
# src/router/user.router.js

const Router = require('koa-router');

const {
	userValidator,
	verifyUser,
	cryptPassword
} = require('../middleware/user.middleware');

const { register, login } = require('../controller/user.controller');

const router = new Router({ prefix: '/users' });

// 注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register);

// 登录接口
router.post('/login', login);

module.exports = router
```



## 十三、登录验证

流程：

- 验证格式
- 验证用户是否存在
- 验证密码是否匹配

改写`src/middleware/user.middleware.js`

```js
# src/middleware/user.middleware.js

const bcrypt = require('bcryptjs');

const { getUserInfo } = require('../service/user.service');
const {
	userFormateError,
	userAlreadyExited,
	userRegisterError,
	userDoesNotExist,
	userLoginError,
	invalidPassword
} = require('../constant/err.type');

const userValidator = async(ctx, next) => {
	const { user_name, password } = ctx.request.body;
	// 合法性
	if(!user_name || !password) {
		console.error('用户名或密码为空', ctx.request.body);
		ctx.app.emit('error', userFormateError, ctx);
		return;
	}
	
	await next();
}

const verifyUser = async(ctx, next) => {
	const { user_name } = ctx.request.body;
	
	// if(await getUserInfo({ user_name })) {
	//		ctx.app.emit('error', userAlreadyExited, ctx);
    //		return;
	//	}
	try {
		const res = await getUserInfo({ user_name });
        
        if(res) {
            console.error('用户名已经存在', { user_name });
            ctx.app.emit('error', userAlreadyExited, ctx);
            return;
        }
	} catch(err) {
        console.error('获得用户信息错误', err);
        ctx.app.emit('error', userRegisterError. ctx);
        return;
    }
    
    await next();
}

const cryptPassword = async(ctx, next) => {
    const { password } = ctx.request.body;
    
    const salt = bcrypt.genSaltSync(10);
    // hash保存的是 密文
    const hash = bcrypt.hashSync(password, salt);
    
    ctx.request.body.password = hash;
    
    await next();
}

const verifyLogin = async(ctx, next) {
    // 1. 判断用户是否存在(不存在：报错)
    const { user_name, password } = ctx.request.body;
    
    try {
        const res = await getUserInfo({ user_name });
        
        if(!res) {
            console.error('用户名不存在', { user_name });
            ctx.app.emit('error', userDoesNotExist, ctx);
            return;
        }
        
        // 2. 密码是否匹配(不匹配：报错)
        if(!bcrypt.compareSync(password, res.password)) {
            ctx.app.emit('error', invalidPassword, ctx);
            return;
        }
    } catch(err) {
        console.log(err);
        ctx.app.emit('error', userLoginError, ctx);
        return;
    }
    
    await next();
}

module.exports = {
    userValidator,
    verifyUser,
    cryptPassword,
    verifyLogin
}
```

定义错误类型

```js
# src/constant/err.type

module.exports = {
    userFormateError: {
        code: '10001',
        message: '用户名或密码为空',
        result: ''
    },
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        result: ''
    },
    userRegisterError: {
        code: '10003',
        message: '用户注册错误',
        result: ''
    },
    userDoesNotExist: {
        code: '10004',
        message: '用户不存在',
        result: ''
    },
    userLoginError: {
        code: '10005',
        message: '用户登录失败',
        result: ''
    },
    invalidPassword: {
        code: '10006',
        message: '密码不匹配',
        result: ''
    },
}
```

改写路由

```js
# src/router/user.route.js

// 登陆接口
router.post('/login', userValidator, verifyLogin, login)
```



## 十四、用户的认证

登陆成功后，给用户办法一个令牌token，用户在以后的每一次请求中携带这个令牌。

jwt：json web token

- header：头部
- payload：载荷
- signature：签名

### 1、颁发 token

#### 1) 安装 jsonwebtoken

```shell
npm install jsonwebtoken	
```

#### 2) 在控制器中改写login方法

```js
# src/controller/user.controller.js

const { createUser, getUserInfo } = require('../service/user.service');


async login(ctx, next) {
	const { user_name } = ctx.request.body;
	
	// 1. 获取用户信息(在token的payload中，记录id, user_name, is_admin)
	try {
		// 从返回结果对象中提出password属性，将剩下的属性放到res对象
		const { password, ...res } = await getUserInfo({ user_name });
		
		ctx.body = {
			code: 0,
			message: '用户登录成功',
			result: {
				token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
			}
		}
	} catch(err) {
		console.error('用户登录失败', err);
	}
}
```

#### 3) 定义私钥

```js
# .env

JWT_SECRET = xzd;
```

### 2、用户认证

#### 1) 创建auth中间件

```js
# src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/config.default');

const { tokenExpiredError, invalidToken } = require('../constant/err.type');

const auth = async(ctx, next) => {
	const { authorization } = ctx.request.header;
	const token = authorization.replace('Bearer ', '');
	console.log(token);
	
	try {
		// user中包含了payload的信息(id, user_name, is_admin)
		const user = jwt.verify(token, JWT_SECRET);
		ctx.state.user = user;
	} catch(err) {
		swait(err.name) {
			case 'TokenExpiredError':
				console.error('token已过期', err);
				return ctx.app.emit('error', tokenExpiredError, ctx);
			case 'JsonWebTokenError':
				console.error('无效的token', err);
				return ctx.app.emit('error', invalidToken, ctx);
		}		
	}
	
	await next();
}

module.exports = {
    auth
}
```

#### 2) 改写router

```
// 修改密码接口
rouer.patch('/', auth, (ctx,next) => {
	console.log(ctx.state.user);
	ctx.body = '修改密码成功';
})
```

