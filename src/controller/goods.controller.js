const path = require('path');

const { fileUploadError, unSupportedFileType, publishGoodsError } = require('../constant/err.type');

class GoodsController {
  async upload(ctx, next) {
    const { file } = ctx.request.files;
    const fileTypes = ['image/jpeg', 'image/png'];
    if (file) {
      if (!fileTypes.includes(file.type)) {
        return ctx.app.emit('error', unSupportedFileType, ctx);
      }
      ctx.body = {
        code: 0,
        message: "商品图片上传成功",
        result: {
          goods_img: path.basename(file.path)
        }
      }
    } else {
      return ctx.app.emit('error', fileUploadError, ctx);
    }
  }

  async create(ctx) {
    // 直接调用service的createGoods方法
    try {
      const res = await createGoods(ctx.request.body);
      ctx.body = {
        code: 0,
        message: '发布商品成功',
        result: res
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', publishGoodsError, ctx)
    }
  }
}

module.exports = new GoodsController();