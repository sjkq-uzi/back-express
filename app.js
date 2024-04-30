const joi = require("joi");
const express = require("express");
//创建express实例
const app = express();
//导入解析器（用来处理表单数据）
const bodyParser = require("body-parser");
// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
const multer = require("multer");

//导入cors全局挂载 处理跨域问题
const cors = require("cors");
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({ dest: "./public/upload" });

app.use(upload.any());
// 静态托管
app.use(express.static("./public"));

//当extended为false时，值为数组或字符串，当为true时可以是任意类型
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//解决跨域
app.use(cors());
//设置跟报错中间件。挂载cc方法
app.use((req, res, next) => {
  //status=0为成功，=1为失败，默认是1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      //判断err是否为错误对象
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

const jwtconfig = require("./jwt_config/index");
const { expressjwt: jwt } = require("express-jwt");

// app.use(
//   jwt({
//     secret: jwtconfig.jwtSecretKey,
//     algorithms: ["HS256"],
//   }).unless({
//     // 除了这个接口，其他都需要验证
//     // 这里的接口是登录接口，token是在登陆之后才生成的，不需要验证
//     path: [/^\/api\//],
//   })
// );

//引入路由
const loginRouter = require("./router/login");
app.use("/api", loginRouter);

const userRouter = require("./router/userinfo");
app.use("/users", userRouter);
//对不符合joi规则的情况进行报错提醒
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    console.log("1111111", err);
    return res.cc(err);
  } else {
    return res.cc(err);
  }
});

app.listen(3007, () => {
  console.log("server is running at http://127.0.0.1:3007");
});
