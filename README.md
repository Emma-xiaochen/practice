## 一、项目的初始化

### 1、npm初始化

```
npm init -y
```

生成`packag.json`文件：

- 记录项目的依赖

### 2、git初始化

```
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



