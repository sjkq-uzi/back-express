// 引入express模块
const express = require("express");
// 创建一个路由实例
const router = express.Router();
// 引入路由处理函数
const gptHandler = require("../router_handle/gpt");

router.post("/chat", gptHandler.chat);
router.post("/draw", gptHandler.draw);
module.exports = router;
