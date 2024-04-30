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
  console.log("http://127.0.0.1:3007/user/uploadAvatar", newName);
  //文件重命名
  fs.renameSync(`./public/upload/${oldName}`, `./public/upload/${newName}`);
  const sql = "insert into image set ?";
  //插入数据库
  db.query(
    sql,
    {
      image_url: `http://127.0.0.1:3007/upload/${newName}`,
      onlyId,
    },
    (err, result) => {
      if (err) return res.cc(err);
      res.send({
        onlyId,
        status: 0,
        url: `http://127.0.0.1:3007/upload/${newName}`,
      });
    }
  );
};
//绑定头像接口 接收onlyId account url
exports.bindAccount = (req, res, next) => {
  console.log("bindAccount");
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
//修改密码接口 先输入旧密码
exports.changePassword = (req, res) => {
  // const { oldPassword, newPassword, id } = req.body;
  const sql = "select password from users where id = ?";
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err);
    //判断旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPassword,
      result[0].password
    );
    if (!compareResult) {
      return res.send({
        status: 1,
        message: "原密码输入错误",
      });
    }
    req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const sql1 = "update users set password = ? where id = ?";
    db.query(sql1, [req.body.newPassword, req.body.id], (err, result) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "修改成功",
      });
    });
  });
};

//获取用户信息 接收id
exports.getUserInfo = (req, res) => {
  const sql = "select * from users where id = ?";
  console.log("getuser");
  db.query(sql, req.body.id, (err, result) => {
    if (err) return res.cc(err);
    result[0].password = "";
    res.send(result[0]);
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
//修改密码--------验证账号邮箱是否一致 email account
exports.verifyAccountAndEmail = (req, res) => {
  const { account, email } = req.body;
  const sql = "select * from users where account = ?";
  db.query(sql, account, (err, result) => {
    if (err) return res.cc(err);
    if (email === result[0].email) {
      res.send({
        status: 0,
        message: "验证成功",
        id: result[0].id,
      });
    } else {
      res.send({
        status: 1,
        message: "验证失败",
      });
    }
  });
};
//登录页面---修改密码 password,account
exports.changePasswordLogin = (req, res) => {
  //加密
  req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10);
  const sql = "update users set password = ? where id = ?";
  db.query(sql, [req.body.newPassword, req.body.id], (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "修改成功",
    });
  });
};
