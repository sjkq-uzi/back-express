// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
// 引入路由处理函数
const utilsHandler = require("../router_handle/utils");
//上传头像
router.post("/fileUpload", utilsHandler.fileUpload);
module.exports = router;