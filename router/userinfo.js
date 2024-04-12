// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
//导入expressJoi
const expressJoi = require("@escook/express-joi");
// 引入路由处理函数
const userInfoHandler = require("../router_handle/userinfo");
//上传头像
router.post("/uploadAvatar", userInfoHandler.uploadAvatar);
//绑定头像,账号
router.post("/bindAccount",userInfoHandler.bindAccount);
//获取用户信息
router.post("/getUserInfo",userInfoHandler.getUserInfo);
//修改用户姓名
router.post("/changeName",userInfoHandler.changeName);
//修改用户性别
router.post("/changeGender",userInfoHandler.changeGender);
//修改用户邮箱
router.post("/changeEmail",userInfoHandler.changeEmail);
module.exports = router;  
