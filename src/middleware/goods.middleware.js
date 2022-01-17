const { goodsFormatError } = require('../constant/err.type');

const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      goods_name: { type: 'string', require: true },
      goods_price: { type: 'number', require: true },
      goods_num: { type: 'number', require: true },
      goods_img: { type: 'string', require: true }
    })
  } catch (err) {
    console.error(err);
    goodsFormatError.result = err;
    return ctx.app.emit('error', goodsFormatError, ctx);
  }
  await next();
}

module.exports = {
  validator
}