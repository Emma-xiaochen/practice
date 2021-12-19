/**
 * @description: 控制器——实现业务逻辑
 * @author: Emma
 */

const { createUser } = require('../service/user.service')

const { userRegisterError } = require('../constant/err.type')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body;

    // 2. 操作数据库
    try {
      const res = await createUser(user_name, password);
      // console.log(res);
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name,
        }
      };
    } catch(err) {
      console.log(err);
      ctx.app.emit('error', userRegisterError, ctx);
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body;
    ctx.body = `欢迎回来,${user_name}`;
  }
}

module.exports = new UserController();