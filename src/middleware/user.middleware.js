/**
 * @description: 用户模块相关的中间件
 * @author: Emma
 */

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

// 用户验证器
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;

  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body);
    ctx.app.emit('error', userFormateError, ctx);
    return;
  }
  
  await next();
}

// 验证用户
const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body;

  // if (await getUserInfo({ user_name })) {
  //   ctx.app.emit('error', userAlreadyExited, ctx);
  //   return;
  // }
  try {
    const res = await getUserInfo({user_name});
    if (res) {
      console.error('用户名已经存在', {user_name});
      ctx.app.emit('error', userAlreadyExited, ctx);
      return;
    }
  } catch (err) {
    console.log('获取用户信息错误', err);
    ctx.app.emit('error', userRegisterError, ctx);
    return;
  }

  await next();
}

// 密码加密
const cryptPassword = async(ctx, next) => {
  const { password } = ctx.request.body;

  const salt = bcrypt.genSaltSync(10);
  // 保存的是 密文
  const hash = bcrypt.hashSync(password, salt);

  ctx.request.body.password = hash;

  await next();
}

// 验证登录
const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在：报错)
  const { user_name, password } = ctx.request.body;

  try {
    const res = await getUserInfo({ user_name });

    if (!res) {
      console.error('用户名不存在', { user_name });
      ctx.app.emit('error', userDoesNotExist, ctx);
      return;
    }

    // 2. 密码是否匹配(不匹配：报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx);
      return;
    }
  } catch (err) {
    console.error(err);
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
