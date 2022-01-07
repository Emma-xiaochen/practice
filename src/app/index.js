/**
 * @description: 业务相关的
 * @author: Emma
 */

const Koa = require('koa');
const KoaBody = require('koa-body');

const errHandler = require('./errHandler')

const router = require('../router');

const app = new Koa();

app.use(KoaBody());
app.use(router.routes());

// 统一的错误处理
app.on('error', errHandler);

module.exports = app;