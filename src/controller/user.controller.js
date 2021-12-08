/**
 * @description: 控制器——实现业务逻辑
 * @author: Emma
 */

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