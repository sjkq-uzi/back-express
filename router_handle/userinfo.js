const db = require("../db/index");
//导入加密的中间件
const bcrypt = require("bcryptjs");
//导入crypto生成uuid，每一个对应一个头像
const crypto = require("crypto");
//处理文件路径
const fs = require("fs");

//上传头像接口
exports.uploadAvatar = (req, res, next) => {
  //生成唯一标识
  const onlyId = crypto.randomUUID();
  let oldName = req.files[0].filename;
  let newName = Buffer.from(req.files[0].originalname, "latin1").toString(
    "utf8"
  );
  //文件重命名
  fs.renameSync(`./public/upload/${oldName}`, `./public/upload/${newName}`);
  const sql = "insert into image set ?";
  //插入数据库
  db.query(
    sql,
    {
      image_url: `http://127.0.0.1:3007"${newName}`,
      onlyId,
    },
    (err, result) => {
      if (err) return res.cc(err);
      res.send({
        onlyId,
        status: 0,
        url: `http://127.0.0.1:3007"${newName}`,
      });
    }
  );
};
//绑定头像接口 接收onlyId account url
exports.bindAccount = (req, res, next) => {
  const { account, onlyId, url } = req.body;
  const sql = "update image set account = ? where onlyId = ?";
  db.query(sql, [account, onlyId], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows === 1) {
      const sql1 = "update users set image_url = ? where account = ?";
      db.query(sql1, [url, account], (err, result) => {
        if (err) return res.cc(err);
        res.send({
          status: 0,
          message: "修改成功",
        });
      });
    }
  });
};

//获取用户信息 接收id
exports.getUserInfo = (req, res) => {
  const sql = "select * from users where id = ?";
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err);
    res.send({
      result,
    });
  });
};
//修改用户姓名 接受id 姓名
exports.changeName = (req, res) => {
  const { id, name } = req.body;
  const sql = "update users set name = ? where id = ?";
  db.query(sql, [name, id], (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "修改成功",
    });
  });
};
//修改性别 接收id 姓别
exports.changeGender = (req, res) => {
  const { id, gender } = req.body;
  const sql = "update users set sex = ? where id = ?";
  db.query(sql, [gender, id], (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "修改成功",
    });
  });
};
//修改邮箱 接收id 邮箱
exports.changeEmail = (req, res) => {
  const { id, email } = req.body;
  const sql = "update users set email = ? where id = ?";
  db.query(sql, [email, id], (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "修改成功",
    });
  });
};