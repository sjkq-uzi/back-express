const db = require("../db/index");
//导入加密的中间件
const bcrypt = require("bcryptjs");
//导入jwt，用于生成token
const jwt = require("jsonwebtoken");
//导入jwt加密的配置文件
const jwtconfig = require("../jwt_config/index");

//向外部暴露register注册方法
exports.register = (req, res) => {
  const reginfo = req.body;
  //第一步判断前端传来的数据是否为空
  if (!reginfo.account || !reginfo.password) {
    return res.send({
      status: 1,
      message: "账号或密码不能为空",
    });
  }
  //第二部判断账号是否已经存在
  const sql = "select * from users where account=?";
  //第一个参数为执行语句，第二个为传入的参数，第三个为回调函数
  db.query(sql, reginfo.account, (err, results) => {
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: "账号已存在",
      });
    }
    //第三步对用户输入的密码加密，使用加密中间件(bcrypt)
    //第一个参数为传入的密码，第二个参数为加密后的长度
    reginfo.password = bcrypt.hashSync(reginfo.password, 10);
    //第四步将用户信息插入数据库
    const sql1 = "insert into users set ?";
    const identity = "用户";
    const create_time = new Date();
    db.query(
      sql1,
      {
        account: reginfo.account,
        password: reginfo.password,
        identity,
        create_time,
        //初始状态未冻结 0
        status: 0,
      },
      (err, results) => {
        //插入失败的情况
        //affectedRows为影响的行数
        if (results.affectedRows !== 1) {
          return res.send({
            status: 1,
            message: "注册失败，请稍后重试",
          });
        }
        //插入成功的情况
        res.send({
          status: 1,
          message: "注册成功",
        });
      }
    );
  });
};

exports.login = (req, res) => {
  // res.send("登录");
  const logininfo = req.body;
  //第一步判断前端传来的账号是否存在
  const sql = "select * from users where account=?";
  //执行sql语句
  db.query(sql, logininfo.account, (err, results) => {
    //执行sql语句失败的情况，一般在数据库断开时
    if (err) return res.cc(err);
    //数据库中没有该账号的情况
    if (results.length !== 1) return res.cc("登录失败");
    //第二步对前端传来的密码解密
    const compareResult = bcrypt.compareSync(
      logininfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc("密码错误,登录失败");
    //第三步对账号是否冻结进行判定
    if (results[0].status === 1) return res.cc("账号已被冻结，无法登录");
    //第四步生成token
    //剔除加密后的密码，头像、创建时间、跟新时间
    const user = {
      ...results[0],
      password: "",
      avatar: "",
      create_time: "",
      update_time: "",
    };
    //设置token的过期时间
    const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
      expiresIn: "7h",
    });
    //将token返回给前端
    res.send({
      results: results[0],
      status: 0,
      message: "登录成功",
      token: "Bearer " + tokenStr,
    });
  });
};
