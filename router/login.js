// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
//导入expressJoi
const expressJoi = require("@escook/express-joi");
//导入验证规则
const { schema } = require("../limit/login");
// 引入路由处理函数
const loginHandler = require("../router_handle/login");

// router.post("/register", expressJoi(login_limit), loginHandler.register);
//注册接口
router.post("/register", (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // 验证失败时，抛出错误给中间件
    return next(error);
  }
  loginHandler.register(req, res, next);
});
//登录接口
router.post("/login", (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    // 验证失败时，抛出错误给中间件
    return next(error);
  }
  loginHandler.login(req, res, next);
});
// router.post("/login", expressJoi(login_limit), loginHandler.login);

//暴露路由
module.exports = router;
