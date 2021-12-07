/**
 * @description: server层——数据库处理
 * @author: Emma
 */

class UserService {
  async createUser(user_name, password) {
    // todo: 写入数据库
    return '写入数据库成功';
  }
}

module.exports = new UserService();