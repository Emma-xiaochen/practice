/**
 * @description: 用户模块相关的中间件
 * @author: Emma
 */

const { getUserInfo } = require('../service/user.service');
const { userFormateError, userAlreadyExited } = require('../constant/err.type');

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

  if (getUserInfo({ user_name })) {
    ctx.app.emit('error', userAlreadyExited, ctx);
    return;
  }
  await next();
}

module.exports = {
  userValidator,
  verifyUser
}
