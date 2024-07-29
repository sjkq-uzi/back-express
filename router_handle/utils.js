//处理文件路径
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();
// 在加载时强制工作簿计算属性
workbook.calcProperties.fullCalcOnLoad = true;
exports.fileUpload = async (req, res) => {
  console.log("fileUpload", req.files);

  console.log(req.headers);
  // 读取.xlsx文件
  workbook.xlsx
    .readFile(req.files[0].path)
    .then(() => {
      // 获取第一个工作表
      const worksheet = workbook.getWorksheet(1);
      // 遍历工作表中的所有行（包括空行）
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`);
      });
      // 创建一个新的工作表
      const worksheet1 = workbook.addWorksheet("Sheet1");
      //设置表头
      worksheet1.columns = [
        {
          header: "姓名",
          key: "name",
          width: 10,
        },
        {
          header: "年龄",
          key: "age",
          width: 10,
        },
      ];
      // 将工作簿保存到文件
      workbook.xlsx
        .writeFile("test.xlsx")
        .then(() => {
          console.log("Excel文件已保存");
        })
        .catch((error) => {
          console.log("保存Excel文件时出错：", error);
        });

      res.send({
        message: "文件上传成功",
      });
    })
    .catch((error) => {
      res.cc(error);
    });
};
