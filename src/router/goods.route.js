const Router = require('koa-router');

const { auth, hadAdminPermission } = require('../middleware/auth.middleware');
const { validator } = require('../middleware/goods.middleware');


const { upload } = require('../controller/goods.controller');

const router = new Router({ prefix: '/goods' });

// 商品图片上传接口
router.post('/upload', auth, hadAdminPermission, upload);

// 发布商品接口
router.post('/', auth, hadAdminPermission, validator, (ctx) => {
  ctx.body = '发布商品成功'
});


module.exports = router;