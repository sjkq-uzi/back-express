// import OpenAi from "openai";

const OpenAi = require("openai");
const dontenv = require("dotenv");
let mes = [];
const dataMap = new Map();
dontenv.config();
const openai = new OpenAi({
  apiKey: process.env["API-KEY"],
  baseURL: "https://api.gpt.ge/v1",
});
exports.chat = async (req, res) => {
  const { message, sessinoId } = req.body;
  if (dataMap.has(sessinoId)) {
    mes = dataMap.get(sessinoId);
  } else {
    mes = [];
  }
  mes.push({ role: "user", content: message });
  console.log(mes);
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: mes,
    stream: true,
  });
  //流式相应数据
  for await (const chunk of stream) {
    // 使用 res.write 逐步发送数据
    res.write(chunk.choices[0]?.delta?.content || "");
  }
  dataMap.set(sessinoId, mes);
  // 所有数据发送完毕，结束响应
  res.end();
};
exports.draw = async (req, res) => {
  const { prompt } = req.body;
  console.log(req.body);
  const completion = await openai.images.generate({
    model: "dall-e-3", //使用的模型
    prompt,
    n: 1,
    size: "1024x1024",
  });
  res.json({
    result: completion.data[0].url, //返回图片地址
  });
};
