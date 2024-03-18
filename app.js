const express = require("express");
//创建express实例
const app = express();
//导入解析器（用来处理表单数据）
const bodyParser = require("body-parser");
//导入cors全局挂载
const cors = require("cors");
// parse application/x-www-form-urlencoded
//当extended为false时，值为数组或字符串，当为true时可以是任意类型
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.listen(3007, () => {
  console.log("sas");
});
