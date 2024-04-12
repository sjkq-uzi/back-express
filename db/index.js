//创建数据库
const mysql = require("mysql");
// 创建一个mysql连接池
const db = mysql.createPool({
  // 主机地址
  host: "localhost",
  // 用户名
  user: "back_system",
  // 密码
  password: "123456",
  // 数据库名
  database: "back_system",
});
module.exports = db;
