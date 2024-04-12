const joi = require("joi");
//增加用户信息的一些验证规则
//required为必填项 
const name = joi
  .string()
  .pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/)
  .required();
  
const id = joi.required();
