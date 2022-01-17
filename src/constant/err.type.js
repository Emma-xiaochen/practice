/**
 * @description: 错误类型
 * @author: Emma
 */

module.exports = {
  // 用户模块相关
  userFormateError: {
    code: '10001',
    message: '用户名或密码不能为空',
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
  // 权限模块相关
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10102',
    message: '无效的token',
    result: ''
  },
  hasNotAdminPermission: {
    code: '10103',
    message: '没有管理员权限',
    result: ''
  },
  // 商品模块相关
  fileUploadError: {
    code: '10201',
    message: '商品图片上传失败',
    result: ''
  },
  unSupportedFileType: {
    code: '10202',
    message: '不支持该文件格式',
    result: ''
  },
  goodsFormatError: {
    code: '10203',
    message: '商品参数格式错误',
    result: ''
  }
}