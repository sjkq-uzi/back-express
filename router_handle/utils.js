//处理文件路径
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();
// 在加载时强制工作簿计算属性
workbook.calcProperties.fullCalcOnLoad = true;
// exports.fileUpload = async (req, res) => {
//   console.log("fileUpload", req.files);
//   // 读取.xlsx文件
//   workbook.xlsx
//     .readFile(req.files[0].path)
//     .then(() => {
//       // 获取第一个工作表
//       const worksheet = workbook.getWorksheet(1);
//       // return res.send({
//       //   message: "文件上传成功",
//       // });
//       // 遍历工作表中的所有行（包括空行）
//       worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//         console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`);
//       });
//     })
//     .catch((error) => {
//       res.cc(error);
//     });
// };
exports.fileUpload = async (req, res) => {
  fs.readFile(req.files[0].path, "utf8", (err, data) => {
    if (err) res.cc(err);
    const regex = /\{([^}]*)\}/g; // 'g' 标志用于全局搜索，匹配多个结果
    console.log("data==", data);
    const matches = data.match(regex);
    // 提取大括号内的值（不包含大括号）
    const values = matches.map((match) => match.replace(/^\{|\}$/g, ""));
    const arr = values[0].split(",");
    console.log(arr);

    res.send();
  });
};
// const filePath = "./public/upload/test.xlsx";
// res.download(filePath, (err) => {
//   console.log("res= ", err);
// });
