/**
 * @description: router层——建立一个映射关系，将不同的url转发给控制器不同的方法
 * @author: Emma
 */

const Router = require('koa-router');

const { register, login } = require('../controller/user.controller')

const router = new Router({ prefix: '/users' });

// 注册接口
router.post('/register', register);

// 登录接口
router.post('/login', login);

module.exports = router;