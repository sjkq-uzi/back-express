const joi = require("joi");
const express = require("express");
const { createServer } = require("http");
//引入socket.io
const { Server } = require("socket.io");
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

app.use(
  jwt({
    secret: jwtconfig.jwtSecretKey,
    algorithms: ["HS256"],
  }).unless({
    // 除了这个接口，其他都需要验证
    // 这里的接口是登录接口，token是在登陆之后才生成的，不需要验证
    path: [/^\/api\//],
  })
);

//引入路由
const loginRouter = require("./router/login");
app.use("/api", loginRouter);

const userRouter = require("./router/userinfo");
app.use("/users", userRouter);

const utilsRouter = require("./router/utils");
app.use("/utils", utilsRouter);

const gptRouter = require("./router/gpt");
app.use("/gpt", gptRouter);
//对不符合joi规则的情况进行报错提醒
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    return res.send({
      status: 1,
      message: "输入的数据不符合验证规则",
    });
  } else {
    return res.cc(err);
  }
});
const server = createServer(app);
const io = new Server(server, {
  cors: true, //允许跨域
});
const groupList = {};
//监听连接状态
io.on("connection", (socket) => {
  console.log("有新的连接", socket);
  //加入房间
  socket.on("join", ({ name, room }) => {
    console.log(name, room);
    //创建一个房间
    socket.join(room);
    //判断是否存在房间
    if (groupList[room]) {
      groupList[room].push({ name, room, id: socket.id });
    } else {
      groupList[room] = [{ name, room, id: socket.id }];
    }
    io.emit("groupList", groupList); //连接为维度。相当于发送给连接来的所有人
    // socket.emit("groupList", groupList); //浏览器为维度的 自己
    // socket.broadcast.emit("groupList", groupList); //广播给所有其他人
    //广播给房间内的其他所有人
    socket.broadcast.to(room).emit("message", {
      user: "管理员",
      text: `欢迎${name}进入房间`,
    });
  });
  //发送消息
  socket.on("message", ({ text, room, user }) => {
    socket.broadcast.to(room).emit("message", {
      text,
      user,
    });
  });
  //断开链接内置事件
  socket.on("disconnect", () => {
    Object.keys(groupList).forEach((key) => {
      let leval = groupList[key].find((item) => item.id === socket.id);
      if (leval) {
        socket.broadcast
          .to(leval.room)
          .emit("message", { user: "管理员", text: `${leval.name}离开了房间` });
      }
      groupList[key] = groupList[key].filter((item) => item.id !== socket.id);
    });
    socket.broadcast.emit("groupList", groupList);
  });
});
server.listen(3007, () => {
  console.log("server is running at http://127.0.0.1:3007");
});
