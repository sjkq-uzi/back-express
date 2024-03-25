// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
//导入expressJoi
const expressJoi = require("@escook/express-joi");
//导入验证规则
const { login_limit } = require("../limit/login");
// 引入路由处理函数
const loginHandler = require("../router_handle/login");
router.post("/register", expressJoi(login_limit), loginHandler.register);
router.post("/login", expressJoi(login_limit), loginHandler.login);
//暴露路由
module.exports = router;
