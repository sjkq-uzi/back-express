// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
//导入expressJoi
const expressJoi = require("@escook/express-joi");
// 引入路由处理函数
const userInfoHandler = require("../router_handle/userinfo");
const {
  name_limit,
  email_limit,
  password_limit,
  forget_password_limit,
} = require("../limit/user");

//上传头像
router.post("/uploadAvatar", userInfoHandler.uploadAvatar);
//绑定头像,账号
router.post("/bindAccount", userInfoHandler.bindAccount);
//修改密码
router.post(
  "/changePassword",
  expressJoi(password_limit),
  userInfoHandler.changePassword
);
//获取用户信息
router.post("/getUserInfo", userInfoHandler.getUserInfo);
//修改用户姓名
router.post("/changeName", expressJoi(name_limit), userInfoHandler.changeName);
//修改用户性别
router.post("/changeGender", userInfoHandler.changeGender);
//修改用户邮箱
router.post(
  "/changeEmail",
  expressJoi(email_limit),
  userInfoHandler.changeEmail
);
//验证邮箱账号是否正确
router.post("/verifyAccountAndEmail", userInfoHandler.verifyAccountAndEmail);
//登录页面忘记密码---修改密码
router.post(
  "/changePasswordLogin",
  expressJoi(forget_password_limit),
  userInfoHandler.changePasswordLogin
);
module.exports = router;
